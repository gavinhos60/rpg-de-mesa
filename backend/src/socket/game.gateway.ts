import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import {
  getSessionForSocket,
  parseSessionState,
  saveSessionState,
} from "../services/sessions.service";
import { rollDice, rollD20WithModifier, rollCompoundDice } from "../lib/dice";
import {
  getAbilityLabel,
  getSkillLabel,
  resolveAbilityModifier,
  resolveSkillModifier,
} from "../lib/sheetModifiers";
import type {
  BoardState,
  BoardToken,
  ChatMessage,
  SessionRuntimeState,
} from "../lib/gameTypes";
import {
  distanceMeters,
  metersPerSquareOf,
} from "../lib/gameTypes";

const JWT_SECRET = process.env.JWT_SECRET;

type AuthedSocket = Socket & {
  data: {
    userId: number;
    email: string;
    name?: string;
  };
};

type PersistTimers = Map<number, NodeJS.Timeout>;

export function attachGameSocket(httpServer: HttpServer) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado");
  }

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const persistTimers: PersistTimers = new Map();
  const runtime = new Map<number, SessionRuntimeState>();

  function schedulePersist(sessionId: number, state: SessionRuntimeState) {
    runtime.set(sessionId, state);
    const existing = persistTimers.get(sessionId);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      saveSessionState(sessionId, state).catch((error) =>
        console.error("Failed to persist session state", error)
      );
      persistTimers.delete(sessionId);
    }, 400);
    persistTimers.set(sessionId, timer);
  }

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (typeof socket.handshake.headers.authorization === "string"
          ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, "")
          : undefined);

      if (!token) {
        next(new Error("UNAUTHORIZED"));
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
      };

      socket.data.userId = decoded.userId;
      socket.data.email = decoded.email;
      next();
    } catch {
      next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (rawSocket) => {
    const socket = rawSocket as AuthedSocket;

    socket.on("session:join", async (payload: { sessionId: number }, ack?) => {
      try {
        const sessionId = Number(payload?.sessionId);
        const session = await getSessionForSocket(sessionId);

        if (!session || session.status !== "ACTIVE") {
          ack?.({ ok: false, error: "Sessão indisponível" });
          return;
        }

        const membership = session.campaign.members.find(
          (member) => member.userId === socket.data.userId
        );

        if (!membership) {
          ack?.({ ok: false, error: "Você não pertence a esta campanha" });
          return;
        }

        let state = runtime.get(sessionId);
        if (!state) {
          state = parseSessionState(session.state);
          runtime.set(sessionId, state);
        }

        const room = `session:${sessionId}`;
        await socket.join(room);

        const role = membership.role;
        const characters = session.campaign.characters;
        const members = session.campaign.members.map((member) => ({
          userId: member.userId,
          role: member.role,
          name: member.user.name,
          email: member.user.email,
        }));

        ack?.({
          ok: true,
          role,
          campaignId: session.campaignId,
          campaignName: session.campaign.name,
          roomCode: session.roomCode,
          characters,
          members,
          state,
        });

        socket.to(room).emit("session:presence", {
          userId: socket.data.userId,
          type: "join",
        });
      } catch (error) {
        console.error(error);
        ack?.({ ok: false, error: "Falha ao entrar na sessão" });
      }
    });

    async function loadContext(sessionId: number) {
      const session = await getSessionForSocket(sessionId);
      if (!session || session.status !== "ACTIVE") {
        throw new Error("SESSION_NOT_FOUND");
      }
      const membership = session.campaign.members.find(
        (member) => member.userId === socket.data.userId
      );
      if (!membership) {
        throw new Error("NOT_CAMPAIGN_MEMBER");
      }
      let state = runtime.get(sessionId);
      if (!state) {
        state = parseSessionState(session.state);
        runtime.set(sessionId, state);
      }
      return { session, membership, state, room: `session:${sessionId}` };
    }

    socket.on(
      "board:update",
      async (
        payload: { sessionId: number; board: BoardState },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );

          const incoming = payload.board;
          const isMaster = membership.role === "MASTER";

          if (isMaster) {
            state.board = {
              ...state.board,
              ...incoming,
              tokens: incoming.tokens ?? state.board.tokens,
              drawings: incoming.drawings ?? state.board.drawings,
              rulers: incoming.rulers ?? state.board.rulers,
              effects: incoming.effects ?? state.board.effects,
              gridSize: incoming.gridSize ?? state.board.gridSize,
              metersPerSquare:
                incoming.metersPerSquare ?? state.board.metersPerSquare,
              mapUrl:
                incoming.mapUrl !== undefined
                  ? incoming.mapUrl
                  : state.board.mapUrl,
              fogEnabled:
                incoming.fogEnabled !== undefined
                  ? incoming.fogEnabled
                  : state.board.fogEnabled,
              visionRadiusSquares:
                incoming.visionRadiusSquares !== undefined
                  ? incoming.visionRadiusSquares
                  : state.board.visionRadiusSquares,
              fogExemptUserIds:
                incoming.fogExemptUserIds !== undefined
                  ? incoming.fogExemptUserIds
                  : state.board.fogExemptUserIds,
              playerMapView:
                incoming.playerMapView !== undefined
                  ? incoming.playerMapView
                  : state.board.playerMapView,
            };
          } else {
            const userId = socket.data.userId;
            const incomingTokens = incoming.tokens ?? state.board.tokens;

            // Jogador: anotações + editar/criar apenas o próprio token.
            const mergedTokens = state.board.tokens.map((token) => {
              if (token.ownerUserId !== userId) return token;
              const next = incomingTokens.find((item) => item.id === token.id);
              if (!next) return token;
              return {
                ...token,
                hpMax: next.hpMax,
                hpCurrent: next.hpCurrent,
                customValue: next.customValue,
                conditions: next.conditions ?? token.conditions,
                x: next.x,
                y: next.y,
                imageUrl: next.imageUrl ?? token.imageUrl,
              };
            });

            for (const token of incomingTokens) {
              const exists = mergedTokens.some((item) => item.id === token.id);
              if (exists) continue;
              if (
                token.kind === "pc" &&
                token.ownerUserId === userId &&
                token.characterId
              ) {
                mergedTokens.push(token);
              }
            }

            state.board = {
              ...state.board,
              tokens: mergedTokens,
              drawings: incoming.drawings ?? state.board.drawings,
              rulers: incoming.rulers ?? state.board.rulers,
              effects: incoming.effects ?? state.board.effects,
            };
          }

          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("board:state", state.board);
          ack?.({ ok: true });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao atualizar o mapa" });
        }
      }
    );

    socket.on(
      "token:move",
      async (
        payload: {
          sessionId: number;
          tokenId: string;
          x: number;
          y: number;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const token = state.board.tokens.find(
            (item) => item.id === payload.tokenId
          );
          if (!token) {
            ack?.({ ok: false, error: "Token não encontrado" });
            return;
          }

          const canMove =
            membership.role === "MASTER" ||
            token.ownerUserId === socket.data.userId;

          if (!canMove) {
            ack?.({ ok: false, error: "Você não pode mover este token" });
            return;
          }

          token.x = payload.x;
          token.y = payload.y;

          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("token:moved", {
            tokenId: token.id,
            x: token.x,
            y: token.y,
          });
          ack?.({ ok: true });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao mover token" });
        }
      }
    );

    socket.on(
      "chat:message",
      async (
        payload: { sessionId: number; text: string; userName?: string },
        ack?
      ) => {
        try {
          const { state, room } = await loadContext(Number(payload.sessionId));
          const text = String(payload.text ?? "").trim();
          if (!text) {
            ack?.({ ok: false, error: "Mensagem vazia" });
            return;
          }

          const userName = payload.userName?.trim() || socket.data.email;

          if (/^\/r\s+/i.test(text)) {
            const result = rollDice(text);
            if (!result) {
              ack?.({ ok: false, error: "Notação de dado inválida" });
              return;
            }

            const message: ChatMessage = {
              id: randomUUID(),
              at: Date.now(),
              userId: socket.data.userId,
              userName,
              type: "roll",
              text: "Rolagem de dados",
              roll: {
                label: result.formula,
                formula: result.formula,
                rolls: result.rolls,
                modifier: result.modifier,
                total: result.total,
              },
            };
            state.chat = [...state.chat, message].slice(-200);
            schedulePersist(Number(payload.sessionId), state);
            io.to(room).emit("chat:message", message);
            ack?.({ ok: true, message });
            return;
          }

          const message: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName,
            type: "text",
            text,
          };
          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("chat:message", message);
          ack?.({ ok: true, message });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao enviar mensagem" });
        }
      }
    );

    socket.on(
      "chat:roll",
      async (
        payload: {
          sessionId: number;
          characterId: number;
          type: "skill" | "ability";
          key: string;
          userName?: string;
          advantage?: boolean;
        },
        ack?
      ) => {
        try {
          const { session, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const character = session.campaign.characters.find(
            (item) => item.id === Number(payload.characterId)
          );

          if (!character) {
            ack?.({ ok: false, error: "Personagem não encontrado" });
            return;
          }

          if (
            character.playerId !== socket.data.userId &&
            !session.campaign.members.some(
              (member) =>
                member.userId === socket.data.userId &&
                member.role === "MASTER"
            )
          ) {
            ack?.({ ok: false, error: "Sem permissão para rolar por este personagem" });
            return;
          }

          let label = payload.key;
          let modifier = 0;

          if (payload.type === "skill") {
            const resolved = resolveSkillModifier(character.sheet, payload.key);
            if (!resolved) {
              ack?.({ ok: false, error: "Perícia inválida" });
              return;
            }
            label = resolved.label;
            modifier = resolved.modifier;
          } else {
            const resolved = resolveAbilityModifier(character.sheet, payload.key);
            if (!resolved) {
              ack?.({ ok: false, error: "Atributo inválido" });
              return;
            }
            label = resolved.label;
            modifier = resolved.modifier;
          }

          const withAdvantage = Boolean(payload.advantage);
          const result = rollD20WithModifier(modifier, {
            advantage: withAdvantage,
          });
          const userName = payload.userName?.trim() || character.name;
          const message: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName,
            type: "roll",
            text: `${character.name} — ${label}${
              withAdvantage ? " (vantagem)" : ""
            }`,
            roll: {
              label: withAdvantage ? `${label} (vantagem)` : label,
              formula: result.formula,
              rolls: result.rolls,
              modifier: result.modifier,
              total: result.total,
            },
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("chat:message", message);
          ack?.({ ok: true, message });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha na rolagem" });
        }
      }
    );

    socket.on(
      "check:request",
      async (
        payload: {
          sessionId: number;
          type: "skill" | "ability";
          key: string;
          targetCharacterId?: number | null;
          userName?: string;
        },
        ack?
      ) => {
        try {
          const { membership, session, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre pode pedir testes" });
            return;
          }

          const label =
            payload.type === "skill"
              ? getSkillLabel(payload.key as never) || payload.key
              : getAbilityLabel(payload.key as never) || payload.key;

          const characters = session.campaign?.characters ?? [];
          let targetCharacterId: number | null =
            payload.targetCharacterId ?? null;
          let characterName: string | null = null;
          let targetUserId: number | null = null;

          if (targetCharacterId != null) {
            const character = characters.find(
              (item) => item.id === targetCharacterId
            );
            if (!character) {
              ack?.({
                ok: false,
                error: "Personagem não encontrado nesta mesa",
              });
              return;
            }
            characterName = character.name;
            targetUserId = character.playerId;
          }

          const request = {
            id: randomUUID(),
            at: Date.now(),
            type: payload.type,
            key: payload.key,
            label,
            targetCharacterId,
            characterName,
            targetUserId,
            fromUserId: socket.data.userId,
          };

          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: characterName
              ? `${characterName} precisa realizar um teste de ${label}.`
              : `Todos os personagens precisam realizar um teste de ${label}.`,
          };
          state.chat = [...state.chat, systemMessage].slice(-200);
          schedulePersist(Number(payload.sessionId), state);

          io.to(room).emit("check:request", request);
          io.to(room).emit("chat:message", systemMessage);
          ack?.({ ok: true, request });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao pedir teste" });
        }
      }
    );

    socket.on(
      "chat:monster-action",
      async (
        payload: {
          sessionId: number;
          monsterName: string;
          actionName: string;
          description?: string;
          attackBonus?: number | null;
          damage?: string | null;
          abilityModifier?: number | null;
          abilityLabel?: string | null;
          userName?: string;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre pode rolar pela criatura" });
            return;
          }

          const monsterName = String(payload.monsterName || "Criatura").trim();
          const actionName = String(payload.actionName || "Ação").trim();
          const userName = payload.userName?.trim() || socket.data.email;
          const lines: string[] = [`${monsterName} — ${actionName}`];

          const description = String(payload.description || "").trim();
          if (description) {
            const short =
              description.length > 220
                ? `${description.slice(0, 217)}…`
                : description;
            lines.push(short);
          }

          const parts: Array<{
            label: string;
            formula: string;
            rolls: number[];
            modifier: number;
            total: number;
          }> = [];

          if (
            typeof payload.abilityModifier === "number" &&
            Number.isFinite(payload.abilityModifier)
          ) {
            const label = String(payload.abilityLabel || actionName).trim();
            const result = rollD20WithModifier(payload.abilityModifier);
            parts.push({
              label,
              formula: result.formula,
              rolls: result.rolls,
              modifier: result.modifier,
              total: result.total,
            });
          }

          if (
            typeof payload.attackBonus === "number" &&
            Number.isFinite(payload.attackBonus)
          ) {
            const result = rollD20WithModifier(payload.attackBonus);
            parts.push({
              label: "Ataque",
              formula: result.formula,
              rolls: result.rolls,
              modifier: result.modifier,
              total: result.total,
            });
          }

          const damageRaw = String(payload.damage || "").trim();
          if (damageRaw) {
            const damage = rollCompoundDice(damageRaw);
            if (damage) {
              parts.push({
                label: "Dano",
                formula: damage.parts.map((p) => p.formula).join("+"),
                rolls: damage.parts.flatMap((p) => p.rolls),
                modifier: damage.parts.reduce((s, p) => s + p.modifier, 0),
                total: damage.total,
              });
            } else {
              lines.push(`Dano: ${damageRaw}`);
            }
          }

          const primary = parts[0];
          const hasRoll = Boolean(primary);
          const message: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName,
            type: hasRoll ? "roll" : "text",
            text: lines.join("\n"),
            roll: primary
              ? {
                  ...primary,
                  parts,
                }
              : undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("chat:message", message);
          ack?.({ ok: true, message });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha na ação da criatura" });
        }
      }
    );

    socket.on(
      "chat:character-action",
      async (
        payload: {
          sessionId: number;
          characterId: number;
          characterName?: string;
          actionName: string;
          description?: string;
          attackBonus?: number | null;
          damage?: string | null;
          saveDc?: number | null;
          saveLabel?: string | null;
          userName?: string;
          advantage?: boolean;
        },
        ack?
      ) => {
        try {
          const { session, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const character = session.campaign.characters.find(
            (item) => item.id === Number(payload.characterId)
          );

          if (!character) {
            ack?.({ ok: false, error: "Personagem não encontrado" });
            return;
          }

          if (
            character.playerId !== socket.data.userId &&
            !session.campaign.members.some(
              (member) =>
                member.userId === socket.data.userId &&
                member.role === "MASTER"
            )
          ) {
            ack?.({
              ok: false,
              error: "Sem permissão para agir por este personagem",
            });
            return;
          }

          const characterName =
            String(payload.characterName || character.name || "Personagem").trim();
          const actionName = String(payload.actionName || "Ação").trim();
          const userName = payload.userName?.trim() || character.name;
          const lines: string[] = [`${characterName} — ${actionName}`];

          const description = String(payload.description || "").trim();
          if (description) {
            const short =
              description.length > 280
                ? `${description.slice(0, 277)}…`
                : description;
            lines.push(short);
          }

          if (
            typeof payload.saveDc === "number" &&
            Number.isFinite(payload.saveDc)
          ) {
            const saveLabel = String(payload.saveLabel || "CD").trim();
            lines.push(`${saveLabel}: ${payload.saveDc}`);
          }

          const parts: Array<{
            label: string;
            formula: string;
            rolls: number[];
            modifier: number;
            total: number;
          }> = [];

          const withAdvantage = Boolean(payload.advantage);
          if (
            typeof payload.attackBonus === "number" &&
            Number.isFinite(payload.attackBonus)
          ) {
            const result = rollD20WithModifier(payload.attackBonus, {
              advantage: withAdvantage,
            });
            parts.push({
              label: withAdvantage ? "Ataque (vantagem)" : "Ataque",
              formula: result.formula,
              rolls: result.rolls,
              modifier: result.modifier,
              total: result.total,
            });
          }

          const damageRaw = String(payload.damage || "").trim();
          if (damageRaw) {
            const damage = rollCompoundDice(damageRaw);
            if (damage) {
              parts.push({
                label: "Dano",
                formula: damage.parts.map((p) => p.formula).join("+"),
                rolls: damage.parts.flatMap((p) => p.rolls),
                modifier: damage.parts.reduce((s, p) => s + p.modifier, 0),
                total: damage.total,
              });
            } else {
              lines.push(`Dano: ${damageRaw}`);
            }
          }

          const primary = parts[0];
          const hasRoll = Boolean(primary);
          const message: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName,
            type: hasRoll ? "roll" : "text",
            text: lines.join("\n"),
            roll: primary
              ? {
                  ...primary,
                  parts,
                }
              : undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("chat:message", message);
          ack?.({ ok: true, message });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao enviar ação do personagem" });
        }
      }
    );

    socket.on(
      "ruler:set",
      async (
        payload: {
          sessionId: number;
          from: { x: number; y: number };
          to: { x: number; y: number };
        },
        ack?
      ) => {
        try {
          const { state, room } = await loadContext(Number(payload.sessionId));
          const meters = distanceMeters(
            payload.from,
            payload.to,
            state.board.gridSize || 50,
            metersPerSquareOf(state.board)
          );
          const ruler = {
            id: randomUUID(),
            from: payload.from,
            to: payload.to,
            meters,
            byUserId: socket.data.userId,
          };
          state.board.rulers = [ruler];
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("board:state", state.board);
          ack?.({ ok: true, ruler });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha na régua" });
        }
      }
    );

    socket.on("disconnect", () => {
      // presence cleanup is optional for MVP
    });
  });

  return io;
}

export type { BoardToken };
