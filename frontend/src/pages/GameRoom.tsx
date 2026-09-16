import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";

import { useAuth } from "../contexts/AuthContext";
import {
  closeGameSession,
  getActiveGameSession,
} from "../services/game.service";
import { getMyCharacters, getCharacterById } from "../services/character.service";
import {
  updateCharacterWallet,
  discardCharacterItem,
  transferCharacterItem,
  type InventoryItemAction,
} from "../services/character.service";
import {
  createGameSocket,
  emitBoardUpdate,
  emitChatMessage,
  emitCharacterAction,
  emitCheckRequest,
  emitCombatAdd,
  emitCombatEnd,
  emitCombatNext,
  emitCombatReorder,
  emitCombatRollNpcs,
  emitCombatStart,
  emitInitiativeRequest,
  emitInitiativeRoll,
  emitRuler,
  emitSheetRoll,
  emitMonsterAction,
  emitTokenMove,
  emitTokenRemove,
  joinSession,
  emitRulerClear,
} from "../services/gameSocket";
import type {
  BoardState,
  BoardToken,
  CampaignCharacterLite,
  ChatMessage,
  CheckRequest,
  CombatantEntry,
  CombatState,
  InitiativeRequest,
  SessionRuntimeState,
} from "../types/game";
import { emptyBoardState, playerIsOnFrozenScene, snapToGrid } from "../types/game";
import type {
  Ability,
  CharacterFormData,
  CharacterWallet,
  Skill,
  Spell,
} from "../types/character";
import {
  buildFeatureAction,
  buildSpellAction,
} from "../utils/spellRoll";
import { hitPointsFromSheet } from "../utils/characterCombat";
import { getMonsterById, type Monster } from "../data/dnd/monsters";
import { GameBoard, type BoardTool } from "../components/game/GameBoard";
import { GameChat, naturalD20 } from "../components/game/GameChat";
import { MasterPanel } from "../components/game/MasterPanel";
import { PlayerPanel } from "../components/game/PlayerPanel";
import { PlayableSheetDrawer } from "../components/game/PlayableSheetDrawer";
import { MonsterSheetDrawer } from "../components/game/MonsterSheetDrawer";
import { CheckPrompt } from "../components/game/CheckPrompt";
import { InitiativePrompt } from "../components/game/InitiativePrompt";
import { TurnClock } from "../components/game/TurnClock";
import { DiceRollOverlay, diceFromChatRoll } from "../components/game/DiceRollOverlay";

