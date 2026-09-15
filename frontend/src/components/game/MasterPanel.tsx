import { useMemo, useState } from "react";
import type { BoardState, BoardToken, CampaignCharacterLite } from "../../types/game";
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_MAP_COLS,
  DEFAULT_MAP_ROWS,
  DEFAULT_METERS_PER_SQUARE,
  DEFAULT_VISION_RADIUS_SQUARES,
  loadMapImageSize,
  mapSquaresOf,
  metersPerSquareOf,
  sizeCategoryToSpan,
  snapToGrid,
  snapshotPlayerMapView,
} from "../../types/game";
import { ABILITIES } from "../../data/dnd/abilities";
import { DND_SKILLS } from "../../data/dnd/skills";
import {
  getMonsterById,
  searchMonsters,
  type Monster,
} from "../../data/dnd/monsters";
import { monsterPortraitUrl } from "../../data/dnd/monsterPortrait";
import { hitPointsFromSheet } from "../../utils/characterCombat";
import { grantCustomItem } from "../../services/character.service";
import type { BoardTool } from "./GameBoard";
import { RibbonButton } from "../icons/MedievalIcons";

interface MasterPanelProps {
  board: BoardState;
  tool: BoardTool;
  characters: CampaignCharacterLite[];
  masterCharacters: CampaignCharacterLite[];
  members?: Array<{
    userId: number;
    role: "MASTER" | "PLAYER";
    name: string;
    email: string;
  }>;
  onToolChange: (tool: BoardTool) => void;
  onBoardChange: (board: BoardState) => void;
  onOpenSheet: (character: CampaignCharacterLite) => void;
  onOpenMonster: (monster: Monster) => void;
  onRequestCheck: (payload: {
    type: "skill" | "ability";
    key: string;
    targetCharacterId?: number | null;
  }) => void;
  onCloseSession?: () => void;
  onCharacterUpdated?: (character: CampaignCharacterLite) => void;
  placeOnSecretLayer: boolean;
  onPlaceOnSecretLayerChange: (enabled: boolean) => void;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Redimensiona e compacta a imagem para não inflar o estado da sessão. */
function readImageAsDataUrl(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const src = String(reader.result || "");
      const img = new Image();
      img.onerror = () => reject(new Error("image decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

type NpcSource = "monster" | "sheet" | "custom";
type MasterTab = "mapa" | "visao" | "tokens" | "grupo";

const MASTER_TABS: Array<{ id: MasterTab; label: string; hint: string }> = [
  { id: "mapa", label: "Mapa", hint: "Imagem, grade e mapas salvos" },
  { id: "visao", label: "Visão", hint: "Escuridão e camadas" },
  { id: "tokens", label: "Tokens", hint: "NPCs e monstros" },
  { id: "grupo", label: "Grupo", hint: "Fichas, itens e testes" },
];

const fieldStyle = {
  backgroundColor: "var(--color-parchment)",
  borderColor: "var(--color-border)",
} as const;

export function MasterPanel({
  board,
  tool,
  characters,
  masterCharacters,
  members = [],
  onToolChange,
  onBoardChange,
  onOpenSheet,
  onOpenMonster,
  onRequestCheck,
  onCloseSession,
  onCharacterUpdated,
  placeOnSecretLayer,
  onPlaceOnSecretLayerChange,
}: MasterPanelProps) {
  const [mapUrl, setMapUrl] = useState(board.mapUrl || "");
  const [mapWidthDraft, setMapWidthDraft] = useState(() =>
    String(mapSquaresOf(board).cols)
  );
  const [mapHeightDraft, setMapHeightDraft] = useState(() =>
    String(mapSquaresOf(board).rows)
  );
  const [visionDraft, setVisionDraft] = useState(
    String(board.visionRadiusSquares ?? DEFAULT_VISION_RADIUS_SQUARES)
  );
  const [gridSizeDraft, setGridSizeDraft] = useState(
    String(board.gridSize || DEFAULT_GRID_SIZE)
  );
  const [metersDraft, setMetersDraft] = useState(
    String(metersPerSquareOf(board) || DEFAULT_METERS_PER_SQUARE)
  );
  const [preparedMapName, setPreparedMapName] = useState("");
  const [activeTab, setActiveTab] = useState<MasterTab>("mapa");
  const [pendingScene, setPendingScene] = useState<{
    mapUrl: string;
    mapWidth?: number;
    mapHeight?: number;
    gridSize?: number;
    metersPerSquare?: number;
    widthDraft?: string;
    heightDraft?: string;
    gridDraft?: string;
    metersDraft?: string;
  } | null>(null);
  const [moveTokenIds, setMoveTokenIds] = useState<string[]>([]);
  const [npcSource, setNpcSource] = useState<NpcSource>("monster");
  const [npcName, setNpcName] = useState("Goblin");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");

  const fogPlayers = useMemo(() => {
    const map = new Map<
      number,
      { userId: number; name: string; email?: string }
    >();
    for (const member of members) {
      if (member.role === "MASTER") continue;
      map.set(member.userId, {
        userId: member.userId,
        name: member.name,
        email: member.email,
      });
    }
    for (const character of characters) {
      if (map.has(character.playerId)) continue;
      map.set(character.playerId, {
        userId: character.playerId,
        name: character.player?.name || `Jogador #${character.playerId}`,
        email: character.player?.email,
      });
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pt")
    );
  }, [characters, members]);
  const [monsterQuery, setMonsterQuery] = useState("");
  const [selectedMonsterId, setSelectedMonsterId] = useState("goblin");
  const [selectedSheetId, setSelectedSheetId] = useState<number | "">(
    masterCharacters[0]?.id ?? ""
  );
  const [checkType, setCheckType] = useState<"skill" | "ability">("skill");
  const [checkKey, setCheckKey] = useState<string>("perception");
  const [targetCharacterId, setTargetCharacterId] = useState<string>("");
  const [itemTargetId, setItemTargetId] = useState<string>("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemWeight, setItemWeight] = useState("");
  const [grantingItem, setGrantingItem] = useState(false);
  const [grantItemMessage, setGrantItemMessage] = useState("");

  const monsterResults = useMemo(() => {
    const results = searchMonsters(monsterQuery).slice(0, 40);
    const selected = getMonsterById(selectedMonsterId);
    if (selected && !results.some((item) => item.id === selected.id)) {
      return [selected, ...results].slice(0, 40);
    }
    return results;
  }, [monsterQuery, selectedMonsterId]);

  const selectedMonster: Monster | undefined = useMemo(
    () => getMonsterById(selectedMonsterId),
    [selectedMonsterId]
  );

  const selectedSheet = useMemo(
    () => masterCharacters.find((item) => item.id === selectedSheetId),
    [masterCharacters, selectedSheetId]
  );

  function selectMonster(id: string) {
    setSelectedMonsterId(id);
    const monster = getMonsterById(id);
    if (monster) setNpcName(monster.name);
  }

  function selectSheet(id: number | "") {
    setSelectedSheetId(id);
    const sheet = masterCharacters.find((item) => item.id === id);
    if (sheet) setNpcName(sheet.name);
  }

  function setSource(next: NpcSource) {
    setNpcSource(next);
    if (next === "monster" && selectedMonster) {
      setNpcName(selectedMonster.name);
    } else if (next === "sheet" && selectedSheet) {
      setNpcName(selectedSheet.name);
    } else if (next === "custom" && !npcName.trim()) {
      setNpcName("NPC");
    }
  }

  function defaultTokenImage(): string | undefined {
    if (customImageUrl) return customImageUrl;
    if (npcSource === "monster" && selectedMonster) {
      return monsterPortraitUrl(selectedMonster);
    }
    if (npcSource === "sheet" && selectedSheet?.avatar) {
      return selectedSheet.avatar;
    }
    return undefined;
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Selecione um arquivo de imagem.");
      return;
    }
    try {
      const dataUrl = await readImageAsDataUrl(file, 256);
      setCustomImageUrl(dataUrl);
    } catch {
      window.alert("Não foi possível ler a imagem.");
    }
  }

  async function applyMap() {
    const url = mapUrl.trim();
    if (!url) {
      requestSceneChange({
        mapUrl: "",
        mapWidth: DEFAULT_MAP_COLS,
        mapHeight: DEFAULT_MAP_ROWS,
        widthDraft: String(DEFAULT_MAP_COLS),
        heightDraft: String(DEFAULT_MAP_ROWS),
      });
      return;
    }
    try {
      const size = await loadMapImageSize(url);
      const grid = board.gridSize || DEFAULT_GRID_SIZE;
      const cols = Math.max(1, Math.round(size.width / grid));
      const rows = Math.max(1, Math.round(size.height / grid));
      requestSceneChange({
        mapUrl: url,
        mapWidth: cols,
        mapHeight: rows,
        widthDraft: String(cols),
        heightDraft: String(rows),
      });
    } catch {
      requestSceneChange({ mapUrl: url });
      window.alert(
        "Não foi possível estimar a grade. Defina largura × altura em quadrados após confirmar a troca."
      );
    }
  }

  function requestSceneChange(next: {
    mapUrl: string;
    mapWidth?: number;
    mapHeight?: number;
    gridSize?: number;
    metersPerSquare?: number;
    widthDraft?: string;
    heightDraft?: string;
    gridDraft?: string;
    metersDraft?: string;
  }) {
    if (next.mapUrl !== board.mapUrl) {
      setMoveTokenIds([]);
      setPendingScene(next);
      return;
    }
    commitSceneChange(next, []);
  }

  function commitSceneChange(
    next: {
      mapUrl: string;
      mapWidth?: number;
      mapHeight?: number;
      gridSize?: number;
      metersPerSquare?: number;
      widthDraft?: string;
      heightDraft?: string;
      gridDraft?: string;
      metersDraft?: string;
    },
    tokensToMove: string[]
  ) {
    const moveSet = new Set(tokensToMove);
    const tokens = board.tokens.map((token) => {
      if (moveSet.has(token.id)) {
        return { ...token, onPlayerScene: undefined };
      }
      // Não movidos (e os que já estavam no mapa dos jogadores) ficam no cenário antigo.
      return { ...token, onPlayerScene: true };
    });

    const anyOnPlayerScene = tokens.some((token) => token.onPlayerScene);
    const playerMapView = anyOnPlayerScene
      ? board.playerMapView ?? snapshotPlayerMapView(board)
      : null;

    onBoardChange({
      ...board,
      mapUrl: next.mapUrl,
      ...(next.mapWidth != null ? { mapWidth: next.mapWidth } : {}),
      ...(next.mapHeight != null ? { mapHeight: next.mapHeight } : {}),
      ...(next.gridSize != null ? { gridSize: next.gridSize } : {}),
      ...(next.metersPerSquare != null
        ? { metersPerSquare: next.metersPerSquare }
        : {}),
      tokens,
      // Novo cenário do mestre começa limpo de anotações; as antigas ficam no playerMapView.
      drawings: anyOnPlayerScene ? [] : board.drawings,
      effects: anyOnPlayerScene ? [] : board.effects,
      rulers: anyOnPlayerScene ? [] : board.rulers,
      playerMapView,
    });

    setMapUrl(next.mapUrl);
    if (next.widthDraft != null) setMapWidthDraft(next.widthDraft);
    if (next.heightDraft != null) setMapHeightDraft(next.heightDraft);
    if (next.gridDraft != null) setGridSizeDraft(next.gridDraft);
    if (next.metersDraft != null) setMetersDraft(next.metersDraft);
    setPendingScene(null);
    setMoveTokenIds([]);
  }

  function bringPlayersToCurrentScene() {
    onBoardChange({
      ...board,
      playerMapView: null,
      tokens: board.tokens.map((token) => ({
        ...token,
        onPlayerScene: undefined,
      })),
    });
  }

  function applyGrid() {
    const gridSize = Math.max(20, Math.min(120, Number(gridSizeDraft) || DEFAULT_GRID_SIZE));
    const metersPerSquare = Math.max(
      0.5,
      Math.min(10, Number(String(metersDraft).replace(",", ".")) || DEFAULT_METERS_PER_SQUARE)
    );
    const { cols, rows } = mapSquaresOf(board);
    onBoardChange({
      ...board,
      gridSize,
      metersPerSquare,
      mapWidth: cols,
      mapHeight: rows,
      tokens: board.tokens.map((token) => {
        const span =
          typeof token.gridSpan === "number"
            ? token.gridSpan
            : token.sizeCategory === "Large"
              ? 2
              : token.sizeCategory === "Huge"
                ? 3
                : token.sizeCategory === "Gargantuan"
                  ? 4
                  : 1;
        return {
          ...token,
          gridSpan: span,
          size: span * gridSize,
          x: snapToGrid(token.x, gridSize),
          y: snapToGrid(token.y, gridSize),
        };
      }),
    });
    setGridSizeDraft(String(gridSize));
    setMetersDraft(String(metersPerSquare));
    setMapWidthDraft(String(cols));
    setMapHeightDraft(String(rows));
  }

  function addNpcToken() {
    const grid = board.gridSize || DEFAULT_GRID_SIZE;
    const x = snapToGrid(140, grid);
    const y = snapToGrid(140, grid);
    let token: BoardToken;

    if (npcSource === "monster" && selectedMonster) {
      const span = sizeCategoryToSpan(selectedMonster.size);
      const displayName = npcName.trim() || selectedMonster.name;
      token = {
        id: uid("npc"),
        kind: "npc",
        name: displayName,
        monsterId: selectedMonster.id,
        x,
        y,
        color: selectedMonster.color,
        sizeCategory: selectedMonster.size,
        gridSpan: span,
        size: span * grid,
        imageUrl: customImageUrl || monsterPortraitUrl(selectedMonster),
        hpMax: selectedMonster.hp,
        hpCurrent: selectedMonster.hp,
        customValue: "",
        meta:
          displayName !== selectedMonster.name
            ? `${selectedMonster.name} · ND ${selectedMonster.cr} · CA ${selectedMonster.ac}`
            : `ND ${selectedMonster.cr} · CA ${selectedMonster.ac}`,
      };
    } else if (npcSource === "sheet") {
      const sheet = masterCharacters.find((item) => item.id === selectedSheetId);
      if (!sheet) return;
      const displayName = npcName.trim() || sheet.name;
      const { hpMax, hpCurrent } = hitPointsFromSheet(sheet.sheet);
      token = {
        id: uid("npc"),
        kind: "npc",
        name: displayName,
        characterId: sheet.id,
        x,
        y,
        color: "#5C4A1E",
        sizeCategory: "Medium",
        gridSpan: 1,
        size: grid,
        imageUrl: customImageUrl || sheet.avatar || undefined,
        hpMax,
        hpCurrent,
        customValue: "",
        meta: `${sheet.race} · ${sheet.className} · Nv. ${sheet.level}`,
      };
    } else {
      token = {
        id: uid("npc"),
        kind: "npc",
        name: npcName.trim() || "NPC",
        x,
        y,
        color: "var(--color-border-wood)",
        sizeCategory: "Medium",
        gridSpan: 1,
        size: grid,
        imageUrl: customImageUrl || undefined,
        hpMax: 10,
        hpCurrent: 10,
        customValue: "",
      };
    }

    onBoardChange({
      ...board,
      tokens: [
        ...board.tokens,
        placeOnSecretLayer ? { ...token, secret: true } : token,
      ],
    });
  }

  function clearDrawings() {
    onBoardChange({ ...board, drawings: [], rulers: [], effects: [] });
  }

  async function handleGrantItem() {
    const characterId = Number(itemTargetId);
    const name = itemName.trim();
    if (!characterId || Number.isNaN(characterId)) {
      window.alert("Selecione um personagem.");
      return;
    }
    if (!name) {
      window.alert("Informe o nome do item.");
      return;
    }

    const quantity = Math.max(1, Math.floor(Number(itemQuantity) || 1));
    const weightParsed = Number(String(itemWeight).replace(",", "."));
    const weight =
      itemWeight.trim() !== "" && Number.isFinite(weightParsed) && weightParsed >= 0
        ? weightParsed
        : undefined;
    setGrantingItem(true);
    setGrantItemMessage("");
    try {
      const updated = await grantCustomItem(characterId, {
        name,
        description: itemDescription.trim() || undefined,
        quantity,
        ...(weight != null ? { weight } : {}),
      });
      onCharacterUpdated?.({
        id: updated.id,
        name: updated.name,
        className: updated.className,
        race: updated.race,
        level: updated.level,
        avatar: updated.avatar,
        sheet: updated.sheet ?? null,
        playerId: updated.playerId,
        player: updated.player,
      });
      setItemName("");
      setItemDescription("");
      setItemQuantity("1");
      setItemWeight("");
      setGrantItemMessage(`“${name}” adicionado ao inventário de ${updated.name}.`);
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error
          ? String(
              (error as { response?: { data?: { error?: string } } }).response
                ?.data?.error
            )
          : "Não foi possível adicionar o item.";
      window.alert(message);
    } finally {
      setGrantingItem(false);
    }
  }

  function applyMapSize() {
    const cols = Math.max(1, Math.round(Number(mapWidthDraft) || 0));
    const rows = Math.max(1, Math.round(Number(mapHeightDraft) || 0));
    if (!cols || !rows) {
      window.alert("Informe largura e altura válidas em quadrados (ex.: 30 × 40).");
      return;
    }
    onBoardChange({
      ...board,
      mapWidth: cols,
      mapHeight: rows,
    });
    setMapWidthDraft(String(cols));
    setMapHeightDraft(String(rows));
  }

  function savePreparedMap() {
    const name = preparedMapName.trim();
    if (!name) {
      window.alert("Informe um nome para o mapa preparado.");
      return;
    }
    if (!board.mapUrl?.trim()) {
      window.alert("Aplique um mapa antes de salvar.");
      return;
    }
    const squares = mapSquaresOf(board);
    const entry = {
      id: uid("map"),
      name,
      mapUrl: board.mapUrl,
      mapWidth: squares.cols,
      mapHeight: squares.rows,
      gridSize: board.gridSize,
      metersPerSquare: metersPerSquareOf(board),
    };
    onBoardChange({
      ...board,
      preparedMaps: [...(board.preparedMaps ?? []), entry],
    });
    setPreparedMapName("");
  }

  function usePreparedMap(entry: {
    id: string;
    name: string;
    mapUrl: string;
    mapWidth?: number;
    mapHeight?: number;
    gridSize?: number;
    metersPerSquare?: number;
  }) {
    const gridSize = entry.gridSize || board.gridSize || DEFAULT_GRID_SIZE;
    const meters =
      entry.metersPerSquare ??
      metersPerSquareOf(board) ??
      DEFAULT_METERS_PER_SQUARE;
    const squares = mapSquaresOf({
      ...board,
      mapWidth: entry.mapWidth,
      mapHeight: entry.mapHeight,
      gridSize,
    });
    requestSceneChange({
      mapUrl: entry.mapUrl,
      mapWidth: squares.cols,
      mapHeight: squares.rows,
      gridSize,
      metersPerSquare: meters,
      widthDraft: String(squares.cols),
      heightDraft: String(squares.rows),
      gridDraft: String(gridSize),
      metersDraft: String(meters),
    });
  }

  const tools: Array<{ id: BoardTool; label: string }> = [
    { id: "select", label: "Mover" },
    { id: "party-move", label: "Grupo" },
    { id: "effect", label: "Marcar" },
    { id: "ruler", label: "Régua" },
    { id: "draw", label: "Desenhar" },
  ];

  const activeTabMeta = MASTER_TABS.find((tab) => tab.id === activeTab);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col border"
      style={{
        borderColor: "var(--color-border-strong)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <header
        className="shrink-0 border-b px-3 pb-2 pt-3"
        style={{
          borderColor: "var(--color-border)",
          background:
            "linear-gradient(180deg, var(--color-parchment-soft) 0%, var(--color-surface) 100%)",
        }}
      >
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3
            className="text-base text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            Mestre
          </h3>
          <span className="truncate text-[10px] text-[var(--color-ink-soft)]">
            {activeTabMeta?.hint}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tools.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onToolChange(item.id)}
              className="border px-2 py-1 text-[11px]"
              style={{
                fontFamily: "'Cinzel', serif",
                borderColor:
                  tool === item.id ? "var(--color-crimson)" : "var(--color-border)",
                backgroundColor:
                  tool === item.id ? "var(--color-crimson)" : "var(--color-parchment)",
                color:
                  tool === item.id
                    ? "var(--color-ink-inverse)"
                    : "var(--color-ink-muted)",
              }}
              title={
                item.id === "party-move"
                  ? "Teleporta tokens selecionados (ou todos os PCs)"
                  : undefined
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1 text-[11px]"
            style={{
              borderColor: placeOnSecretLayer
                ? "var(--color-crimson)"
                : "var(--color-border)",
              backgroundColor: placeOnSecretLayer
                ? "color-mix(in srgb, var(--color-crimson) 18%, var(--color-parchment))"
                : "var(--color-parchment)",
              color: "var(--color-ink)",
            }}
          >
            <input
              type="checkbox"
              checked={placeOnSecretLayer}
              onChange={(event) =>
                onPlaceOnSecretLayerChange(event.target.checked)
              }
            />
            Camada secreta
          </label>
          <button
            type="button"
            onClick={clearDrawings}
            className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
            style={fieldStyle}
          >
            Limpar marcações
          </button>
        </div>

        {board.playerMapView ? (
          <div
            className="mt-2 rounded border px-2 py-1.5"
            style={{
              borderColor: "var(--color-crimson)",
              backgroundColor:
                "color-mix(in srgb, var(--color-crimson) 12%, var(--color-parchment))",
            }}
          >
            <p className="text-[11px] leading-snug text-[var(--color-ink)]">
              Jogadores em outro cenário
              {board.tokens.some((t) => t.onPlayerScene)
                ? ` · ${board.tokens.filter((t) => t.onPlayerScene).length} token(s) lá`
                : ""}
            </p>
            <button
              type="button"
              onClick={bringPlayersToCurrentScene}
              className="mt-1 text-[11px] font-medium text-[var(--color-crimson)] underline"
            >
              Trazer jogadores e tokens para este mapa
            </button>
          </div>
        ) : null}
      </header>

      <nav
        className="grid shrink-0 grid-cols-4 border-b"
        style={{ borderColor: "var(--color-border)" }}
        aria-label="Seções do painel"
      >
        {MASTER_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative px-1 py-2.5 text-[11px] transition-colors"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: active ? 600 : 500,
                color: active ? "var(--color-crimson)" : "var(--color-ink-muted)",
                backgroundColor: active
                  ? "color-mix(in srgb, var(--color-crimson) 8%, var(--color-surface))"
                  : "transparent",
              }}
            >
              {tab.label}
              {active && (
                <span
                  className="absolute inset-x-2 bottom-0 h-0.5"
                  style={{ backgroundColor: "var(--color-crimson)" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {activeTab === "mapa" && (
          <div className="space-y-3">
            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <h4
                className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Imagem do mapa
              </h4>
              <input
                value={mapUrl}
                onChange={(event) => setMapUrl(event.target.value)}
                placeholder="https://.../mapa.jpg"
                className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <RibbonButton
                type="button"
                onClick={() => void applyMap()}
                className="w-full"
              >
                Aplicar mapa
              </RibbonButton>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <section
                className="rounded border p-2.5"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment-soft)",
                }}
              >
                <h4
                  className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                  Tamanho
                </h4>
                <div className="mb-2 grid grid-cols-2 gap-1.5">
                  <label className="block text-[10px] text-[var(--color-ink-soft)]">
                    Largura
                    <input
                      value={mapWidthDraft}
                      onChange={(event) => setMapWidthDraft(event.target.value)}
                      placeholder="30"
                      className="mt-0.5 w-full border px-1.5 py-1.5 text-sm outline-none"
                      style={fieldStyle}
                    />
                  </label>
                  <label className="block text-[10px] text-[var(--color-ink-soft)]">
                    Altura
                    <input
                      value={mapHeightDraft}
                      onChange={(event) => setMapHeightDraft(event.target.value)}
                      placeholder="40"
                      className="mt-0.5 w-full border px-1.5 py-1.5 text-sm outline-none"
                      style={fieldStyle}
                    />
                  </label>
                </div>
                <p className="mb-2 text-[10px] leading-snug text-[var(--color-ink-soft)]">
                  Em quadrados (ex.: 30×40).
                </p>
                <RibbonButton
                  type="button"
                  onClick={applyMapSize}
                  className="w-full"
                >
                  Aplicar
                </RibbonButton>
              </section>

              <section
                className="rounded border p-2.5"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment-soft)",
                }}
              >
                <h4
                  className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                  Grade
                </h4>
                <div className="mb-2 grid grid-cols-1 gap-1.5">
                  <label className="block text-[10px] text-[var(--color-ink-soft)]">
                    px / quad
                    <input
                      value={gridSizeDraft}
                      onChange={(event) => setGridSizeDraft(event.target.value)}
                      className="mt-0.5 w-full border px-1.5 py-1.5 text-sm outline-none"
                      style={fieldStyle}
                    />
                  </label>
                  <label className="block text-[10px] text-[var(--color-ink-soft)]">
                    m / quad
                    <input
                      value={metersDraft}
                      onChange={(event) => setMetersDraft(event.target.value)}
                      className="mt-0.5 w-full border px-1.5 py-1.5 text-sm outline-none"
                      style={fieldStyle}
                    />
                  </label>
                </div>
                <RibbonButton type="button" onClick={applyGrid} className="w-full">
                  Aplicar
                </RibbonButton>
              </section>
            </div>

            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <h4
                className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Mapas preparados
              </h4>
              <div className="mb-2 flex gap-1.5">
                <input
                  value={preparedMapName}
                  onChange={(event) => setPreparedMapName(event.target.value)}
                  placeholder="Nome"
                  className="min-w-0 flex-1 border px-2 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                />
                <button
                  type="button"
                  onClick={savePreparedMap}
                  className="shrink-0 border px-2 py-1.5 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                >
                  Salvar
                </button>
              </div>
              {(board.preparedMaps ?? []).length === 0 ? (
                <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum mapa salvo nesta sessão.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {(board.preparedMaps ?? []).map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => usePreparedMap(entry)}
                      className="truncate border px-2 py-2 text-left text-xs text-[var(--color-ink)]"
                      style={fieldStyle}
                      title={`Usar ${entry.name}`}
                    >
                      {entry.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "visao" && (
          <div className="space-y-3">
            <section
              className="rounded border p-2.5"
              style={{
                borderColor: board.fogEnabled
                  ? "var(--color-crimson)"
                  : "var(--color-border)",
                backgroundColor: board.fogEnabled
                  ? "color-mix(in srgb, var(--color-crimson) 10%, var(--color-parchment-soft))"
                  : "var(--color-parchment-soft)",
              }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h4
                    className="text-xs tracking-wide text-[var(--color-ink)]"
                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                  >
                    Escuridão
                  </h4>
                  <p className="mt-0.5 text-[10px] leading-snug text-[var(--color-ink-soft)]">
                    Cada jogador vê só a luz do próprio personagem.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const enabling = !board.fogEnabled;
                    const vision = Math.max(
                      0,
                      Math.min(
                        12,
                        Number(visionDraft) || DEFAULT_VISION_RADIUS_SQUARES
                      )
                    );
                    onBoardChange({
                      ...board,
                      fogEnabled: enabling,
                      visionRadiusSquares: vision,
                      fogExemptUserIds: board.fogExemptUserIds ?? [],
                    });
                  }}
                  className="shrink-0 border px-2.5 py-1.5 text-[11px]"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor: board.fogEnabled
                      ? "var(--color-crimson)"
                      : "var(--color-border)",
                    backgroundColor: board.fogEnabled
                      ? "var(--color-crimson)"
                      : "var(--color-parchment)",
                    color: board.fogEnabled
                      ? "var(--color-ink-inverse)"
                      : "var(--color-ink-muted)",
                  }}
                >
                  {board.fogEnabled ? "Ativa" : "Off"}
                </button>
              </div>

              <label className="mb-1 block text-[10px] text-[var(--color-ink-soft)]">
                Raio padrão (quadrados)
              </label>
              <div className="flex gap-1.5">
                <input
                  value={visionDraft}
                  onChange={(event) => setVisionDraft(event.target.value)}
                  className="w-full border px-2 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                />
                <button
                  type="button"
                  onClick={() => {
                    const vision = Math.max(
                      0,
                      Math.min(
                        12,
                        Number(visionDraft) || DEFAULT_VISION_RADIUS_SQUARES
                      )
                    );
                    onBoardChange({
                      ...board,
                      visionRadiusSquares: vision,
                    });
                    setVisionDraft(String(vision));
                  }}
                  className="shrink-0 border px-2.5 py-1.5 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                >
                  Aplicar
                </button>
              </div>
            </section>

            {board.fogEnabled && (
              <section
                className="rounded border p-2.5"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment-soft)",
                }}
              >
                <h4
                  className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                  Por jogador
                </h4>
                {fogPlayers.length === 0 ? (
                  <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                    Nenhum jogador na mesa.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {fogPlayers.map((player) => {
                      const exempt = (board.fogExemptUserIds ?? []).includes(
                        player.userId
                      );
                      const userKey = String(player.userId);
                      const playerVision =
                        board.visionByUserId?.[userKey] ??
                        board.visionRadiusSquares ??
                        DEFAULT_VISION_RADIUS_SQUARES;
                      return (
                        <div
                          key={player.userId}
                          className="rounded border p-2"
                          style={fieldStyle}
                        >
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink)]">
                            <input
                              type="checkbox"
                              checked={exempt}
                              onChange={() => {
                                const current = new Set(
                                  board.fogExemptUserIds ?? []
                                );
                                if (exempt) current.delete(player.userId);
                                else current.add(player.userId);
                                onBoardChange({
                                  ...board,
                                  fogExemptUserIds: Array.from(current),
                                });
                              }}
                            />
                            <span className="min-w-0 truncate">
                              {player.name}
                              <span className="text-[10px] text-[var(--color-ink-soft)]">
                                {exempt ? " · vê tudo" : " · só luz"}
                              </span>
                            </span>
                          </label>
                          <label className="mt-1.5 block text-[10px] text-[var(--color-ink-soft)]">
                            Visão
                            <input
                              type="number"
                              min={0}
                              max={12}
                              value={playerVision}
                              onChange={(event) => {
                                const next = Math.max(
                                  0,
                                  Math.min(
                                    12,
                                    Number(event.target.value) ||
                                      DEFAULT_VISION_RADIUS_SQUARES
                                  )
                                );
                                onBoardChange({
                                  ...board,
                                  visionByUserId: {
                                    ...(board.visionByUserId ?? {}),
                                    [userKey]: next,
                                  },
                                });
                              }}
                              className="mt-0.5 w-full border px-2 py-1 text-sm outline-none"
                              style={fieldStyle}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            <p className="text-[10px] leading-snug text-[var(--color-ink-soft)]">
              Dica: botão direito em um token troca a camada pública/secreta.
            </p>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  ["monster", "Monstro"],
                  ["sheet", "Ficha"],
                  ["custom", "Livre"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSource(id)}
                  className="border px-1 py-2 text-[11px]"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor:
                      npcSource === id
                        ? "var(--color-crimson)"
                        : "var(--color-border)",
                    backgroundColor:
                      npcSource === id
                        ? "var(--color-crimson)"
                        : "var(--color-parchment)",
                    color:
                      npcSource === id
                        ? "var(--color-ink-inverse)"
                        : "var(--color-ink-muted)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              {npcSource === "monster" && (
                <div className="space-y-2">
                  <input
                    value={monsterQuery}
                    onChange={(event) => setMonsterQuery(event.target.value)}
                    placeholder="Buscar monstro..."
                    className="w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                  />
                  <select
                    value={selectedMonsterId}
                    onChange={(event) => selectMonster(event.target.value)}
                    className="w-full border px-2 py-1.5 text-sm"
                    style={fieldStyle}
                  >
                    {monsterResults.map((monster) => (
                      <option key={monster.id} value={monster.id}>
                        {monster.name} (ND {monster.cr})
                      </option>
                    ))}
                  </select>
                  {selectedMonster && (
                    <div
                      className="flex gap-2 border p-2"
                      style={fieldStyle}
                    >
                      <img
                        src={
                          customImageUrl || monsterPortraitUrl(selectedMonster)
                        }
                        alt={selectedMonster.name}
                        className="h-12 w-12 rounded-full object-cover"
                        style={{ backgroundColor: "#1A140F" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[var(--color-ink)]">
                          {selectedMonster.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-ink-soft)]">
                          {selectedMonster.type} · {selectedMonster.sizeLabel} ·
                          CA {selectedMonster.ac} · PV {selectedMonster.hp}
                        </p>
                        <button
                          type="button"
                          className="mt-0.5 text-[11px] text-[var(--color-crimson)] underline"
                          onClick={() => onOpenMonster(selectedMonster)}
                        >
                          Ficha completa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {npcSource === "sheet" && (
                <select
                  value={selectedSheetId}
                  onChange={(event) =>
                    selectSheet(
                      event.target.value ? Number(event.target.value) : ""
                    )
                  }
                  className="w-full border px-2 py-1.5 text-sm"
                  style={fieldStyle}
                >
                  {masterCharacters.length === 0 && (
                    <option value="">Nenhuma ficha sua disponível</option>
                  )}
                  {masterCharacters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name} · Nv. {character.level}
                    </option>
                  ))}
                </select>
              )}

              {npcSource === "custom" && (
                <p className="mb-2 text-[11px] text-[var(--color-ink-soft)]">
                  Token livre — só nome e foto opcional.
                </p>
              )}

              <label className="mt-2 block text-[10px] text-[var(--color-ink-soft)]">
                Nome no mapa
                <input
                  value={npcName}
                  onChange={(event) => setNpcName(event.target.value)}
                  placeholder={
                    npcSource === "monster"
                      ? selectedMonster?.name || "Nome"
                      : npcSource === "sheet"
                        ? selectedSheet?.name || "Nome"
                        : "Nome do NPC"
                  }
                  className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                />
              </label>
            </section>

            <section
              className="flex items-center gap-2 rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              {defaultTokenImage() ? (
                <img
                  src={defaultTokenImage()}
                  alt="Prévia"
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                  style={{ backgroundColor: "#1A140F" }}
                />
              ) : (
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs text-[var(--color-ink-inverse)]"
                  style={{ backgroundColor: "var(--color-border-wood)" }}
                >
                  {(npcName || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[10px] text-[var(--color-ink-soft)]">
                  Foto do token
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className="inline-block cursor-pointer border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                    style={fieldStyle}
                  >
                    Enviar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        void handleImageUpload(file);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {customImageUrl && (
                    <button
                      type="button"
                      className="text-[11px] text-[var(--color-crimson)] underline"
                      onClick={() => setCustomImageUrl("")}
                    >
                      Padrão
                    </button>
                  )}
                </div>
              </div>
            </section>

            <RibbonButton
              type="button"
              onClick={addNpcToken}
              className="w-full"
            >
              Colocar no mapa
            </RibbonButton>
          </div>
        )}

        {activeTab === "grupo" && (
          <div className="space-y-3">
            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <h4
                className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Personagens
              </h4>
              {characters.length === 0 ? (
                <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum personagem na campanha.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5">
                  {characters.map((character) => (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => onOpenSheet(character)}
                      className="border px-2.5 py-2 text-left"
                      style={fieldStyle}
                    >
                      <span className="block truncate text-sm text-[var(--color-ink)]">
                        {character.name}
                      </span>
                      <span className="block truncate text-[10px] text-[var(--color-ink-soft)]">
                        {character.className} · Nv. {character.level}
                        {character.player?.name
                          ? ` · ${character.player.name}`
                          : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <h4
                className="mb-1 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Pedir teste
              </h4>
              <p className="mb-2 text-[10px] text-[var(--color-ink-soft)]">
                Perícia ou atributo para um personagem (ou todos).
              </p>
              <div className="mb-1.5 grid grid-cols-2 gap-1.5">
                <select
                  value={checkType}
                  onChange={(event) => {
                    const next = event.target.value as "skill" | "ability";
                    setCheckType(next);
                    setCheckKey(next === "skill" ? "perception" : "strength");
                  }}
                  className="border px-1.5 py-1.5 text-sm"
                  style={fieldStyle}
                >
                  <option value="skill">Perícia</option>
                  <option value="ability">Atributo</option>
                </select>
                <select
                  value={targetCharacterId}
                  onChange={(event) => setTargetCharacterId(event.target.value)}
                  className="border px-1.5 py-1.5 text-sm"
                  style={fieldStyle}
                >
                  <option value="">Todos</option>
                  {characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={checkKey}
                onChange={(event) => setCheckKey(event.target.value)}
                className="mb-2 w-full border px-1.5 py-1.5 text-sm"
                style={fieldStyle}
              >
                {checkType === "skill"
                  ? DND_SKILLS.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))
                  : ABILITIES.map((ability) => (
                      <option key={ability.id} value={ability.id}>
                        {ability.name}
                      </option>
                    ))}
              </select>
              <RibbonButton
                type="button"
                className="w-full"
                onClick={() =>
                  onRequestCheck({
                    type: checkType,
                    key: checkKey,
                    targetCharacterId: targetCharacterId
                      ? Number(targetCharacterId)
                      : null,
                  })
                }
              >
                Pedir teste
              </RibbonButton>
            </section>

            <section
              className="rounded border p-2.5"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <h4
                className="mb-1 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Dar item
              </h4>
              <p className="mb-2 text-[10px] text-[var(--color-ink-soft)]">
                Item customizado no inventário.
              </p>
              <select
                value={itemTargetId}
                onChange={(event) => {
                  setItemTargetId(event.target.value);
                  setGrantItemMessage("");
                }}
                className="mb-1.5 w-full border px-1.5 py-1.5 text-sm"
                style={fieldStyle}
              >
                <option value="">Personagem</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                    {character.player?.name
                      ? ` (${character.player.name})`
                      : ""}
                  </option>
                ))}
              </select>
              <input
                value={itemName}
                onChange={(event) => setItemName(event.target.value)}
                placeholder="Nome do item"
                className="mb-1.5 w-full border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <textarea
                value={itemDescription}
                onChange={(event) => setItemDescription(event.target.value)}
                placeholder="Descrição"
                rows={2}
                className="mb-1.5 w-full resize-y border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <div className="mb-2 grid grid-cols-2 gap-1.5">
                <label className="block text-[10px] text-[var(--color-ink-soft)]">
                  Qtd
                  <input
                    value={itemQuantity}
                    onChange={(event) => setItemQuantity(event.target.value)}
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                  />
                </label>
                <label className="block text-[10px] text-[var(--color-ink-soft)]">
                  Peso (kg)
                  <input
                    value={itemWeight}
                    onChange={(event) => setItemWeight(event.target.value)}
                    placeholder="—"
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                  />
                </label>
              </div>
              <RibbonButton
                type="button"
                className="w-full"
                disabled={grantingItem}
                onClick={() => void handleGrantItem()}
              >
                {grantingItem ? "Adicionando..." : "Adicionar ao inventário"}
              </RibbonButton>
              {grantItemMessage ? (
                <p className="mt-1.5 text-[11px] text-[var(--color-ink-muted)]">
                  {grantItemMessage}
                </p>
              ) : null}
            </section>
          </div>
        )}
      </div>

      {onCloseSession && (
        <footer
          className="shrink-0 border-t p-2"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            type="button"
            onClick={onCloseSession}
            className="w-full border px-3 py-2 text-sm text-[var(--color-crimson)]"
            style={{
              borderColor: "var(--color-crimson)",
              backgroundColor: "var(--color-parchment-soft)",
              fontFamily: "'Cinzel', serif",
            }}
          >
            Encerrar sessão
          </button>
        </footer>
      )}

      {pendingScene && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setPendingScene(null);
              setMoveTokenIds([]);
            }
          }}
        >
          <div
            className="flex max-h-[min(90vh,40rem)] w-full max-w-md flex-col border-2 shadow-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-crimson)",
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="border-b p-4" style={{ borderColor: "var(--color-border)" }}>
              <h4
                className="text-base text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Troca de cenário
              </h4>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Quem vai para o novo mapa? Os demais continuam no mapa atual dos
                jogadores.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                  onClick={() => setMoveTokenIds([])}
                >
                  Ninguém
                </button>
                <button
                  type="button"
                  className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                  onClick={() =>
                    setMoveTokenIds(board.tokens.map((token) => token.id))
                  }
                >
                  Todos
                </button>
                <button
                  type="button"
                  className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                  onClick={() =>
                    setMoveTokenIds(
                      board.tokens
                        .filter((token) => token.kind === "pc")
                        .map((token) => token.id)
                    )
                  }
                >
                  Só personagens
                </button>
              </div>

              {board.tokens.length === 0 ? (
                <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum token na mesa — o novo mapa ficará vazio.
                </p>
              ) : (
                <div className="space-y-1">
                  {board.tokens.map((token) => {
                    const checked = moveTokenIds.includes(token.id);
                    return (
                      <label
                        key={token.id}
                        className="flex cursor-pointer items-center gap-2 border px-2 py-1.5 text-sm"
                        style={{
                          ...fieldStyle,
                          borderColor: checked
                            ? "var(--color-crimson)"
                            : "var(--color-border)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setMoveTokenIds((prev) =>
                              checked
                                ? prev.filter((id) => id !== token.id)
                                : [...prev, token.id]
                            );
                          }}
                        />
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: token.color }}
                        />
                        <span className="min-w-0 flex-1 truncate text-[var(--color-ink)]">
                          {token.name}
                          <span className="text-[10px] text-[var(--color-ink-soft)]">
                            {token.kind === "pc" ? " · PC" : " · NPC"}
                            {token.onPlayerScene ? " · no mapa dos jogadores" : ""}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className="space-y-2 border-t p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-[11px] leading-snug text-[var(--color-ink-soft)]">
                {moveTokenIds.length === 0
                  ? "Nenhum token será movido. Jogadores ficam no mapa antigo com todos os tokens."
                  : moveTokenIds.length === board.tokens.length
                    ? "Todos os tokens vão para o novo mapa. Jogadores acompanham o cenário."
                    : `${moveTokenIds.length} token(s) no novo mapa; o restante fica no mapa dos jogadores.`}
              </p>
              <RibbonButton
                type="button"
                className="w-full"
                onClick={() => commitSceneChange(pendingScene, moveTokenIds)}
              >
                Confirmar troca
              </RibbonButton>
              <button
                type="button"
                className="w-full text-xs text-[var(--color-ink-soft)] underline"
                onClick={() => {
                  setPendingScene(null);
                  setMoveTokenIds([]);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
