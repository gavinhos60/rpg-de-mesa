import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

import {
  getSessionForSocket,
  parseSessionState,
  saveSessionState,
} from "../services/sessions.service";
import { prisma } from "../lib/prisma";
import { setGameIo } from "./io";
import { rollDice, rollD20WithModifier, rollCompoundDice, isCriticalHit, applyCriticalDamage } from "../lib/dice";
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
  CombatantEntry,
  CombatState,
  SessionRuntimeState,
} from "../lib/gameTypes";
import {
  characterIsOnSecretLayer,
  distanceMeters,
  distanceSquares5e,
  emptyCombatState,
  mergeOwnedAnnotations,
  metersPerSquareOf,
  monsterIsOnSecretLayer,
  playerFrozenView,
  publicCombatState,
  sortCombatOrder,
  syncCombatantSecrets,
  tokenIsOnSecretLayer,
  withPlayerViewAnnotations,
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

  setGameIo(io);

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
        if (membership.role === "MASTER") {
          await socket.join(`session:${sessionId}:masters`);
        }

        const role = membership.role;
        const characters = session.campaign.characters;
        const members = session.campaign.members.map((member) => ({
          userId: member.userId,
          role: member.role,
          name: member.user.name,
          email: member.user.email,
        }));

        const stateForClient =
          role === "MASTER"
            ? state
            : {
                ...state,
                chat: state.chat.filter((message) => !message.secret),
                combat: publicCombatState(state.combat),
              };

        ack?.({
          ok: true,
          role,
          campaignId: session.campaignId,
          campaignName: session.campaign.name,
          roomCode: session.roomCode,
          characters,
          members,
          state: stateForClient,
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

    function mastersRoom(sessionId: number) {
      return `session:${sessionId}:masters`;
    }

    function emitChatMessage(
      sessionId: number,
      room: string,
      message: ChatMessage
    ) {
      if (message.secret) {
        io.to(mastersRoom(sessionId)).emit("chat:message", message);
      } else {
        io.to(room).emit("chat:message", message);
      }
    }

    function emitCombatState(
      sessionId: number,
      room: string,
      combat: CombatState | null
    ) {
      io.to(room).emit("combat:state", publicCombatState(combat));
      io.to(mastersRoom(sessionId)).emit("combat:state", combat);
    }

    async function resolveRollCharacter(
      session: Awaited<ReturnType<typeof getSessionForSocket>>,
      characterId: number,
      membership: { role: string }
    ) {
      if (!session) return null;
      const fromCampaign = session.campaign.characters.find(
        (item) => item.id === characterId
      );
      if (fromCampaign) return fromCampaign;

      // Ficha fora da campanha (ex.: personagem pessoal do mestre no mapa).
      const fromDb = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          player: { select: { id: true, name: true, email: true } },
        },
      });
      if (!fromDb) return null;

      const isMaster = membership.role === "MASTER";
      const isOwner = fromDb.playerId === socket.data.userId;
      if (!isMaster && !isOwner) return null;
      return fromDb;
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
          playerViewsByUserId:
            incoming.playerViewsByUserId !== undefined
              ? incoming.playerViewsByUserId
              : state.board.playerViewsByUserId,
        };
          } else {
            const userId = Number(socket.data.userId);
            const incomingTokens = incoming.tokens ?? state.board.tokens;

            // Jogador: anotações + editar/criar o próprio token.
            // Remoção de token é só via token:remove (evita race com board:update atrasado).
            const mergedTokens: typeof state.board.tokens = [];
            for (const token of state.board.tokens) {
              const owned =
                token.ownerUserId != null &&
                Number(token.ownerUserId) === userId;
              if (!owned) {
                mergedTokens.push(token);
                continue;
              }
              const next = incomingTokens.find((item) => item.id === token.id);
              if (!next) {
                // Mantém: ausência no incoming pode ser snapshot atrasado.
                mergedTokens.push(token);
                continue;
              }
              mergedTokens.push({
                ...token,
                hpMax: next.hpMax,
                hpCurrent: next.hpCurrent,
                customValue: next.customValue,
                conditions: next.conditions ?? token.conditions,
                // Posição só via token:move — board:update atrasado não “teleporta” de volta.
                x: token.x,
                y: token.y,
                imageUrl: next.imageUrl ?? token.imageUrl,
                borderColor: next.borderColor ?? token.borderColor,
                onPlayerScene:
                  next.onPlayerScene !== undefined
                    ? next.onPlayerScene
                    : token.onPlayerScene,
              });
            }

            for (const token of incomingTokens) {
              const exists = mergedTokens.some((item) => item.id === token.id);
              if (exists) continue;
              if (
                token.kind === "pc" &&
                Number(token.ownerUserId) === userId &&
                token.characterId
              ) {
                mergedTokens.push(token);
              }
            }

            state.board = {
              ...state.board,
              tokens: mergedTokens,
              drawings: mergeOwnedAnnotations(
                state.board.drawings,
                incoming.drawings,
                userId
              ),
              rulers: mergeOwnedAnnotations(
                state.board.rulers,
                incoming.rulers,
                userId
              ),
              effects: mergeOwnedAnnotations(
                state.board.effects,
                incoming.effects,
                userId
              ),
            };

            // Se o jogador estiver em mapa congelado, aplica anotações na view dele.
            const frozen = playerFrozenView(state.board, userId);
            const incomingViews = incoming.playerViewsByUserId;
            const incomingOwnView =
              incomingViews?.[String(userId)] ?? undefined;
            if (frozen && incomingOwnView) {
              state.board = withPlayerViewAnnotations(state.board, userId, {
                drawings: mergeOwnedAnnotations(
                  frozen.drawings ?? [],
                  incomingOwnView.drawings,
                  userId
                ),
                effects: mergeOwnedAnnotations(
                  frozen.effects ?? [],
                  incomingOwnView.effects,
                  userId
                ),
                rulers: mergeOwnedAnnotations(
                  frozen.rulers ?? [],
                  incomingOwnView.rulers,
                  userId
                ),
              });
            }
          }

          const synced = syncCombatantSecrets(state.board, state.combat);
          if (synced.changed) {
            state.combat = synced.combat;
          }

          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("board:state", state.board);
          if (synced.changed) {
            emitCombatState(Number(payload.sessionId), room, state.combat ?? null);
          }
          ack?.({ ok: true });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao atualizar o mapa" });
        }
      }
    );

    socket.on(
      "token:remove",
      async (
        payload: { sessionId: number; tokenIds: string[] },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const userId = Number(socket.data.userId);
          const isMaster = membership.role === "MASTER";
          const ids = new Set(
            (payload.tokenIds ?? []).map((id) => String(id)).filter(Boolean)
          );
          if (ids.size === 0) {
            ack?.({ ok: false, error: "Nenhum token" });
            return;
          }

          const nextTokens = state.board.tokens.filter((token) => {
            if (!ids.has(token.id)) return true;
            if (isMaster) return false;
            return Number(token.ownerUserId) !== userId;
          });

          if (nextTokens.length === state.board.tokens.length) {
            ack?.({ ok: false, error: "Você não pode remover este token" });
            return;
          }

          state.board = { ...state.board, tokens: nextTokens };
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("board:state", state.board);
          ack?.({ ok: true });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao remover token" });
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
          commit?: boolean;
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
            Number(token.ownerUserId) === Number(socket.data.userId);

          if (!canMove) {
            ack?.({ ok: false, error: "Você não pode mover este token" });
            return;
          }

          token.x = payload.x;
          token.y = payload.y;

          const commit = payload.commit !== false;
          // Só persiste no drop final — evita gravar cada frame do arraste.
          if (commit) {
            schedulePersist(Number(payload.sessionId), state);
          }
          // Não ecoa para o remetente (evita rollback no cliente que arrasta).
          socket.to(room).emit("token:moved", {
            tokenId: token.id,
            x: token.x,
            y: token.y,
            commit,
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
          const { session, membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const character = await resolveRollCharacter(
            session,
            Number(payload.characterId),
            membership
          );

          if (!character) {
            ack?.({ ok: false, error: "Personagem não encontrado" });
            return;
          }

          if (
            character.playerId !== socket.data.userId &&
            membership.role !== "MASTER"
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
          const secret = characterIsOnSecretLayer(
            state.board,
            character.id
          );
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
            secret: secret || undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitChatMessage(Number(payload.sessionId), room, message);
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
          tokenId?: string | null;
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
          const secret = monsterIsOnSecretLayer(state.board, {
            tokenId: payload.tokenId,
            monsterName,
          });
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
            const critical = isCriticalHit(result);
            parts.push({
              label: critical ? "Ataque (crítico!)" : "Ataque",
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
              const attackPart = parts.find((part) =>
                /^Ataque/i.test(part.label)
              );
              const critical = attackPart
                ? isCriticalHit(attackPart)
                : false;
              const resolved = critical
                ? applyCriticalDamage(damage)
                : {
                    formula: damage.parts.map((p) => p.formula).join("+"),
                    rolls: damage.parts.flatMap((p) => p.rolls),
                    modifier: damage.parts.reduce((s, p) => s + p.modifier, 0),
                    total: damage.total,
                  };
              parts.push({
                label: critical ? "Dano (crítico ×2)" : "Dano",
                formula: resolved.formula,
                rolls: resolved.rolls,
                modifier: resolved.modifier,
                total: resolved.total,
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
            secret: secret || undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitChatMessage(Number(payload.sessionId), room, message);
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
          const { session, membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const character = await resolveRollCharacter(
            session,
            Number(payload.characterId),
            membership
          );

          if (!character) {
            ack?.({ ok: false, error: "Personagem não encontrado" });
            return;
          }

          if (
            character.playerId !== socket.data.userId &&
            membership.role !== "MASTER"
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
          let attackCritical = false;
          if (
            typeof payload.attackBonus === "number" &&
            Number.isFinite(payload.attackBonus)
          ) {
            const result = rollD20WithModifier(payload.attackBonus, {
              advantage: withAdvantage,
            });
            attackCritical = isCriticalHit(result);
            const baseLabel = withAdvantage ? "Ataque (vantagem)" : "Ataque";
            parts.push({
              label: attackCritical ? `${baseLabel} · crítico!` : baseLabel,
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
              const resolved = attackCritical
                ? applyCriticalDamage(damage)
                : {
                    formula: damage.parts.map((p) => p.formula).join("+"),
                    rolls: damage.parts.flatMap((p) => p.rolls),
                    modifier: damage.parts.reduce((s, p) => s + p.modifier, 0),
                    total: damage.total,
                  };
              parts.push({
                label: attackCritical ? "Dano (crítico ×2)" : "Dano",
                formula: resolved.formula,
                rolls: resolved.rolls,
                modifier: resolved.modifier,
                total: resolved.total,
              });
            } else {
              lines.push(`Dano: ${damageRaw}`);
            }
          }

          const primary = parts[0];
          const hasRoll = Boolean(primary);
          const secret = characterIsOnSecretLayer(
            state.board,
            character.id
          );
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
            secret: secret || undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitChatMessage(Number(payload.sessionId), room, message);
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
          from?: { x: number; y: number };
          to?: { x: number; y: number };
          clear?: boolean;
          clearAll?: boolean;
          sticky?: boolean;
          live?: boolean;
          byUserName?: string;
          shape?: "line" | "square" | "circle" | "cone" | "beam";
          color?: string;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const userId = socket.data.userId as number;
          const rulers = Array.isArray(state.board.rulers)
            ? [...state.board.rulers]
            : [];

          if (payload.clearAll) {
            // Mestre limpa todas; jogador só as próprias.
            if (membership.role === "MASTER") {
              state.board.rulers = [];
            } else {
              state.board.rulers = rulers.filter(
                (item) => Number(item.byUserId) !== userId
              );
              const frozen = playerFrozenView(state.board, userId);
              if (frozen) {
                state.board = withPlayerViewAnnotations(state.board, userId, {
                  rulers: (frozen.rulers ?? []).filter(
                    (item) => Number(item.byUserId) !== userId
                  ),
                });
              }
            }
            schedulePersist(Number(payload.sessionId), state);
            io.to(room).emit("board:state", state.board);
            ack?.({ ok: true });
            return;
          }

          if (payload.clear) {
            // Remove só a prévia ao vivo deste usuário (não apaga marcações fixas).
            state.board.rulers = rulers.filter(
              (item) => !(item.live && item.byUserId === userId)
            );
            const frozen = playerFrozenView(state.board, userId);
            if (frozen) {
              state.board = withPlayerViewAnnotations(state.board, userId, {
                rulers: (frozen.rulers ?? []).filter(
                  (item) => !(item.live && Number(item.byUserId) === userId)
                ),
              });
            }
            io.to(room).emit("board:state", state.board);
            ack?.({ ok: true });
            return;
          }

          if (!payload.from || !payload.to) {
            ack?.({ ok: false, error: "Pontos da régua inválidos" });
            return;
          }

          const gridSize = state.board.gridSize || 50;
          const mPerSquare = metersPerSquareOf(state.board);
          const squares = distanceSquares5e(payload.from, payload.to, gridSize);
          const meters = distanceMeters(
            payload.from,
            payload.to,
            gridSize,
            mPerSquare
          );
          const shape = payload.shape ?? "line";
          const color =
            typeof payload.color === "string" && payload.color.trim()
              ? payload.color.trim()
              : undefined;
          const sticky = Boolean(payload.sticky);
          const live = Boolean(payload.live) && !sticky;

          const nextRuler = {
            id: randomUUID(),
            shape,
            from: payload.from,
            to: payload.to,
            meters,
            squares,
            byUserId: userId,
            byUserName: String(payload.byUserName ?? "").trim() || undefined,
            color,
            live: live || undefined,
          };

          const frozen = playerFrozenView(state.board, userId);
          if (frozen) {
            const viewRulers = Array.isArray(frozen.rulers)
              ? [...frozen.rulers]
              : [];
            const withoutOwnLive = viewRulers.filter(
              (item) => !(item.live && Number(item.byUserId) === userId)
            );
            const nextViewRulers = live
              ? [...withoutOwnLive, nextRuler]
              : [...withoutOwnLive, { ...nextRuler, live: undefined }];
            state.board = withPlayerViewAnnotations(state.board, userId, {
              rulers: nextViewRulers,
            });
            // Também propaga para outros jogadores no mesmo mapa congelado.
            if (!live && sticky) {
              const views = { ...(state.board.playerViewsByUserId ?? {}) };
              for (const [otherId, view] of Object.entries(views)) {
                if (Number(otherId) === userId) continue;
                if ((view.mapUrl || "") !== (frozen.mapUrl || "")) continue;
                const otherRulers = Array.isArray(view.rulers)
                  ? [...view.rulers]
                  : [];
                views[otherId] = {
                  ...view,
                  rulers: [
                    ...otherRulers,
                    { ...nextRuler, live: undefined },
                  ],
                };
              }
              state.board.playerViewsByUserId = views;
            }
            if (!live) {
              schedulePersist(Number(payload.sessionId), state);
            }
            io.to(room).emit("board:state", state.board);
            ack?.({ ok: true, ruler: nextRuler });
            return;
          }

          // Tira prévia ao vivo anterior deste usuário.
          const withoutOwnLive = rulers.filter(
            (item) => !(item.live && item.byUserId === userId)
          );

          if (live) {
            state.board.rulers = [...withoutOwnLive, nextRuler];
            io.to(room).emit("board:state", state.board);
            ack?.({ ok: true, ruler: nextRuler });
            return;
          }

          // Commit (Permanecer): acumula marcações fixas no mapa ativo.
          state.board.rulers = [
            ...withoutOwnLive,
            { ...nextRuler, live: undefined },
          ];
          schedulePersist(Number(payload.sessionId), state);
          io.to(room).emit("board:state", state.board);
          ack?.({ ok: true, ruler: nextRuler });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha na régua" });
        }
      }
    );

    socket.on(
      "initiative:request",
      async (
        payload: {
          sessionId: number;
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
            ack?.({ ok: false, error: "Apenas o mestre pode pedir iniciativa" });
            return;
          }

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

          const combat: CombatState = {
            ...(state.combat ?? emptyCombatState()),
            active: false,
            collecting: true,
            round: 1,
            currentIndex: 0,
            order: targetCharacterId
              ? (state.combat?.order ?? []).filter(
                  (entry) => entry.characterId !== targetCharacterId
                )
              : [],
          };
          state.combat = combat;

          const request = {
            id: randomUUID(),
            at: Date.now(),
            fromUserId: socket.data.userId,
            targetCharacterId,
            characterName,
            targetUserId,
          };

          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: characterName
              ? `${characterName} precisa rolar iniciativa.`
              : "Todos os personagens precisam rolar iniciativa.",
          };
          state.chat = [...state.chat, systemMessage].slice(-200);
          schedulePersist(Number(payload.sessionId), state);

          io.to(room).emit("initiative:request", request);
          emitCombatState(Number(payload.sessionId), room, combat);
          io.to(room).emit("chat:message", systemMessage);
          ack?.({ ok: true, request, combat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao pedir iniciativa" });
        }
      }
    );

    socket.on(
      "initiative:roll",
      async (
        payload: {
          sessionId: number;
          characterId: number;
          userName?: string;
          advantage?: boolean;
        },
        ack?
      ) => {
        try {
          const { session, membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          const character = await resolveRollCharacter(
            session,
            Number(payload.characterId),
            membership
          );

          if (!character) {
            ack?.({ ok: false, error: "Personagem não encontrado" });
            return;
          }

          if (
            character.playerId !== socket.data.userId &&
            membership.role !== "MASTER"
          ) {
            ack?.({
              ok: false,
              error: "Sem permissão para rolar por este personagem",
            });
            return;
          }

          const resolved = resolveAbilityModifier(character.sheet, "dexterity");
          if (!resolved) {
            ack?.({ ok: false, error: "Ficha sem Destreza" });
            return;
          }

          const withAdvantage = Boolean(payload.advantage);
          const result = rollD20WithModifier(resolved.modifier, {
            advantage: withAdvantage,
          });

          const combat: CombatState = {
            ...(state.combat ?? emptyCombatState()),
            collecting: state.combat?.active ? false : true,
            active: Boolean(state.combat?.active),
          };

          const entry: CombatantEntry = {
            id: `char-${character.id}`,
            name: character.name,
            initiative: result.total,
            natural: result.natural,
            kind: "character",
            characterId: character.id,
            userId: character.playerId,
            secret: characterIsOnSecretLayer(state.board, character.id),
          };

          const without = combat.order.filter(
            (item) => item.characterId !== character.id && item.id !== entry.id
          );
          combat.order = sortCombatOrder([...without, entry]);
          if (combat.active && combat.currentIndex >= combat.order.length) {
            combat.currentIndex = Math.max(0, combat.order.length - 1);
          }
          state.combat = combat;

          const userName = payload.userName?.trim() || character.name;
          const message: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName,
            type: "roll",
            text: `${character.name} — Iniciativa${
              withAdvantage ? " (vantagem)" : ""
            }`,
            roll: {
              label: withAdvantage ? "Iniciativa (vantagem)" : "Iniciativa",
              formula: result.formula,
              rolls: result.rolls,
              modifier: result.modifier,
              total: result.total,
            },
            secret: entry.secret || undefined,
          };

          state.chat = [...state.chat, message].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitChatMessage(Number(payload.sessionId), room, message);
          emitCombatState(Number(payload.sessionId), room, combat);
          ack?.({ ok: true, message, combat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha na iniciativa" });
        }
      }
    );

    socket.on(
      "combat:add",
      async (
        payload: {
          sessionId: number;
          name: string;
          initiative: number;
          kind?: "monster" | "other";
          tokenId?: string | null;
          userName?: string;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre pode adicionar ao relógio" });
            return;
          }

          const name = payload.name?.trim();
          if (!name) {
            ack?.({ ok: false, error: "Informe o nome" });
            return;
          }

          const combat: CombatState = {
            ...(state.combat ?? emptyCombatState()),
            collecting: state.combat?.active
              ? false
              : Boolean(state.combat?.collecting ?? true),
          };

          const secret = payload.tokenId
            ? tokenIsOnSecretLayer(state.board, payload.tokenId)
            : false;
          const entry: CombatantEntry = {
            id: randomUUID(),
            name,
            initiative: Number(payload.initiative) || 0,
            kind: payload.kind === "other" ? "other" : "monster",
            tokenId: payload.tokenId ?? null,
            secret,
          };

          combat.order = sortCombatOrder([...combat.order, entry]);
          state.combat = combat;

          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: `${name} entrou no relógio (iniciativa ${entry.initiative}).`,
            secret: secret || undefined,
          };
          state.chat = [...state.chat, systemMessage].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitCombatState(Number(payload.sessionId), room, combat);
          emitChatMessage(Number(payload.sessionId), room, systemMessage);
          ack?.({ ok: true, combat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao adicionar combatente" });
        }
      }
    );

    socket.on(
      "combat:roll-npcs",
      async (
        payload: {
          sessionId: number;
          entries: Array<{
            tokenId: string;
            name: string;
            /** Valor de Destreza (atributo), não o modificador. */
            dexterity?: number;
          }>;
          userName?: string;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({
              ok: false,
              error: "Apenas o mestre rola iniciativa de NPCs",
            });
            return;
          }

          const entries = Array.isArray(payload.entries)
            ? payload.entries.filter(
                (entry) =>
                  entry &&
                  typeof entry.tokenId === "string" &&
                  typeof entry.name === "string" &&
                  entry.name.trim()
              )
            : [];
          if (entries.length === 0) {
            ack?.({ ok: false, error: "Nenhum NPC selecionado" });
            return;
          }

          const combat: CombatState = {
            ...(state.combat ?? emptyCombatState()),
            collecting: state.combat?.active
              ? false
              : Boolean(state.combat?.collecting ?? true),
            active: Boolean(state.combat?.active),
          };

          const messages: ChatMessage[] = [];
          let order = [...combat.order];

          for (const entry of entries) {
            const dexScore =
              typeof entry.dexterity === "number" &&
              Number.isFinite(entry.dexterity)
                ? entry.dexterity
                : 10;
            const modifier = Math.floor((dexScore - 10) / 2);
            const result = rollD20WithModifier(modifier);
            const secret = tokenIsOnSecretLayer(state.board, entry.tokenId);
            const combatant: CombatantEntry = {
              id: `token-${entry.tokenId}`,
              name: entry.name.trim(),
              initiative: result.total,
              natural: result.natural,
              kind: "monster",
              tokenId: entry.tokenId,
              secret,
            };
            order = order.filter(
              (item) =>
                item.tokenId !== entry.tokenId && item.id !== combatant.id
            );
            order.push(combatant);
            messages.push({
              id: randomUUID(),
              at: Date.now(),
              userId: socket.data.userId,
              userName: payload.userName?.trim() || "Mestre",
              type: "roll",
              text: `${combatant.name} — Iniciativa`,
              roll: {
                label: "Iniciativa",
                formula: result.formula,
                rolls: result.rolls,
                modifier: result.modifier,
                total: result.total,
              },
              secret: secret || undefined,
            });
          }

          combat.order = sortCombatOrder(order);
          if (combat.active && combat.currentIndex >= combat.order.length) {
            combat.currentIndex = Math.max(0, combat.order.length - 1);
          }
          state.combat = combat;
          state.chat = [...state.chat, ...messages].slice(-200);
          schedulePersist(Number(payload.sessionId), state);

          for (const message of messages) {
            emitChatMessage(Number(payload.sessionId), room, message);
          }
          emitCombatState(Number(payload.sessionId), room, combat);
          ack?.({ ok: true, combat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao rolar iniciativa dos NPCs" });
        }
      }
    );

    socket.on(
      "combat:start",
      async (
        payload: { sessionId: number; userName?: string },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre controla o relógio" });
            return;
          }

          const previous = state.combat ?? emptyCombatState();
          if (previous.order.length === 0) {
            ack?.({
              ok: false,
              error: "Peça iniciativas ou adicione combatentes antes",
            });
            return;
          }

          const combat: CombatState = {
            active: true,
            collecting: false,
            round: 1,
            currentIndex: 0,
            order: previous.order,
          };
          state.combat = combat;

          const current = combat.order[0];
          const publicText = current?.secret
            ? "Relógio de turnos iniciado. Rodada 1 — vez de uma criatura oculta."
            : `Relógio de turnos iniciado. Rodada 1 — vez de ${current?.name ?? "?"}.`;
          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: publicText,
          };
          const messages: ChatMessage[] = [systemMessage];
          if (current?.secret) {
            messages.push({
              ...systemMessage,
              id: randomUUID(),
              text: `Relógio de turnos iniciado. Rodada 1 — vez de ${current.name}.`,
              secret: true,
            });
          }
          state.chat = [...state.chat, ...messages].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitCombatState(Number(payload.sessionId), room, combat);
          for (const message of messages) {
            emitChatMessage(Number(payload.sessionId), room, message);
          }
          ack?.({ ok: true, combat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao iniciar o relógio" });
        }
      }
    );

    socket.on(
      "combat:next",
      async (
        payload: { sessionId: number; userName?: string },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre pula a vez" });
            return;
          }

          const combat = state.combat;
          if (!combat?.active || combat.order.length === 0) {
            ack?.({ ok: false, error: "Relógio não está ativo" });
            return;
          }

          let nextIndex = combat.currentIndex + 1;
          let round = combat.round;
          if (nextIndex >= combat.order.length) {
            nextIndex = 0;
            round += 1;
          }

          const nextCombat: CombatState = {
            ...combat,
            currentIndex: nextIndex,
            round,
            collecting: false,
          };
          state.combat = nextCombat;

          const current = nextCombat.order[nextIndex];
          const publicText = current?.secret
            ? `Rodada ${round} — vez de uma criatura oculta.`
            : `Rodada ${round} — vez de ${current?.name ?? "?"}.`;
          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: publicText,
          };
          const messages: ChatMessage[] = [systemMessage];
          if (current?.secret) {
            messages.push({
              ...systemMessage,
              id: randomUUID(),
              text: `Rodada ${round} — vez de ${current.name}.`,
              secret: true,
            });
          }
          state.chat = [...state.chat, ...messages].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitCombatState(Number(payload.sessionId), room, nextCombat);
          for (const message of messages) {
            emitChatMessage(Number(payload.sessionId), room, message);
          }
          ack?.({ ok: true, combat: nextCombat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao avançar turno" });
        }
      }
    );

    socket.on(
      "combat:reorder",
      async (
        payload: {
          sessionId: number;
          orderIds: string[];
          userName?: string;
        },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({
              ok: false,
              error: "Apenas o mestre reordena o relógio",
            });
            return;
          }

          const combat = state.combat;
          if (!combat || combat.order.length === 0) {
            ack?.({ ok: false, error: "Relógio vazio" });
            return;
          }

          const ids = Array.isArray(payload.orderIds)
            ? payload.orderIds.filter((id) => typeof id === "string")
            : [];
          if (ids.length === 0) {
            ack?.({ ok: false, error: "Ordem inválida" });
            return;
          }

          const byId = new Map(combat.order.map((entry) => [entry.id, entry]));
          const nextOrder = [];
          const seen = new Set<string>();
          for (const id of ids) {
            const entry = byId.get(id);
            if (!entry || seen.has(id)) continue;
            nextOrder.push(entry);
            seen.add(id);
          }
          for (const entry of combat.order) {
            if (!seen.has(entry.id)) nextOrder.push(entry);
          }

          const currentId = combat.order[combat.currentIndex]?.id;
          const currentIndex = currentId
            ? Math.max(
                0,
                nextOrder.findIndex((entry) => entry.id === currentId)
              )
            : 0;

          const nextCombat: CombatState = {
            ...combat,
            order: nextOrder,
            currentIndex,
          };
          state.combat = nextCombat;
          schedulePersist(Number(payload.sessionId), state);
          emitCombatState(Number(payload.sessionId), room, nextCombat);
          ack?.({ ok: true, combat: nextCombat });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao reordenar o relógio" });
        }
      }
    );

    socket.on(
      "combat:end",
      async (
        payload: { sessionId: number; userName?: string },
        ack?
      ) => {
        try {
          const { membership, state, room } = await loadContext(
            Number(payload.sessionId)
          );
          if (membership.role !== "MASTER") {
            ack?.({ ok: false, error: "Apenas o mestre encerra o relógio" });
            return;
          }

          state.combat = null;

          const systemMessage: ChatMessage = {
            id: randomUUID(),
            at: Date.now(),
            userId: socket.data.userId,
            userName: payload.userName?.trim() || "Mestre",
            type: "system",
            text: "Relógio de turnos encerrado.",
          };
          state.chat = [...state.chat, systemMessage].slice(-200);
          schedulePersist(Number(payload.sessionId), state);
          emitCombatState(Number(payload.sessionId), room, null);
          emitChatMessage(Number(payload.sessionId), room, systemMessage);
          ack?.({ ok: true });
        } catch (error) {
          console.error(error);
          ack?.({ ok: false, error: "Falha ao encerrar o relógio" });
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
