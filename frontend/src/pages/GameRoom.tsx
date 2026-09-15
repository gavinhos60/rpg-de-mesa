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
  createGameSocket,
  emitBoardUpdate,
  emitChatMessage,
  emitCharacterAction,
  emitCheckRequest,
  emitRuler,
  emitSheetRoll,
  emitMonsterAction,
  emitTokenMove,
  joinSession,
} from "../services/gameSocket";
import type {
  BoardState,
  BoardToken,
  CampaignCharacterLite,
  ChatMessage,
  CheckRequest,
  SessionRuntimeState,
} from "../types/game";
import { emptyBoardState, snapToGrid } from "../types/game";
import type { Ability, CharacterFormData, Skill, Spell } from "../types/character";
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
  const [pendingCheck, setPendingCheck] = useState<CheckRequest | null>(null);
  const [openMonster, setOpenMonster] = useState<Monster | null>(null);
  const [monsterDisplayName, setMonsterDisplayName] = useState<string>("");
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
  /** Tokens em arraste local — ignora ecos remotos para não teleportar. */
  const draggingTokenIdsRef = useRef<Set<string>>(new Set());

  const applyState = useCallback((state: SessionRuntimeState) => {
    setBoard(state.board ?? emptyBoardState());
    setChat(state.chat ?? []);
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
            const dragging = draggingTokenIdsRef.current;
            if (dragging.size === 0) return nextBoard;
            return {
              ...nextBoard,
              tokens: nextBoard.tokens.map((token) => {
                if (!dragging.has(token.id)) return token;
                const local = previous.tokens.find((item) => item.id === token.id);
                return local ? { ...token, x: local.x, y: local.y } : token;
              }),
            };
          });
        });

        currentSocket.on(
          "token:moved",
          (payload: { tokenId: string; x: number; y: number }) => {
            if (draggingTokenIdsRef.current.has(payload.tokenId)) return;
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
    setBoard(next);
    if (!socket || !sessionId) return;
    await emitBoardUpdate(socket, sessionId, next);
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
    if (!socket || !sessionId) return;
    if (!commit) {
      // throttle leve: só envia a cada ~80ms no movimento livre
      const now = performance.now();
      const last = (handleTokenMove as { _t?: number })._t ?? 0;
      if (now - last < 80) return;
      (handleTokenMove as { _t?: number })._t = now;
    }
    await emitTokenMove(socket, sessionId, tokenId, nextX, nextY);
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
    if (!socket || !sessionId) return;
    if (!commit) {
      const now = performance.now();
      const last = (handleTokensMove as { _t?: number })._t ?? 0;
      if (now - last < 80) return;
      (handleTokensMove as { _t?: number })._t = now;
    }
    await Promise.all(
      next.map((move) =>
        emitTokenMove(socket, sessionId, move.tokenId, move.x, move.y)
      )
    );
  }

  async function openCharacterFromToken(token: BoardToken) {
    if (!token.characterId) return;
    try {
      await openCharacterSheet(token.characterId, true);
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

  async function handleRuler(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    if (!socket || !sessionId) return;
    await emitRuler(socket, sessionId, from, to);
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
                      onOpenSheet={(character) => {
                        void openCharacterSheet(character.id, true).catch((err) => {
                          console.error(err);
                          alert("Não foi possível abrir a ficha.");
                        });
                      }}
                      onOpenMonster={(monster) => {
                        setOpenMonster(monster);
                        setMonsterDisplayName(monster.name);
                        setMonsterTokenHp({
                          current: monster.hp,
                          max: monster.hp,
                        });
                      }}
                      onRequestCheck={handleRequestCheck}
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
              onMoveToken={handleTokenMove}
              onMoveTokens={handleTokensMove}
              draggingTokenIdsRef={draggingTokenIdsRef}
              onChangeBoard={handleBoardChange}
              onRuler={handleRuler}
              onOpenMonsterSheet={openMonsterFromToken}
              onOpenCharacterSheet={openCharacterFromToken}
              onDropCharacter={(characterId, x, y) => {
                const character =
                  myCharacters.find((item) => item.id === characterId) ||
                  characters.find((item) => item.id === characterId);
                if (!character || !user) return;
                if (
                  board.tokens.some(
                    (token) =>
                      token.characterId === character.id &&
                      token.ownerUserId === user.id
                  )
                ) {
                  alert("Seu token já está no mapa.");
                  return;
                }
                const grid = board.gridSize || 50;
                const { hpMax, hpCurrent } = hitPointsFromSheet(character.sheet);
                handleBoardChange({
                  ...board,
                  tokens: [
                    ...board.tokens,
                    {
                      id: `pc-${character.id}`,
                      kind: "pc",
                      name: character.name,
                      characterId: character.id,
                      ownerUserId: user.id,
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
    </div>
  );
}
