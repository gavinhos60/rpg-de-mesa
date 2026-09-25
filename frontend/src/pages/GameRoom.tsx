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
  updateCharacterResources,
  updateCharacterProgressFromForm,
  updateCharacterXp,
  discardCharacterItem,
  transferCharacterItem,
  type InventoryItemAction,
} from "../services/character.service";
import {
  createGameSocket,
  emitBoardUpdate,
  emitChatMessage,
  emitCharacterAction,
  emitCharacterUpdated,
  emitCheckRequest,
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
  emitEffectPing,
} from "../services/gameSocket";
import type {
  BoardEffect,
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
import { emptyBoardState, playerIsOnFrozenScene, snapToGrid, clearOwnAnnotations } from "../types/game";
import type {
  Ability,
  CharacterFormData,
  CharacterWallet,
  RestKind,
  Skill,
  Spell,
} from "../types/character";
import {
  applyRestToSheet,
  ensureResourcesSynced,
  normalizeResourcesState,
  resolveFeatureSpend,
  spendFeatureOnSheet,
  spendSpellSlot,
} from "../utils/characterResources";
import {
  buildFeatureAction,
  buildSpellAction,
} from "../utils/spellRoll";
import { hitPointsFromSheet } from "../utils/characterCombat";
import { getMonsterById, type Monster } from "../data/dnd/monsters";
import { GameBoard, type BoardTool } from "../components/game/GameBoard";
import { FX_INSTANT_MS } from "../components/game/effectPing";
import { GameChat, naturalD20 } from "../components/game/GameChat";
import { MasterPanel } from "../components/game/MasterPanel";
import { PlayerPanel } from "../components/game/PlayerPanel";
import { PlayableSheetDrawer } from "../components/game/PlayableSheetDrawer";
import { MonsterSheetDrawer } from "../components/game/MonsterSheetDrawer";
import { CheckPrompt } from "../components/game/CheckPrompt";
import { InitiativePrompt } from "../components/game/InitiativePrompt";
import { TurnClock } from "../components/game/TurnClock";
import { DiceRollOverlay, diceFromChatRoll } from "../components/game/DiceRollOverlay";
import { ActionLoadingOverlay } from "../components/game/ActionLoadingOverlay";
import { PapyrusOverlay } from "../components/game/PapyrusOverlay";
import { ShopPlayerModal } from "../components/game/ShopPlayerModal";
import { listPapiros, publishPapyrus } from "../services/papiros.service";
import { listShops } from "../services/mercado.service";
import type { Papyrus } from "../types/papiros";
import type { Shop } from "../types/mercado";
import { usePlayRoomChromeOptional } from "../contexts/PlayRoomChromeContext";

const PLAY_IMMERSIVE_STORAGE_KEY = "rpg-play-immersive";
const LEGACY_IMMERSIVE_STORAGE_KEY = "rpg-master-immersive";

function apiErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    (err as { response?: { data?: { error?: string } } }).response?.data?.error
  ) {
    return String(
      (err as { response: { data: { error: string } } }).response.data.error
    );
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

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
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [restBusy, setRestBusy] = useState(false);
  const [transientEffects, setTransientEffects] = useState<BoardEffect[]>([]);
  const [error, setError] = useState("");
  const [openCharacter, setOpenCharacter] =
    useState<CampaignCharacterLite | null>(null);
  const [sheetReadOnly, setSheetReadOnly] = useState(false);
  const [inventoryBusy, setInventoryBusy] = useState(false);
  const [xpBusy, setXpBusy] = useState(false);
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
  const [publishedPapyri, setPublishedPapyri] = useState<Papyrus[]>([]);
  const [previewPapyrus, setPreviewPapyrus] = useState<Papyrus | null>(null);
  const [dismissedPapyrusIds, setDismissedPapyrusIds] = useState<number[]>([]);
  const [openShops, setOpenShops] = useState<Shop[]>([]);
  const [playerShopOpen, setPlayerShopOpen] = useState(false);
  const [localAnnotationResetKey, setLocalAnnotationResetKey] = useState(0);
  const [playerShopFocusId, setPlayerShopFocusId] = useState<number | null>(
    null
  );
  const openShopsRef = useRef<Shop[]>([]);
  openShopsRef.current = openShops;

  const isMaster = role === "MASTER";
  const playRoomChrome = usePlayRoomChromeOptional();
  const immersive = Boolean(playRoomChrome?.immersive);
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
  const immersiveAppliedRef = useRef(false);
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
    if (!playRoomChrome) return;
    if (immersiveAppliedRef.current) return;
    immersiveAppliedRef.current = true;
    try {
      const stored =
        localStorage.getItem(PLAY_IMMERSIVE_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_IMMERSIVE_STORAGE_KEY);
      if (stored === "1") {
        playRoomChrome.setImmersive(true);
      }
    } catch {
      /* ignore */
    }
  }, [playRoomChrome]);

  useEffect(() => {
    if (!playRoomChrome) return;
    try {
      localStorage.setItem(
        PLAY_IMMERSIVE_STORAGE_KEY,
        playRoomChrome.immersive ? "1" : "0"
      );
    } catch {
      /* ignore */
    }
  }, [playRoomChrome, playRoomChrome?.immersive]);

  useEffect(() => {
    if (!immersive || !playRoomChrome) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") playRoomChrome.setImmersive(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [immersive, playRoomChrome]);

  const setImmersiveRef = useRef(playRoomChrome?.setImmersive);
  setImmersiveRef.current = playRoomChrome?.setImmersive;

  useEffect(() => {
    return () => {
      setImmersiveRef.current?.(false);
    };
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
            const masterMapChanged =
              (previous.mapUrl || "") !== (nextBoard.mapUrl || "");
            if (!nowFrozen || masterMapChanged) {
              // Sai da inspeção do mapa congelado quando o mestre muda de cenário.
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
            // Ignora posição intermediária do arraste — só aplica o teleporte final.
            if (payload.commit === false) return;
            if (draggingTokenIdsRef.current.has(payload.tokenId)) return;
            const settling = settlingTokensRef.current.get(payload.tokenId);
            if (settling && settling.until > performance.now()) {
              if (
                payload.x !== settling.x ||
                payload.y !== settling.y
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

        currentSocket.on(
          "character:updated",
          (payload: { character: CampaignCharacterLite }) => {
            if (!payload?.character?.id) return;
            applyCharacterUpdate(payload.character);
          }
        );

        currentSocket.on(
          "effect:ping",
          (payload: { effect: BoardEffect; sticky?: boolean }) => {
            if (!payload?.effect?.id) return;
            if (payload.sticky) return; // board:state já traz o persistido
            const effect = payload.effect;
            setTransientEffects((previous) => {
              if (previous.some((item) => item.id === effect.id)) return previous;
              return [...previous, effect];
            });
            const ttl = Math.max(
              400,
              (effect.expiresAt ?? Date.now() + FX_INSTANT_MS) - Date.now()
            );
            window.setTimeout(() => {
              setTransientEffects((previous) =>
                previous.filter((item) => item.id !== effect.id)
              );
            }, ttl);
          }
        );

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

        currentSocket.on("papyrus:state", (items: Papyrus[]) => {
          const next = Array.isArray(items) ? items : [];
          setPublishedPapyri(next);
          setDismissedPapyrusIds((prev) => {
            const live = new Set(next.map((p) => p.id));
            return prev.filter((id) => live.has(id));
          });
        });

        currentSocket.on("mercado:shops", (items: Shop[]) => {
          const next = Array.isArray(items) ? items : [];
          const prevIds = new Set(openShopsRef.current.map((s) => s.id));
          const newlyOpened = next.filter((s) => !prevIds.has(s.id));
          setOpenShops(next);
          if (roleRef.current !== "MASTER") {
            if (next.length === 0) {
              setPlayerShopOpen(false);
              setPlayerShopFocusId(null);
            } else if (newlyOpened.length > 0 || prevIds.size === 0) {
              setPlayerShopFocusId(newlyOpened[0]?.id ?? next[0]?.id ?? null);
              setPlayerShopOpen(true);
            }
          }
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

        try {
          const [papyri, shops] = await Promise.all([
            listPapiros(campaignId),
            listShops(campaignId),
          ]);
          if (!active) return;
          setPublishedPapyri(papyri.filter((p) => p.published));
          const visibleShops = shops.filter((s) => s.isOpen);
          setOpenShops(visibleShops);
          if ((joined.role ?? "PLAYER") !== "MASTER" && visibleShops.length > 0) {
            setPlayerShopFocusId(visibleShops[0].id);
            setPlayerShopOpen(true);
          }
        } catch (err) {
          console.error(err);
        }

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
      const masterMapChanged =
        (previous.mapUrl || "") !== (next.mapUrl || "");
      if (!nextFrozen || masterMapChanged) {
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
    // Só envia no drop — evita arraste “ao vivo” para os outros clientes.
    if (!commit) return;
    await emitTokenMove(socket, sessionId, tokenId, nextX, nextY, { commit: true });
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
    if (!commit) return;
    await Promise.all(
      next.map((move) =>
        emitTokenMove(socket, sessionId, move.tokenId, move.x, move.y, {
          commit: true,
        })
      )
    );
  }

  async function withActionBusy<T>(
    label: string,
    work: () => Promise<T>
  ): Promise<T> {
    setActionBusy(label);
    try {
      return await work();
    } finally {
      setActionBusy(null);
    }
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
    await withActionBusy("Abrindo ficha…", async () => {
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
    });
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
    setMasterCharacters((previous) =>
      previous.map((character) =>
        character.id === updated.id ? { ...character, ...patch } : character
      )
    );
    setOpenCharacter((current) =>
      current?.id === updated.id ? { ...current, ...patch } : current
    );
  }

  async function persistSheetResources(
    characterId: number,
    sheet: CharacterFormData
  ): Promise<CampaignCharacterLite | null> {
    const synced = ensureResourcesSynced(sheet);
    const resources = normalizeResourcesState(synced.resources);
    const saved = await updateCharacterResources(characterId, resources);
    const lite: CampaignCharacterLite = {
      id: saved.id,
      name: saved.name,
      className: saved.className,
      race: saved.race,
      level: saved.level,
      avatar: saved.avatar,
      sheet: saved.sheet,
      playerId: saved.playerId,
      player: saved.player,
    };
    applyCharacterUpdate(lite);
    if (socket && sessionId) {
      await emitCharacterUpdated(socket, sessionId, lite);
    }
    return lite;
  }

  async function handleUseFeature(
    name: string,
    description: string,
    abilityId?: string
  ) {
    if (!socket || !sessionId || !user || !openCharacter) return;
    await withActionBusy("Enviando ação…", async () => {
      const sheet =
        openCharacter.sheet && typeof openCharacter.sheet === "object"
          ? (openCharacter.sheet as CharacterFormData)
          : null;
      if (!sheet) {
        alert("Ficha incompleta.");
        return;
      }

      const rule = resolveFeatureSpend(abilityId, name, description, sheet);
      if (rule) {
        const spent = spendFeatureOnSheet(sheet, abilityId, name, description);
        if (spent.ok === false) {
          alert(spent.error);
          return;
        }
        await persistSheetResources(openCharacter.id, spent.sheet);
      }

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
    });
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
    await withActionBusy("Conjurando…", async () => {
      const spent = spendSpellSlot(sheet, spell.level);
      if (spent.ok === false) {
        alert(spent.error);
        return;
      }
      if (spell.level > 0) {
        await persistSheetResources(openCharacter.id, spent.sheet);
      }

      const action = buildSpellAction(spent.sheet, spell);
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
    });
  }

  async function handlePartyRest(kind: RestKind) {
    if (!isMaster) return;
    const targets = [
      ...characters,
      ...masterCharacters.filter(
        (mine) => !characters.some((character) => character.id === mine.id)
      ),
    ];
    if (targets.length === 0) {
      alert("Nenhum personagem na mesa para descansar.");
      return;
    }
    const label = kind === "short" ? "Descanso curto" : "Descanso longo";
    if (
      !window.confirm(
        `${label} para ${targets.length} personagem(ns)? Recursos serão recuperados conforme as regras.`
      )
    ) {
      return;
    }

    setRestBusy(true);
    setActionBusy(`${label}…`);
    try {
      for (const character of targets) {
        let sheet =
          character.sheet && typeof character.sheet === "object"
            ? (character.sheet as CharacterFormData)
            : null;
        if (!sheet) {
          try {
            const full = await getCharacterById(character.id);
            sheet =
              full.sheet && typeof full.sheet === "object"
                ? (full.sheet as CharacterFormData)
                : null;
          } catch {
            continue;
          }
        }
        if (!sheet) continue;
        const rested = applyRestToSheet(sheet, kind);
        await persistSheetResources(character.id, rested);
      }
      if (socket && sessionId && user) {
        await emitChatMessage(
          socket,
          sessionId,
          `✦ ${label} — o grupo recupera forças.`,
          user.name
        );
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao aplicar o descanso.");
    } finally {
      setRestBusy(false);
      setActionBusy(null);
    }
  }

  async function handleUpdateWallet(wallet: CharacterWallet) {
    if (!openCharacter) return;
    await withActionBusy("Salvando moedas…", async () => {
      setInventoryBusy(true);
      try {
        const updated = await updateCharacterWallet(openCharacter.id, wallet);
        applyCharacterUpdate(updated);
      } finally {
        setInventoryBusy(false);
      }
    });
  }

  async function handleDiscardItem(payload: InventoryItemAction) {
    if (!openCharacter) return;
    await withActionBusy("Descartando item…", async () => {
      setInventoryBusy(true);
      try {
        const updated = await discardCharacterItem(openCharacter.id, payload);
        applyCharacterUpdate(updated);
      } catch (err) {
        console.error(err);
        alert(apiErrorMessage(err, "Não foi possível remover o item."));
        throw err;
      } finally {
        setInventoryBusy(false);
      }
    });
  }

  async function handleTransferItem(
    payload: InventoryItemAction & { targetCharacterId: number }
  ) {
    if (!openCharacter) return;
    if (
      !Number.isFinite(payload.targetCharacterId) ||
      payload.targetCharacterId <= 0
    ) {
      alert("Escolha um personagem destinatário.");
      return;
    }
    await withActionBusy("Transferindo item…", async () => {
      setInventoryBusy(true);
      try {
        const result = await transferCharacterItem(openCharacter.id, payload);
        applyCharacterUpdate(result.from);
        applyCharacterUpdate(result.to);
      } catch (err) {
        console.error(err);
        alert(apiErrorMessage(err, "Não foi possível enviar o item."));
        throw err;
      } finally {
        setInventoryBusy(false);
      }
    });
  }

  async function syncCharacterProgress(saved: {
    id: number;
    name: string;
    className: string;
    race: string;
    level: number;
    avatar?: string | null;
    sheet?: unknown;
    playerId: number;
    player?: CampaignCharacterLite["player"];
  }) {
    const lite: CampaignCharacterLite = {
      id: saved.id,
      name: saved.name,
      className: saved.className,
      race: saved.race,
      level: saved.level,
      avatar: saved.avatar,
      sheet: saved.sheet,
      playerId: saved.playerId,
      player: saved.player,
    };
    applyCharacterUpdate(lite);
    if (socket && sessionId) {
      await emitCharacterUpdated(socket, sessionId, lite);
    }
  }

  async function handleUpdateXp(xp: number) {
    if (!openCharacter) return;
    const sheet =
      openCharacter.sheet && typeof openCharacter.sheet === "object"
        ? (openCharacter.sheet as CharacterFormData)
        : null;
    if (!sheet) {
      alert("Ficha incompleta.");
      return;
    }
    await withActionBusy("Salvando XP…", async () => {
      setXpBusy(true);
      try {
        const saved = await updateCharacterXp(openCharacter.id, sheet, xp);
        await syncCharacterProgress(saved);
      } catch (err) {
        console.error(err);
        alert(apiErrorMessage(err, "Não foi possível salvar o XP."));
        throw err;
      } finally {
        setXpBusy(false);
      }
    });
  }

  async function handleLevelUp(updated: CharacterFormData) {
    if (!openCharacter) return;
    await withActionBusy("Subindo de nível…", async () => {
      setXpBusy(true);
      try {
        const synced = ensureResourcesSynced(updated);
        const saved = await updateCharacterProgressFromForm(
          openCharacter.id,
          synced
        );
        await syncCharacterProgress(saved);
      } catch (err) {
        console.error(err);
        alert(apiErrorMessage(err, "Não foi possível subir de nível."));
        throw err;
      } finally {
        setXpBusy(false);
      }
    });
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

  async function handleEffectPing(payload: {
    sticky: boolean;
    broadcast: boolean;
    effect: Omit<BoardEffect, "id" | "byUserId"> & { id?: string };
  }) {
    if (!user) return;

    const pushTransient = (effect: BoardEffect) => {
      setTransientEffects((previous) => {
        if (previous.some((item) => item.id === effect.id)) return previous;
        return [...previous, effect];
      });
      const ttl = Math.max(
        400,
        (effect.expiresAt ?? Date.now() + FX_INSTANT_MS) - Date.now()
      );
      window.setTimeout(() => {
        setTransientEffects((previous) =>
          previous.filter((item) => item.id !== effect.id)
        );
      }, ttl);
    };

    // Instantânea local (sem transmitir): só neste cliente.
    const isMapPing = payload.effect.label === "__ping__";
    const pingTtl = payload.effect.expiresAt ?? Date.now() + 1400;

    if (!payload.sticky && !payload.broadcast) {
      pushTransient({
        ...payload.effect,
        id: payload.effect.id || `fx-${Date.now()}`,
        byUserId: user.id,
        byUserName: user.name,
        expiresAt: isMapPing ? pingTtl : Date.now() + FX_INSTANT_MS,
      });
      return;
    }

    if (!socket || !sessionId) return;

    const result = await emitEffectPing(socket, sessionId, {
      sticky: payload.sticky,
      x: payload.effect.x,
      y: payload.effect.y,
      toX: payload.effect.toX,
      toY: payload.effect.toY,
      radius: payload.effect.radius,
      color: payload.effect.color,
      label: payload.effect.label,
      fxKind: isMapPing ? "glow" : payload.effect.fxKind || "glow",
      fxElement: payload.effect.fxElement || "magic",
      byUserName: user.name,
      secret: payload.effect.secret,
      expiresAt: payload.sticky
        ? undefined
        : isMapPing
          ? pingTtl
          : payload.effect.expiresAt ?? Date.now() + FX_INSTANT_MS,
    });
    if (!result.ok) {
      alert(result.error || "Falha ao enviar efeito");
      return;
    }
    // Instantânea: servidor não ecoa para o remetente — mostra o efeito do ack.
    if (!payload.sticky && result.effect) {
      pushTransient(result.effect);
    }
  }

  async function handleSendChat(text: string) {
    if (!socket || !sessionId || !user) return;
    const looksLikeRoll = /^\s*\/(r|roll)\b/i.test(text);
    const send = () => emitChatMessage(socket, sessionId, text, user.name);
    const result = looksLikeRoll
      ? await withActionBusy("Rolando…", send)
      : await send();
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
    await withActionBusy("Rolando…", async () => {
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
    });
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

  async function handleRollTokenInitiative(tokens: BoardToken[]) {
    if (!socket || !sessionId || !user || !isMaster) return;

    await withActionBusy("Rolando iniciativa…", async () => {
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
    });
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
    await withActionBusy("Rolando iniciativa…", async () => {
      await emitInitiativeRoll(socket, sessionId, {
        characterId: target.id,
        userName: user.name,
        advantage: Boolean(options?.advantage),
      });
      setPendingInitiative(null);
    });
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
    await withActionBusy("Rolando ação…", async () => {
      const result = await emitMonsterAction(socket, sessionId, {
        ...payload,
        tokenId: monsterTokenId,
        userName: user.name,
      });
      if (!result.ok) {
        alert(result.error || "Falha ao enviar ação da criatura");
      }
    });
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
    await withActionBusy("Rolando teste…", async () => {
      await emitSheetRoll(socket, sessionId, {
        characterId: target.id,
        type: pendingCheck.type,
        key: pendingCheck.key,
        userName: user.name,
        advantage: Boolean(options?.advantage),
      });
      setPendingCheck(null);
    });
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

  const masterLayout = isMaster;
  const widePlayLayout = masterLayout || immersive;
  const layoutScrollClass = widePlayLayout
    ? "md:overflow-hidden"
    : "lg:overflow-hidden";
  const panelSideClass = widePlayLayout
    ? "md:max-h-none md:h-full"
    : "lg:max-h-none lg:h-full";
  const mapOrderClass = widePlayLayout
    ? "min-h-[min(52vh,28rem)] md:min-h-0 md:h-full"
    : "min-h-[min(58vh,32rem)] lg:min-h-0 lg:h-full";
  const panelStackMaxClass = widePlayLayout
    ? "max-h-[min(38vh,20rem)] md:max-h-none"
    : "max-h-[min(42vh,22rem)] lg:max-h-none";
  const chatStackMaxClass = widePlayLayout
    ? "max-h-[min(32vh,16rem)] md:max-h-none"
    : "max-h-[min(36vh,18rem)] lg:max-h-none";

  const gridColumnsClass = (() => {
    if (immersive) {
      /** Painel e dados iguais ~18% · mapa ~64% (18fr : 64fr : 18fr) */
      const sideBoardDice =
        "md:grid-cols-[minmax(0,18fr)_minmax(0,64fr)_minmax(0,18fr)]";
      if (leftCollapsed && rightCollapsed) {
        return "md:grid-cols-[auto_minmax(0,1fr)_auto]";
      }
      if (leftCollapsed) {
        return "md:grid-cols-[auto_minmax(0,64fr)_minmax(0,18fr)]";
      }
      if (rightCollapsed) {
        return "md:grid-cols-[minmax(0,18fr)_minmax(0,64fr)_auto]";
      }
      return sideBoardDice;
    }
    if (!masterLayout) {
      if (leftCollapsed && rightCollapsed) {
        return "lg:grid-cols-[auto_minmax(0,1fr)_auto]";
      }
      if (leftCollapsed) {
        return "lg:grid-cols-[auto_minmax(0,1fr)_minmax(228px,272px)] xl:grid-cols-[auto_minmax(0,1.4fr)_minmax(248px,300px)] 2xl:grid-cols-[auto_minmax(0,1fr)_320px]";
      }
      if (rightCollapsed) {
        return "lg:grid-cols-[minmax(228px,272px)_minmax(0,1fr)_auto] xl:grid-cols-[minmax(248px,300px)_minmax(0,1.4fr)_auto] 2xl:grid-cols-[320px_minmax(0,1fr)_auto]";
      }
      return "lg:grid-cols-[minmax(228px,272px)_minmax(0,1fr)_minmax(228px,272px)] xl:grid-cols-[minmax(248px,300px)_minmax(0,1.4fr)_minmax(248px,300px)] 2xl:grid-cols-[320px_minmax(0,1fr)_320px]";
    }
    if (leftCollapsed && rightCollapsed) {
      return "md:grid-cols-[auto_minmax(0,1fr)_auto]";
    }
    if (leftCollapsed) {
      return "md:grid-cols-[auto_minmax(0,1fr)_minmax(210px,248px)] xl:grid-cols-[auto_minmax(0,1.35fr)_minmax(228px,272px)] 2xl:grid-cols-[auto_minmax(0,1fr)_290px]";
    }
    if (rightCollapsed) {
      return "md:grid-cols-[minmax(210px,248px)_minmax(0,1fr)_auto] xl:grid-cols-[minmax(228px,272px)_minmax(0,1.35fr)_auto] 2xl:grid-cols-[290px_minmax(0,1fr)_auto]";
    }
    return "md:grid-cols-[minmax(210px,248px)_minmax(0,1fr)_minmax(210px,248px)] xl:grid-cols-[minmax(228px,272px)_minmax(0,1.35fr)_minmax(228px,272px)] 2xl:grid-cols-[290px_minmax(0,1fr)_290px]";
  })();

  return (
    <div
      className={[
        "flex flex-col overflow-hidden text-[var(--color-ink)]",
        immersive ? "h-[100dvh]" : "h-[calc(100vh-3rem)]",
      ].join(" ")}
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
      }}
    >
      {immersive && playRoomChrome ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-end gap-1 p-1"
          aria-label="Controles da tela cheia"
        >
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={() => playRoomChrome.setImmersive(false)}
              className="border px-2 py-0.5 text-[10px] text-[var(--color-ink)]"
              style={{
                fontFamily: "'Cinzel', serif",
                borderColor: "var(--color-crimson)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
              title="Esc ou clique para sair"
            >
              Sair da tela cheia
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={[
          "mx-auto flex h-full w-full flex-col",
          immersive
            ? "max-w-none px-0.5 py-0.5"
            : "max-w-[1800px] px-1.5 py-1.5 sm:px-2 sm:py-2",
        ].join(" ")}
      >
        {!immersive ? (
          <div className="mb-1.5 flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-1">
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
            {playRoomChrome ? (
              <button
                type="button"
                onClick={() => playRoomChrome.setImmersive(true)}
                className="ml-auto border px-2 py-0.5 text-[11px] text-[var(--color-ink-muted)]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface)",
                }}
                title="Oculta o cabeçalho do site e usa toda a altura da tela"
              >
                Tela cheia
              </button>
            ) : null}
          </div>
        ) : null}

        {combat && (combat.active || combat.collecting || combat.order.length > 0) ? (
          <div className={immersive ? "mb-0.5 shrink-0" : "mb-1.5 shrink-0"}>
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

        {/* Mapa dominante; mestre usa colunas desde md e tela cheia compacta */}
        <div
          className={[
            "grid min-h-0 flex-1 grid-cols-1 overflow-y-auto",
            layoutScrollClass,
            immersive ? "gap-0.5" : "gap-2",
            gridColumnsClass,
          ].join(" ")}
        >
          <div
            className={[
              "order-2 min-h-0 overflow-hidden md:order-1",
              panelSideClass,
              leftCollapsed
                ? "max-h-none w-9 sm:w-10"
                : panelStackMaxClass,
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
                {!immersive ? (
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
                ) : null}
                <div className="min-h-0 flex-1 overflow-hidden">
                  {isMaster ? (
                    <MasterPanel
                      compact={false}
                      board={board}
                      tool={tool}
                      characters={characters}
                      masterCharacters={masterCharacters}
                      members={members}
                      campaignId={campaignId}
                      onPreviewPapyrus={(papyrus) => {
                        setPreviewPapyrus(papyrus);
                      }}
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
                      onRest={handlePartyRest}
                      restBusy={restBusy}
                    />
                  ) : (
                    <PlayerPanel
                      campaignId={campaignId}
                      tool={tool}
                      myCharacters={myCharacters}
                      shops={openShops}
                      onOpenShops={() => {
                        setPlayerShopFocusId(openShops[0]?.id ?? null);
                        setPlayerShopOpen(true);
                      }}
                      onToolChange={setTool}
                      onOpenSheet={(character) => {
                        void openCharacterSheet(character.id, false).catch((err) => {
                          console.error(err);
                          alert("Não foi possível abrir a ficha.");
                        });
                      }}
                      onClearMyAnnotations={() => {
                        if (!user?.id) return;
                        setLocalAnnotationResetKey((n) => n + 1);
                        handleBoardChange(clearOwnAnnotations(board, user.id));
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={["order-1 md:order-2", mapOrderClass].join(" ")}>
            <GameBoard
              board={board}
              tool={tool}
              canAnnotate
              currentUserId={user?.id ?? 0}
              isMaster={isMaster}
              placeOnSecretLayer={placeOnSecretLayer}
              watchPlayerScene={isMaster && watchPlayerScene}
              localAnnotationResetKey={localAnnotationResetKey}
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
              onEffectPing={handleEffectPing}
              transientEffects={transientEffects}
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
              "order-3 min-h-0 overflow-hidden",
              panelSideClass,
              rightCollapsed
                ? "max-h-none w-9 sm:w-10"
                : chatStackMaxClass,
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
                {!immersive ? (
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
                ) : null}
                <div className="min-h-0 flex-1 overflow-hidden">
                  <GameChat compact={false} messages={chat} onSend={handleSendChat} />
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

      {actionBusy ? <ActionLoadingOverlay label={actionBusy} /> : null}

      {openCharacter && (
        <PlayableSheetDrawer
          character={openCharacter}
          readOnly={sheetReadOnly}
          allowInventoryEdit={isMaster}
          onClose={() => setOpenCharacter(null)}
          onRollSkill={(skill: Skill, options) =>
            handleSheetRoll("skill", skill, options)
          }
          onRollAbility={(ability: Ability, options) =>
            handleSheetRoll("ability", ability, options)
          }
          onUseFeature={handleUseFeature}
          onCastSpell={handleCastSpell}
          inventoryRecipients={[
            ...characters,
            ...masterCharacters,
          ]
            .filter(
              (character, index, all) =>
                character.id !== openCharacter.id &&
                all.findIndex((item) => item.id === character.id) === index
            )
            .map((character) => ({
              id: character.id,
              name: character.name,
            }))}
          inventoryBusy={inventoryBusy}
          onUpdateWallet={handleUpdateWallet}
          onDiscardItem={handleDiscardItem}
          onTransferItem={handleTransferItem}
          xpBusy={xpBusy}
          onUpdateXp={handleUpdateXp}
          onLevelUp={handleLevelUp}
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

      {playerShopOpen && !isMaster && openShops.some((s) => s.isOpen) ? (
        <ShopPlayerModal
          shops={openShops}
          initialShopId={playerShopFocusId}
          onClose={() => setPlayerShopOpen(false)}
        />
      ) : null}

      {previewPapyrus && (
        <PapyrusOverlay
          papyrus={previewPapyrus}
          isMaster={isMaster}
          onClose={() => setPreviewPapyrus(null)}
          onUnpublish={
            isMaster
              ? () => {
                  const id = previewPapyrus.id;
                  setPublishedPapyri((prev) => prev.filter((p) => p.id !== id));
                  setDismissedPapyrusIds((prev) =>
                    prev.includes(id) ? prev : [...prev, id]
                  );
                  setPreviewPapyrus(null);
                  void publishPapyrus(campaignId, id, false).catch((err) =>
                    console.error(err)
                  );
                }
              : undefined
          }
        />
      )}

      {!previewPapyrus &&
        publishedPapyri
          .filter((p) => !dismissedPapyrusIds.includes(p.id))
          .slice(0, 1)
          .map((papyrus) => (
            <PapyrusOverlay
              key={papyrus.id}
              papyrus={papyrus}
              isMaster={isMaster}
              onClose={() =>
                setDismissedPapyrusIds((prev) =>
                  prev.includes(papyrus.id) ? prev : [...prev, papyrus.id]
                )
              }
              onUnpublish={
                isMaster
                  ? () => {
                      const id = papyrus.id;
                      setPublishedPapyri((prev) =>
                        prev.filter((p) => p.id !== id)
                      );
                      setDismissedPapyrusIds((prev) =>
                        prev.includes(id) ? prev : [...prev, id]
                      );
                      void publishPapyrus(campaignId, id, false).catch((err) =>
                        console.error(err)
                      );
                    }
                  : undefined
              }
            />
          ))}
    </div>
  );
}