export function GameRoom() {
  const { id } = useParams();
  const campaignId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [role, setRole] = useState<"MASTER" | "PLAYER">("PLAYER");
  const [campaignName, setCampaignName] = useState("");
  const [characters, setCharacters] = useState<CampaignCharacterLite[]>([]);
  const [members, setMembers] = useState<
    Array<{
      userId: number;
      role: "MASTER" | "PLAYER";
      name: string;
      email: string;
    }>
  >([]);
  const [masterCharacters, setMasterCharacters] = useState<
    CampaignCharacterLite[]
  >([]);
  const [board, setBoard] = useState<BoardState>(emptyBoardState());
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [tool, setTool] = useState<BoardTool>("select");
  const [placeOnSecretLayer, setPlaceOnSecretLayer] = useState(false);
  const [watchPlayerScene, setWatchPlayerScene] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [diceFx, setDiceFx] = useState<{
    label: string;
    total: number;
    natural?: number | null;
    dice?: Array<{ sides: number; value: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCharacter, setOpenCharacter] =
    useState<CampaignCharacterLite | null>(null);
  const [sheetReadOnly, setSheetReadOnly] = useState(false);
  const [inventoryBusy, setInventoryBusy] = useState(false);
  const [pendingCheck, setPendingCheck] = useState<CheckRequest | null>(null);
  const [pendingInitiative, setPendingInitiative] =
    useState<InitiativeRequest | null>(null);
  const [combat, setCombat] = useState<CombatState | null>(null);
  const [initiativeHoverTokenIds, setInitiativeHoverTokenIds] = useState<
    string[]
  >([]);
  const [openMonster, setOpenMonster] = useState<Monster | null>(null);
  const [monsterDisplayName, setMonsterDisplayName] = useState<string>("");
  const [monsterTokenId, setMonsterTokenId] = useState<string | null>(null);
  const [monsterTokenHp, setMonsterTokenHp] = useState<{
    current?: number;
    max?: number;
  }>({});

  const isMaster = role === "MASTER";
  const myCharacters = useMemo(
    () => characters.filter((character) => character.playerId === user?.id),
    [characters, user?.id]
  );
  const myCharactersRef = useRef(myCharacters);
  myCharactersRef.current = myCharacters;
  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;
  const roleRef = useRef(role);
  roleRef.current = role;
  /** Tokens em arraste local — ignora ecos remotos para não teleportar. */
  const draggingTokenIdsRef = useRef<Set<string>>(new Set());
  /** Após o drop: ignora posições intermediárias atrasadas. */
  const settlingTokensRef = useRef<
    Map<string, { x: number; y: number; until: number }>
  >(new Map());
  /** Debounce de board:update — evita eco atrasado apagar PV digitado. */
  const boardEmitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBoardRef = useRef<BoardState | null>(null);

  const applyState = useCallback((state: SessionRuntimeState) => {
    setBoard(state.board ?? emptyBoardState());
    setChat(
      (state.chat ?? []).filter(
        (message) => !message.secret || roleRef.current === "MASTER"
      )
    );
    setCombat(state.combat ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    let currentSocket: Socket | null = null;

    async function boot() {
      if (!campaignId || Number.isNaN(campaignId)) {
        setError("Campanha inválida.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const session = await getActiveGameSession(campaignId);
        if (!session) {
          setError("Não há sessão ativa. Peça ao mestre para iniciar o jogo.");
          setLoading(false);
          return;
        }

        if (!active) return;
        setSessionId(session.id);

        currentSocket = createGameSocket();
        setSocket(currentSocket);

        currentSocket.on("board:state", (nextBoard: BoardState) => {
          setBoard((previous) => {
            const wasFrozen =
              Boolean(previous.playerMapView) ||
              Object.keys(previous.playerViewsByUserId ?? {}).length > 0;
            const nowFrozen =
              Boolean(nextBoard.playerMapView) ||
              Object.keys(nextBoard.playerViewsByUserId ?? {}).length > 0;
            if (!nowFrozen) {
              queueMicrotask(() => setWatchPlayerScene(false));
            } else if (!wasFrozen && nowFrozen) {
              queueMicrotask(() => setWatchPlayerScene(true));
            }
            const dragging = draggingTokenIdsRef.current;
            const settling = settlingTokensRef.current;
            const now = performance.now();
            if (dragging.size === 0 && settling.size === 0) return nextBoard;
            return {
              ...nextBoard,
              tokens: nextBoard.tokens.map((token) => {
                if (dragging.has(token.id)) {
                  const local = previous.tokens.find((item) => item.id === token.id);
                  return local ? { ...token, x: local.x, y: local.y } : token;
                }
                const settled = settling.get(token.id);
                if (settled && settled.until > now) {
                  return { ...token, x: settled.x, y: settled.y };
                }
                return token;
              }),
            };
          });
        });

        currentSocket.on(
          "token:moved",
          (payload: {
            tokenId: string;
            x: number;
            y: number;
            commit?: boolean;
          }) => {
            if (draggingTokenIdsRef.current.has(payload.tokenId)) return;
            const settling = settlingTokensRef.current.get(payload.tokenId);
            if (settling && settling.until > performance.now()) {
              // Só aceita o commit final (ou posição igual); ignora live atrasado.
              if (payload.commit === false) return;
              if (
                payload.commit !== true &&
                (payload.x !== settling.x || payload.y !== settling.y)
              ) {
                return;
              }
            }
            setBoard((previous) => ({
              ...previous,
              tokens: previous.tokens.map((token) =>
                token.id === payload.tokenId
                  ? { ...token, x: payload.x, y: payload.y }
                  : token
              ),
            }));
          }
        );

        currentSocket.on("chat:message", (message: ChatMessage) => {
          // Defesa: mensagens secretas não devem chegar a jogadores
          if (message.secret && roleRef.current !== "MASTER") return;
          setChat((previous) => [...previous, message].slice(-200));
          if (message.type === "roll" && message.roll) {
            setDiceFx({
              label: message.roll.label || message.text,
              total: message.roll.total,
              natural: naturalD20(message.roll),
              dice: diceFromChatRoll(message.roll),
            });
          }
        });

        currentSocket.on("check:request", (request: CheckRequest) => {
          const mine = myCharactersRef.current;
          const uid = userIdRef.current;
          const targetsMe =
            !request.targetCharacterId ||
            mine.some(
              (character) => character.id === request.targetCharacterId
            ) ||
            request.targetUserId === uid;
          if (targetsMe) {
            setPendingCheck(request);
          }
        });

        currentSocket.on(
          "initiative:request",
          (request: InitiativeRequest) => {
            const mine = myCharactersRef.current;
            const uid = userIdRef.current;
            const targetsMe =
              !request.targetCharacterId ||
              mine.some(
                (character) => character.id === request.targetCharacterId
              ) ||
              request.targetUserId === uid;
            if (targetsMe) {
              setPendingInitiative(request);
            }
          }
        );

        currentSocket.on("combat:state", (next: CombatState | null) => {
          setCombat(next);
        });

        await new Promise<void>((resolve, reject) => {
          currentSocket!.once("connect", () => resolve());
          currentSocket!.once("connect_error", (err) => reject(err));
          currentSocket!.connect();
        });

        const joined = await joinSession(currentSocket, session.id);
        if (!joined.ok || !joined.state) {
          throw new Error(joined.error || "Falha ao entrar na sala");
        }

        if (!active) return;
        setRole(joined.role ?? "PLAYER");
        roleRef.current = joined.role ?? "PLAYER";
        setCampaignName(joined.campaignName ?? "");
        setCharacters(joined.characters ?? []);
        setMembers(joined.members ?? []);
        applyState(joined.state);

        if ((joined.role ?? "PLAYER") === "MASTER") {
          try {
            const mine = await getMyCharacters();
            if (!active) return;
            setMasterCharacters(
              mine.map((character) => ({
                id: character.id,
                name: character.name,
                className: character.className,
                race: character.race,
                level: character.level,
                avatar: character.avatar,
                sheet: character.sheet,
                playerId: character.playerId,
                player: character.player,
              }))
            );
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError(
            "Não foi possível entrar na sala. Verifique se a API/Socket estão no ar."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    boot();

    return () => {
      active = false;
      currentSocket?.disconnect();
    };
  }, [applyState, campaignId, user?.id]);

  async function handleBoardChange(next: BoardState) {
    setBoard((previous) => {
      const nextFrozen =
        Boolean(next.playerMapView) ||
        Object.keys(next.playerViewsByUserId ?? {}).length > 0;
      const prevFrozen =
        Boolean(previous.playerMapView) ||
        Object.keys(previous.playerViewsByUserId ?? {}).length > 0;
      if (!nextFrozen) {
        queueMicrotask(() => setWatchPlayerScene(false));
      } else if (!prevFrozen && nextFrozen) {
        queueMicrotask(() => setWatchPlayerScene(true));
      }
      return next;
    });
    if (!socket || !sessionId) return;
    pendingBoardRef.current = next;
    if (boardEmitTimerRef.current) clearTimeout(boardEmitTimerRef.current);
    const sid = sessionId;
    const sock = socket;
    boardEmitTimerRef.current = setTimeout(() => {
      boardEmitTimerRef.current = null;
      const payload = pendingBoardRef.current;
      pendingBoardRef.current = null;
      if (!payload || !sock) return;
      void emitBoardUpdate(sock, sid, payload);
    }, 50);
  }

  async function handleRemoveTokens(tokenIds: string[]) {
    if (tokenIds.length === 0) return;
    setBoard((previous) => ({
      ...previous,
      tokens: previous.tokens.filter((token) => !tokenIds.includes(token.id)),
    }));
    if (!socket || !sessionId) return;
    await emitTokenRemove(socket, sessionId, tokenIds);
  }

  async function handleTokenMove(
    tokenId: string,
    x: number,
    y: number,
    options?: { commit?: boolean }
  ) {
    const commit = options?.commit !== false;
    const grid = board.gridSize || 50;
    const nextX = commit ? snapToGrid(x, grid) : x;
    const nextY = commit ? snapToGrid(y, grid) : y;
    setBoard((previous) => ({
      ...previous,
      tokens: previous.tokens.map((token) =>
        token.id === tokenId ? { ...token, x: nextX, y: nextY } : token
      ),
    }));
    if (commit) {
      settlingTokensRef.current.set(tokenId, {
        x: nextX,
        y: nextY,
        until: performance.now() + 600,
      });
    }
    if (!socket || !sessionId) return;
    if (!commit) {
      // throttle leve: só envia a cada ~80ms no movimento livre
      const now = performance.now();
      const last = (handleTokenMove as { _t?: number })._t ?? 0;
      if (now - last < 80) return;
      (handleTokenMove as { _t?: number })._t = now;
    }
    await emitTokenMove(socket, sessionId, tokenId, nextX, nextY, { commit });
  }

  async function handleTokensMove(
    moves: Array<{ tokenId: string; x: number; y: number }>,
    options?: { commit?: boolean }
  ) {
    const commit = options?.commit !== false;
    const grid = board.gridSize || 50;
    const next = moves.map((move) => ({
      tokenId: move.tokenId,
      x: commit ? snapToGrid(move.x, grid) : move.x,
      y: commit ? snapToGrid(move.y, grid) : move.y,
    }));
    setBoard((previous) => ({
      ...previous,
      tokens: previous.tokens.map((token) => {
        const move = next.find((item) => item.tokenId === token.id);
        return move ? { ...token, x: move.x, y: move.y } : token;
      }),
    }));
    if (commit) {
      const until = performance.now() + 600;
      for (const move of next) {
        settlingTokensRef.current.set(move.tokenId, {
          x: move.x,
          y: move.y,
          until,
        });
      }
    }
    if (!socket || !sessionId) return;
    if (!commit) {
      const now = performance.now();
      const last = (handleTokensMove as { _t?: number })._t ?? 0;
      if (now - last < 80) return;
      (handleTokensMove as { _t?: number })._t = now;
    }
    await Promise.all(
      next.map((move) =>
        emitTokenMove(socket, sessionId, move.tokenId, move.x, move.y, {
          commit,
        })
      )
    );
  }

  async function openCharacterFromToken(token: BoardToken) {
    if (!token.characterId) return;
    try {
      const isOwn = Boolean(
        user &&
          (myCharacters.some((character) => character.id === token.characterId) ||
            characters.some(
              (character) =>
                character.id === token.characterId &&
                character.playerId === user.id
            ))
      );
      await openCharacterSheet(token.characterId, !isOwn);
    } catch (err) {
      console.error(err);
      alert("Não foi possível abrir a ficha deste NPC.");
    }
  }

  async function openCharacterSheet(characterId: number, readOnly: boolean) {
    const full = await getCharacterById(characterId);
    const lite: CampaignCharacterLite = {
      id: full.id,
      name: full.name,
      className: full.className,
      race: full.race,
      level: full.level,
      avatar: full.avatar,
      sheet: full.sheet,
      playerId: full.playerId,
      player: full.player,
    };
    setCharacters((previous) =>
      previous.map((character) =>
        character.id === lite.id ? { ...character, ...lite } : character
      )
    );
    setOpenCharacter(lite);
    setSheetReadOnly(readOnly);
  }

  function applyCharacterUpdate(updated: {
    id: number;
    name?: string;
    className?: string;
    race?: string;
    level?: number;
    avatar?: string | null;
    sheet?: unknown;
    playerId?: number;
    player?: CampaignCharacterLite["player"];
  }) {
    const patch: Partial<CampaignCharacterLite> = {
      id: updated.id,
      name: updated.name,
      className: updated.className,
      race: updated.race,
      level: updated.level,
      avatar: updated.avatar,
      sheet: updated.sheet,
      playerId: updated.playerId,
      player: updated.player,
    };
    setCharacters((previous) =>
      previous.map((character) =>
        character.id === updated.id ? { ...character, ...patch } : character
      )
    );
    setOpenCharacter((current) =>
      current?.id === updated.id ? { ...current, ...patch } : current
    );
  }

  async function handleUpdateWallet(wallet: CharacterWallet) {
    if (!openCharacter) return;
    setInventoryBusy(true);
    try {
      const updated = await updateCharacterWallet(openCharacter.id, wallet);
      applyCharacterUpdate(updated);
    } finally {
      setInventoryBusy(false);
    }
  }

  async function handleDiscardItem(payload: InventoryItemAction) {
    if (!openCharacter) return;
    setInventoryBusy(true);
    try {
      const updated = await discardCharacterItem(openCharacter.id, payload);
      applyCharacterUpdate(updated);
    } finally {
      setInventoryBusy(false);
    }
  }

  async function handleTransferItem(
    payload: InventoryItemAction & { targetCharacterId: number }
  ) {
    if (!openCharacter) return;
    setInventoryBusy(true);
    try {
      const result = await transferCharacterItem(openCharacter.id, payload);
      applyCharacterUpdate(result.from);
      applyCharacterUpdate(result.to);
    } finally {
      setInventoryBusy(false);
    }
  }

  async function handleRuler(
    from: { x: number; y: number },
    to: { x: number; y: number },
    options?: {
      sticky?: boolean;
      clear?: boolean;
      clearAll?: boolean;
      broadcast?: boolean;
      shape?: "line" | "square" | "circle" | "cone" | "beam";
      color?: string;
    }
  ) {
    if (!socket || !sessionId) return;
    if (options?.broadcast === false && !options?.clear && !options?.clearAll) {
      return;
    }
    if (options?.clear || options?.clearAll) {
      await emitRulerClear(socket, sessionId, {
        clearAll: Boolean(options.clearAll),
      });
      return;
    }
    await emitRuler(socket, sessionId, from, to, {
      sticky: options?.sticky,
      byUserName: user?.name,
      shape: options?.shape,
      color: options?.color,
    });
  }

  async function handleSendChat(text: string) {
    if (!socket || !sessionId || !user) return;
    const result = await emitChatMessage(socket, sessionId, text, user.name);
    if (!result.ok) {
      alert(result.error || "Falha ao enviar");
    }
  }

  async function handleSheetRoll(
    type: "skill" | "ability",
    key: string,
    options?: { advantage?: boolean }
  ) {
    if (!socket || !sessionId || !user || !openCharacter) return;
    const result = await emitSheetRoll(socket, sessionId, {
      characterId: openCharacter.id,
      type,
      key,
      userName: user.name,
      advantage: Boolean(options?.advantage),
    });
    if (!result.ok) {
      alert(result.error || "Falha na rolagem");
    }
  }

  async function handleUseFeature(name: string, description: string) {
    if (!socket || !sessionId || !user || !openCharacter) return;
    const action = buildFeatureAction(name, description);
    const result = await emitCharacterAction(socket, sessionId, {
      characterId: openCharacter.id,
      characterName: openCharacter.name,
      ...action,
      userName: user.name,
    });
    if (!result.ok) {
      alert(result.error || "Falha ao enviar habilidade");
    }
  }

  async function handleCastSpell(
    spell: Spell,
    options?: { advantage?: boolean }
  ) {
    if (!socket || !sessionId || !user || !openCharacter) return;
    const sheet =
      openCharacter.sheet && typeof openCharacter.sheet === "object"
        ? (openCharacter.sheet as CharacterFormData)
        : null;
    if (!sheet) {
      alert("Ficha incompleta para conjurar magia.");
      return;
    }
    const action = buildSpellAction(sheet, spell);
    const result = await emitCharacterAction(socket, sessionId, {
      characterId: openCharacter.id,
      characterName: openCharacter.name,
      ...action,
      userName: user.name,
      advantage: Boolean(options?.advantage),
    });
    if (!result.ok) {
      alert(result.error || "Falha ao conjurar magia");
    }
  }

  async function handleRequestCheck(payload: {
    type: "skill" | "ability";
    key: string;
    targetCharacterId?: number | null;
  }) {
    if (!socket || !sessionId || !user) return;
    await emitCheckRequest(socket, sessionId, {
      ...payload,
      userName: user.name,
    });
  }

  async function handleRequestInitiative(payload: {
    targetCharacterId?: number | null;
  }) {
    if (!socket || !sessionId || !user || !isMaster) return;
    await emitInitiativeRequest(socket, sessionId, {
      ...payload,
      userName: user.name,
    });
  }

  async function handleCombatAdd(payload: {
    name: string;
    initiative: number;
    kind?: "monster" | "other";
  }) {
    if (!socket || !sessionId || !user || !isMaster) return;
    const result = await emitCombatAdd(socket, sessionId, {
      ...payload,
      userName: user.name,
    });
    if (!result.ok) {
      alert(result.error || "Falha ao adicionar ao relógio");
    }
  }

  async function handleRollTokenInitiative(tokens: BoardToken[]) {
    if (!socket || !sessionId || !user || !isMaster) return;

    const characters = tokens.filter((token) => token.characterId);
    const npcOnly = tokens.filter((token) => !token.characterId);

    for (const token of characters) {
      if (!token.characterId) continue;
      const result = await emitInitiativeRoll(socket, sessionId, {
        characterId: token.characterId,
        userName: user.name,
      });
      if (!result.ok) {
        alert(result.error || `Falha na iniciativa de ${token.name}`);
        return;
      }
    }

    if (npcOnly.length > 0) {
      const entries = npcOnly.map((token) => {
        const monster = token.monsterId
          ? getMonsterById(token.monsterId)
          : undefined;
        return {
          tokenId: token.id,
          name: token.name || monster?.name || "NPC",
          dexterity: monster?.abilities.dexterity ?? 10,
        };
      });
      const result = await emitCombatRollNpcs(socket, sessionId, {
        entries,
        userName: user.name,
      });
      if (!result.ok) {
        alert(result.error || "Falha ao rolar iniciativa dos NPCs");
      }
    }
  }

  async function handleCombatStart() {
    if (!socket || !sessionId || !user || !isMaster) return;
    const result = await emitCombatStart(socket, sessionId, user.name);
    if (!result.ok) {
      alert(result.error || "Falha ao iniciar o relógio");
    }
  }

  async function handleCombatNext() {
    if (!socket || !sessionId || !user || !isMaster) return;
    const result = await emitCombatNext(socket, sessionId, user.name);
    if (!result.ok) {
      alert(result.error || "Falha ao avançar turno");
    }
  }

  async function handleCombatReorder(orderIds: string[]) {
    if (!socket || !sessionId || !user || !isMaster) return;
    // Atualização otimista para o arraste ficar fluido
    setCombat((previous) => {
      if (!previous) return previous;
      const byId = new Map(previous.order.map((entry) => [entry.id, entry]));
      const nextOrder = orderIds
        .map((id) => byId.get(id))
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
      for (const entry of previous.order) {
        if (!nextOrder.some((item) => item.id === entry.id)) {
          nextOrder.push(entry);
        }
      }
      const currentId = previous.order[previous.currentIndex]?.id;
      const currentIndex = currentId
        ? Math.max(
            0,
            nextOrder.findIndex((entry) => entry.id === currentId)
          )
        : 0;
      return { ...previous, order: nextOrder, currentIndex };
    });
    const result = await emitCombatReorder(
      socket,
      sessionId,
      orderIds,
      user.name
    );
    if (!result.ok) {
      alert(result.error || "Falha ao reordenar o relógio");
    }
  }

  async function handleCombatEnd() {
    if (!socket || !sessionId || !user || !isMaster) return;
    setInitiativeHoverTokenIds([]);
    await emitCombatEnd(socket, sessionId, user.name);
  }

  function handleHoverCombatant(entry: CombatantEntry | null) {
    if (!entry) {
      setInitiativeHoverTokenIds([]);
      return;
    }
    const ids = board.tokens
      .filter((token) => {
        if (entry.tokenId && token.id === entry.tokenId) return true;
        if (
          entry.characterId != null &&
          token.characterId === entry.characterId
        ) {
          return true;
        }
        return false;
      })
      .map((token) => token.id);
    setInitiativeHoverTokenIds(ids);
  }

  async function handlePendingInitiativeRoll(options?: {
    advantage?: boolean;
  }) {
    if (!pendingInitiative) {
      setPendingInitiative(null);
      return;
    }

    const target =
      (pendingInitiative.targetCharacterId != null
        ? myCharacters.find(
            (character) =>
              character.id === pendingInitiative.targetCharacterId
          )
        : null) || myCharacters[0];

    if (!target) {
      setPendingInitiative(null);
      return;
    }

    if (!socket || !sessionId || !user) return;
    await emitInitiativeRoll(socket, sessionId, {
      characterId: target.id,
      userName: user.name,
      advantage: Boolean(options?.advantage),
    });
    setPendingInitiative(null);
  }

  async function handleMonsterAction(payload: {
    monsterName: string;
    actionName: string;
    description?: string;
    attackBonus?: number | null;
    damage?: string | null;
    abilityModifier?: number | null;
    abilityLabel?: string | null;
  }) {
    if (!socket || !sessionId || !user || !isMaster) return;
    const result = await emitMonsterAction(socket, sessionId, {
      ...payload,
      tokenId: monsterTokenId,
      userName: user.name,
    });
    if (!result.ok) {
      alert(result.error || "Falha ao enviar ação da criatura");
    }
  }

  async function handlePendingCheckRoll(options?: { advantage?: boolean }) {
    if (!pendingCheck) {
      setPendingCheck(null);
      return;
    }

    const target =
      (pendingCheck.targetCharacterId != null
        ? myCharacters.find(
            (character) => character.id === pendingCheck.targetCharacterId
          )
        : null) || myCharacters[0];

    if (!target) {
      setPendingCheck(null);
      return;
    }

    if (!socket || !sessionId || !user) return;
    await emitSheetRoll(socket, sessionId, {
      characterId: target.id,
      type: pendingCheck.type,
      key: pendingCheck.key,
      userName: user.name,
      advantage: Boolean(options?.advantage),
    });
    setPendingCheck(null);
  }

  async function handleCloseSession() {
    if (!sessionId || !campaignId) return;
    if (!window.confirm("Encerrar a sessão de jogo?")) return;
    await closeGameSession(campaignId, sessionId);
    navigate(`/campaigns/${campaignId}`);
  }

  function openMonsterFromToken(token: BoardToken) {
    if (!token.monsterId) return;
    const monster = getMonsterById(token.monsterId);
    if (!monster) return;
    setOpenMonster(monster);
    setMonsterDisplayName(token.name || monster.name);
    setMonsterTokenId(token.id);
    setMonsterTokenHp({
      current: token.hpCurrent,
      max: token.hpMax,
    });
  }

  if (loading) {
    return (
      <div
        className="p-10 text-[var(--color-ink-muted)]"
        style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
      >
        Abrindo a sala de jogo...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mx-auto max-w-3xl px-6 py-10"
        style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
      >
        <Link to={`/campaigns/${campaignId}`} className="text-sm text-[var(--color-ink-muted)]">
          ← Voltar à campanha
        </Link>
        <div
          className="mt-4 border p-6 text-[var(--color-crimson)]"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden text-[var(--color-ink)]"
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col px-2 py-2 sm:px-3 sm:py-2.5">
        <div className="mb-2 flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <Link
            to={`/campaigns/${campaignId}`}
            className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] sm:text-sm"
          >
            ← Campanha
          </Link>
          <h1
            className="truncate text-base text-[var(--color-ink)] sm:text-lg"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            {campaignName || "Sala de jogo"}
          </h1>
          <p className="text-xs text-[var(--color-ink-soft)] sm:text-sm">
            {isMaster ? "Mestre" : "Jogador"}
          </p>
        </div>

        {combat && (combat.active || combat.collecting || combat.order.length > 0) ? (
          <div className="mb-2 shrink-0">
            <TurnClock
              combat={combat}
              isMaster={isMaster}
              tokens={board.tokens}
              onStart={handleCombatStart}
              onNext={handleCombatNext}
              onEnd={handleCombatEnd}
              onReorder={isMaster ? handleCombatReorder : undefined}
              onHoverCombatant={handleHoverCombatant}
            />
          </div>
        ) : null}

        {/* Mapa dominante; painéis laterais mais estreitos em monitores médios */}
        <div
          className={[
            "grid min-h-0 flex-1 gap-2 grid-cols-1 overflow-y-auto lg:overflow-hidden",
            leftCollapsed && rightCollapsed
              ? "lg:grid-cols-[auto_minmax(0,1fr)_auto]"
              : leftCollapsed
                ? "lg:grid-cols-[auto_minmax(0,1fr)_minmax(190px,210px)] xl:grid-cols-[auto_minmax(0,1.4fr)_minmax(200px,230px)] 2xl:grid-cols-[auto_minmax(0,1fr)_260px]"
                : rightCollapsed
                  ? "lg:grid-cols-[minmax(190px,210px)_minmax(0,1fr)_auto] xl:grid-cols-[minmax(200px,230px)_minmax(0,1.4fr)_auto] 2xl:grid-cols-[250px_minmax(0,1fr)_auto]"
                  : "lg:grid-cols-[minmax(190px,210px)_minmax(0,1fr)_minmax(190px,210px)] xl:grid-cols-[minmax(200px,230px)_minmax(0,1.4fr)_minmax(200px,230px)] 2xl:grid-cols-[250px_minmax(0,1fr)_260px]",
          ].join(" ")}
        >
          <div
            className={[
              "order-2 min-h-0 overflow-hidden lg:order-1 lg:max-h-none lg:h-full",
              leftCollapsed
                ? "max-h-none w-10"
                : "max-h-[min(42vh,22rem)]",
            ].join(" ")}
          >
            {leftCollapsed ? (
              <button
                type="button"
                onClick={() => setLeftCollapsed(false)}
                className="flex h-full w-full flex-col items-center justify-start border px-1 py-3 text-xs text-[var(--color-ink-muted)]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface)",
                  writingMode: "vertical-rl",
                }}
                title="Expandir painel"
              >
                ▶ Painel
              </button>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <button
                  type="button"
                  onClick={() => setLeftCollapsed(true)}
                  className="mb-1 shrink-0 border px-2 py-1 text-left text-[11px] text-[var(--color-ink-soft)]"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-parchment)",
                  }}
                >
                  ◀ Recolher painel
                </button>
                <div className="min-h-0 flex-1 overflow-hidden">
                  {isMaster ? (
                    <MasterPanel
                      board={board}
                      tool={tool}
                      characters={characters}
                      masterCharacters={masterCharacters}
                      members={members}
                      onToolChange={setTool}
                      onBoardChange={handleBoardChange}
                      placeOnSecretLayer={placeOnSecretLayer}
                      onPlaceOnSecretLayerChange={setPlaceOnSecretLayer}
                      watchPlayerScene={watchPlayerScene}
                      onWatchPlayerSceneChange={setWatchPlayerScene}
                      onOpenSheet={(character) => {
                        void openCharacterSheet(character.id, false).catch((err) => {
                          console.error(err);
                          alert("Não foi possível abrir a ficha.");
                        });
                      }}
                      onOpenMonster={(monster) => {
                        setOpenMonster(monster);
                        setMonsterDisplayName(monster.name);
                        setMonsterTokenId(null);
                        setMonsterTokenHp({
                          current: monster.hp,
                          max: monster.hp,
                        });
                      }}
                      onRequestCheck={handleRequestCheck}
                      combat={combat}
                      onRequestInitiative={handleRequestInitiative}
                      onCombatAdd={handleCombatAdd}
                      onCombatStart={handleCombatStart}
                      onCombatNext={handleCombatNext}
                      onCombatEnd={handleCombatEnd}
                      onCloseSession={handleCloseSession}
                      onCharacterUpdated={(updated) => {
                        setCharacters((previous) =>
                          previous.map((character) =>
                            character.id === updated.id
                              ? { ...character, ...updated }
                              : character
                          )
                        );
                        setOpenCharacter((current) =>
                          current?.id === updated.id
                            ? { ...current, ...updated }
                            : current
                        );
                      }}
                    />
                  ) : (
                    <PlayerPanel
                      tool={tool}
                      myCharacters={myCharacters}
                      onToolChange={setTool}
                      onOpenSheet={(character) => {
                        void openCharacterSheet(character.id, false).catch((err) => {
                          console.error(err);
                          alert("Não foi possível abrir a ficha.");
                        });
                      }}
                      onClearMyAnnotations={() =>
                        handleBoardChange({
                          ...board,
                          drawings: board.drawings.filter(
                            (item) => item.byUserId !== user?.id
                          ),
                          effects: board.effects.filter(
                            (item) => item.byUserId !== user?.id
                          ),
                          rulers: board.rulers.filter(
                            (item) => item.byUserId !== user?.id
                          ),
                        })
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="order-1 min-h-[min(58vh,32rem)] lg:order-2 lg:min-h-0 lg:h-full">
            <GameBoard
              board={board}
              tool={tool}
              canAnnotate
              currentUserId={user?.id ?? 0}
              isMaster={isMaster}
              placeOnSecretLayer={placeOnSecretLayer}
              watchPlayerScene={isMaster && watchPlayerScene}
              onMoveToken={handleTokenMove}
              onMoveTokens={handleTokensMove}
              draggingTokenIdsRef={draggingTokenIdsRef}
              onChangeBoard={handleBoardChange}
              onRemoveTokens={handleRemoveTokens}
              onRollTokenInitiative={
                isMaster ? handleRollTokenInitiative : undefined
              }
              highlightedTokenIds={initiativeHoverTokenIds}
              onRuler={handleRuler}
              onOpenMonsterSheet={openMonsterFromToken}
              onOpenCharacterSheet={openCharacterFromToken}
              onDropCharacter={(characterId, x, y) => {
                const character =
                  myCharacters.find((item) => item.id === characterId) ||
                  characters.find((item) => item.id === characterId) ||
                  masterCharacters.find((item) => item.id === characterId);
                if (!character || !user) return;
                const grid = board.gridSize || 50;
                const { hpMax, hpCurrent } = hitPointsFromSheet(character.sheet);
                const ownerUserId = character.playerId || user.id;
                const onFrozen = playerIsOnFrozenScene(board, ownerUserId);
                handleBoardChange({
                  ...board,
                  tokens: [
                    ...board.tokens,
                    {
                      id: `pc-${character.id}-${Date.now()}`,
                      kind: "pc",
                      name: character.name,
                      characterId: character.id,
                      ownerUserId,
                      x,
                      y,
                      color: "var(--color-green)",
                      sizeCategory: "Medium",
                      gridSpan: 1,
                      size: grid,
                      imageUrl: character.avatar || undefined,
                      hpMax,
                      hpCurrent,
                      customValue: "",
                      ...(onFrozen ? { onPlayerScene: true as const } : {}),
                    },
                  ],
                });
              }}
            />
          </div>

          <div
            className={[
              "order-3 min-h-0 overflow-hidden lg:max-h-none lg:h-full",
              rightCollapsed
                ? "max-h-none w-10"
                : "max-h-[min(36vh,18rem)]",
            ].join(" ")}
          >
            {rightCollapsed ? (
              <button
                type="button"
                onClick={() => setRightCollapsed(false)}
                className="flex h-full w-full flex-col items-center justify-start border px-1 py-3 text-xs text-[var(--color-ink-muted)]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface)",
                  writingMode: "vertical-rl",
                }}
                title="Expandir chat"
              >
                ◀ Chat
              </button>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <button
                  type="button"
                  onClick={() => setRightCollapsed(true)}
                  className="mb-1 shrink-0 border px-2 py-1 text-left text-[11px] text-[var(--color-ink-soft)]"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-parchment)",
                  }}
                >
                  Recolher chat ▶
                </button>
                <div className="min-h-0 flex-1 overflow-hidden">
                  <GameChat messages={chat} onSend={handleSendChat} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DiceRollOverlay
        visible={Boolean(diceFx)}
        label={diceFx?.label}
        total={diceFx?.total}
        natural={diceFx?.natural}
        dice={diceFx?.dice}
        onDone={() => setDiceFx(null)}
      />

      {openCharacter && (
        <PlayableSheetDrawer
          character={openCharacter}
          readOnly={sheetReadOnly}
          onClose={() => setOpenCharacter(null)}
          onRollSkill={(skill: Skill, options) =>
            handleSheetRoll("skill", skill, options)
          }
          onRollAbility={(ability: Ability, options) =>
            handleSheetRoll("ability", ability, options)
          }
          onUseFeature={handleUseFeature}
          onCastSpell={handleCastSpell}
          inventoryRecipients={characters
            .filter((character) => character.id !== openCharacter.id)
            .map((character) => ({
              id: character.id,
              name: character.name,
            }))}
          inventoryBusy={inventoryBusy}
          onUpdateWallet={handleUpdateWallet}
          onDiscardItem={handleDiscardItem}
          onTransferItem={handleTransferItem}
        />
      )}

      {openMonster && (
        <MonsterSheetDrawer
          monster={openMonster}
          displayName={monsterDisplayName || openMonster.name}
          hpCurrent={monsterTokenHp.current}
          hpMax={monsterTokenHp.max}
          canRoll={isMaster}
          onAction={handleMonsterAction}
          onClose={() => {
            setOpenMonster(null);
            setMonsterDisplayName("");
            setMonsterTokenId(null);
          }}
        />
      )}

      {pendingCheck && !isMaster && (
        <CheckPrompt
          request={pendingCheck}
          characterName={
            pendingCheck.characterName ||
            myCharacters.find(
              (character) => character.id === pendingCheck.targetCharacterId
            )?.name ||
            myCharacters[0]?.name
          }
          onRoll={handlePendingCheckRoll}
          onDismiss={() => setPendingCheck(null)}
        />
      )}

      {pendingInitiative && !isMaster && (
        <InitiativePrompt
          request={pendingInitiative}
          characterName={
            pendingInitiative.characterName ||
            myCharacters.find(
              (character) =>
                character.id === pendingInitiative.targetCharacterId
            )?.name ||
            myCharacters[0]?.name
          }
          onRoll={handlePendingInitiativeRoll}
          onDismiss={() => setPendingInitiative(null)}
        />
      )}
    </div>
  );
}
