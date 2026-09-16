import { useMemo, useState } from "react";
import type { BoardState, BoardToken, CampaignCharacterLite, CombatState } from "../../types/game";
import {
  DEFAULT_GRID_SIZE,
  DEFAULT_MAP_COLS,
  DEFAULT_MAP_ROWS,
  DEFAULT_METERS_PER_SQUARE,
  DEFAULT_VISION_RADIUS_SQUARES,
  loadMapImageSize,
  mapSquaresOf,
  metersPerSquareOf,
  playerIsOnFrozenScene,
  sizeCategoryToSpan,
  snapToGrid,
  snapshotPlayerMapView,
} from "../../types/game";
import type { PlayerMapView } from "../../types/game";
import { ABILITIES } from "../../data/dnd/abilities";
import { DND_SKILLS } from "../../data/dnd/skills";
import {
  getMonsterById,
  searchMonsters,
  type Monster,
} from "../../data/dnd/monsters";
import { monsterPortraitUrl } from "../../data/dnd/monsterPortrait";
import { hitPointsFromSheet } from "../../utils/characterCombat";
import { kilogramsToPounds } from "../../data/dnd/equipment";
import { grantCustomItem } from "../../services/character.service";
import type { BoardTool } from "./GameBoard";
import { RibbonButton } from "../icons/MedievalIcons";
import { PapirosMasterSection } from "./PapirosMasterSection";
import type { Papyrus } from "../../types/papiros";

/** Nome legível do mapa: preparado, arquivo da URL ou fallback curto. */
function mapDisplayName(
  url: string | undefined | null,
  preparedMaps?: Array<{ name: string; mapUrl: string }>
): string {
  if (!url?.trim()) return "Sem mapa";
  const prepared = preparedMaps?.find((entry) => entry.mapUrl === url);
  if (prepared?.name?.trim()) return prepared.name.trim();
  if (url.startsWith("data:")) return "Mapa (imagem)";
  try {
    const path = new URL(url, "https://local.invalid").pathname;
    const base = decodeURIComponent(path.split("/").filter(Boolean).pop() || "");
    if (base) {
      const withoutExt = base.replace(/\.[a-z0-9]+$/i, "");
      return withoutExt || base;
    }
  } catch {
    /* ignore */
  }
  return url.length > 36 ? `${url.slice(0, 33)}…` : url;
}

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
  combat?: CombatState | null;
  onRequestInitiative?: (payload: {
    targetCharacterId?: number | null;
  }) => void;
  onCombatAdd?: (payload: {
    name: string;
    initiative: number;
    kind?: "monster" | "other";
  }) => void;
  onCombatStart?: () => void;
  onCombatNext?: () => void;
  onCombatEnd?: () => void;
  onCloseSession?: () => void;
  onCharacterUpdated?: (character: CampaignCharacterLite) => void;
  onRest?: (kind: "short" | "long") => void | Promise<void>;
  restBusy?: boolean;
  placeOnSecretLayer: boolean;
  onPlaceOnSecretLayerChange: (enabled: boolean) => void;
  watchPlayerScene?: boolean;
  onWatchPlayerSceneChange?: (enabled: boolean) => void;
  campaignId?: number;
  onPreviewPapyrus?: (papyrus: Papyrus) => void;
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
type MasterTab = "mapa" | "visao" | "tokens" | "grupo" | "papiros";

const MASTER_TABS: Array<{ id: MasterTab; label: string; hint: string }> = [
  { id: "mapa", label: "Mapa", hint: "Imagem, tamanho e mapas salvos" },
  { id: "visao", label: "Visão", hint: "Escuridão e camadas" },
  { id: "tokens", label: "Tokens", hint: "NPCs e monstros" },
  { id: "grupo", label: "Grupo", hint: "Fichas, itens, testes e turnos" },
  { id: "papiros", label: "Papiros", hint: "Documentos e mercado" },
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
  combat,
  onRequestInitiative,
  onCombatAdd,
  onCombatStart,
  onCombatNext,
  onCombatEnd,
  onCloseSession,
  onCharacterUpdated,
  onRest,
  restBusy = false,
  placeOnSecretLayer,
  onPlaceOnSecretLayerChange,
  watchPlayerScene = false,
  onWatchPlayerSceneChange,
  campaignId,
  onPreviewPapyrus,
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
  const [preparedMapName, setPreparedMapName] = useState("");
  const [activeTab, setActiveTab] = useState<MasterTab>("mapa");
  const [pendingScene, setPendingScene] = useState<{
    mapUrl: string;
    mapWidth?: number;
    mapHeight?: number;
    gridSize?: number;
    metersPerSquare?: number;
    gridType?: "square" | "hex";
    widthDraft?: string;
    heightDraft?: string;
  } | null>(null);
  /** Jogadores que vão para o novo mapa (câmera + todos os tokens deles). */
  const [movePlayerIds, setMovePlayerIds] = useState<number[]>([]);
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
  const [initiativeTargetId, setInitiativeTargetId] = useState<string>("");
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
    gridType?: "square" | "hex";
    widthDraft?: string;
    heightDraft?: string;
  }) {
    if (next.mapUrl !== board.mapUrl) {
      // Padrão: levar todos os jogadores (câmera + tokens).
      setMovePlayerIds(fogPlayers.map((player) => player.userId));
      setPendingScene(next);
      return;
    }
    // Mesmo mapa: só atualiza tamanho/grade.
    onBoardChange({
      ...board,
      ...(next.mapWidth != null ? { mapWidth: next.mapWidth } : {}),
      ...(next.mapHeight != null ? { mapHeight: next.mapHeight } : {}),
      ...(next.gridSize != null ? { gridSize: next.gridSize } : {}),
      ...(next.metersPerSquare != null
        ? { metersPerSquare: next.metersPerSquare }
        : {}),
      ...(next.gridType != null ? { gridType: next.gridType } : {}),
    });
    setMapUrl(next.mapUrl);
    if (next.widthDraft != null) setMapWidthDraft(next.widthDraft);
    if (next.heightDraft != null) setMapHeightDraft(next.heightDraft);
  }

  function commitSceneChange(
    next: {
      mapUrl: string;
      mapWidth?: number;
      mapHeight?: number;
      gridSize?: number;
      metersPerSquare?: number;
      gridType?: "square" | "hex";
      widthDraft?: string;
      heightDraft?: string;
    },
    bringPlayerIds: number[]
  ) {
    const bring = new Set(bringPlayerIds.map(Number));
    const allPlayerIds = new Set(fogPlayers.map((player) => player.userId));
    for (const token of board.tokens) {
      if (token.kind === "pc" && token.ownerUserId != null) {
        allPlayerIds.add(Number(token.ownerUserId));
      }
    }

    const leavingIds = [...allPlayerIds].filter((id) => !bring.has(id));
    const leave = new Set(leavingIds);
    const movingEveryone =
      allPlayerIds.size === 0 || leavingIds.length === 0;
    const movingNobody = bring.size === 0;

    const leavingSnapshot = snapshotPlayerMapView(board);
    const prevViews = { ...(board.playerViewsByUserId ?? {}) };

    // O mestre sempre vai para o mapa clicado.
    const nextMapUrl = next.mapUrl;
    const nextMapWidth = next.mapWidth ?? board.mapWidth;
    const nextMapHeight = next.mapHeight ?? board.mapHeight;
    const nextGridSize = next.gridSize ?? board.gridSize;
    const nextMeters =
      next.metersPerSquare ?? metersPerSquareOf(board);
    const nextGridType = next.gridType ?? board.gridType;

    let nextViews: Record<string, PlayerMapView> = {};

    if (movingEveryone) {
      // Todos acompanham o mestre — sem mapa congelado.
      nextViews = {};
    } else if (movingNobody) {
      // Só o mestre muda; todos os jogadores ficam no cenário anterior.
      for (const userId of leavingIds) {
        const key = String(userId);
        nextViews[key] =
          prevViews[key] ??
          (board.playerMapView && Object.keys(prevViews).length === 0
            ? board.playerMapView
            : leavingSnapshot);
      }
    } else {
      // Parcial: escolhidos vão com o mestre; os demais ficam congelados.
      for (const userId of leavingIds) {
        const key = String(userId);
        nextViews[key] =
          prevViews[key] ??
          (board.playerMapView && Object.keys(prevViews).length === 0
            ? board.playerMapView
            : leavingSnapshot);
      }
      // Quem veio junto deixa de ter view congelada.
      for (const userId of bring) {
        delete nextViews[String(userId)];
      }
    }

    // Tokens dos jogadores que mudam de mapa são removidos (recolocam no novo).
    const tokens = board.tokens
      .filter((token) => {
        const owner =
          token.ownerUserId != null ? Number(token.ownerUserId) : null;
        if (owner != null && bring.has(owner)) return false;
        return true;
      })
      .map((token) => {
        const owner =
          token.ownerUserId != null ? Number(token.ownerUserId) : null;
        if (owner != null && leave.has(owner)) {
          return { ...token, onPlayerScene: true as const };
        }
        if (owner != null && nextViews[String(owner)]) {
          return { ...token, onPlayerScene: true as const };
        }
        return { ...token, onPlayerScene: undefined };
      });

    const hasFrozen = Object.keys(nextViews).length > 0;

    onBoardChange({
      ...board,
      mapUrl: nextMapUrl,
      ...(nextMapWidth != null ? { mapWidth: nextMapWidth } : {}),
      ...(nextMapHeight != null ? { mapHeight: nextMapHeight } : {}),
      ...(nextGridSize != null ? { gridSize: nextGridSize } : {}),
      metersPerSquare: nextMeters,
      ...(nextGridType != null ? { gridType: nextGridType } : {}),
      tokens,
      drawings: [],
      effects: [],
      rulers: [],
      playerMapView: hasFrozen
        ? Object.values(nextViews)[0] ?? leavingSnapshot
        : null,
      playerViewsByUserId: hasFrozen ? nextViews : {},
    });

    onWatchPlayerSceneChange?.(false);
    setMapUrl(next.mapUrl);
    if (next.widthDraft != null) setMapWidthDraft(next.widthDraft);
    if (next.heightDraft != null) setMapHeightDraft(next.heightDraft);
    setPendingScene(null);
    setMovePlayerIds([]);
  }

  function bringPlayersToCurrentScene() {
    onBoardChange({
      ...board,
      playerMapView: null,
      playerViewsByUserId: {},
      tokens: board.tokens.map((token) => ({
        ...token,
        onPlayerScene: undefined,
      })),
    });
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
    // UI pede kg; a ficha guarda peso em libras (padrão D&D).
    const weight =
      itemWeight.trim() !== "" && Number.isFinite(weightParsed) && weightParsed >= 0
        ? kilogramsToPounds(weightParsed)
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
      gridType: (board.gridType === "hex" ? "hex" : "square") as
        | "square"
        | "hex",
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
    gridType?: "square" | "hex";
  }) {
    const gridSize = entry.gridSize || board.gridSize || DEFAULT_GRID_SIZE;
    const meters =
      entry.metersPerSquare ??
      metersPerSquareOf(board) ??
      DEFAULT_METERS_PER_SQUARE;
    const gridType = entry.gridType ?? board.gridType ?? "square";
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
      gridType,
      widthDraft: String(squares.cols),
      heightDraft: String(squares.rows),
    });
  }

  function removePreparedMap(entry: { id: string; name: string }) {
    const ok = window.confirm(
      `Tem certeza que deseja remover o mapa "${entry.name}"?`
    );
    if (!ok) return;
    onBoardChange({
      ...board,
      preparedMaps: (board.preparedMaps ?? []).filter(
        (map) => map.id !== entry.id
      ),
    });
  }

  /** Mapas disponíveis no popup de troca (preparados + atual + destino pendente). */
  const sceneMapOptions = useMemo(() => {
    type SceneOption = {
      key: string;
      name: string;
      mapUrl: string;
      mapWidth?: number;
      mapHeight?: number;
      gridSize?: number;
      metersPerSquare?: number;
    };
    const options: SceneOption[] = [];
    const seen = new Set<string>();

    function push(option: SceneOption) {
      const url = option.mapUrl?.trim() ?? "";
      const key = url || `__empty__:${option.key}`;
      if (seen.has(key)) return;
      seen.add(key);
      options.push({ ...option, mapUrl: url, key });
    }

    for (const entry of board.preparedMaps ?? []) {
      push({
        key: entry.id,
        name: entry.name,
        mapUrl: entry.mapUrl,
        mapWidth: entry.mapWidth,
        mapHeight: entry.mapHeight,
        gridSize: entry.gridSize,
        metersPerSquare: entry.metersPerSquare,
      });
    }

    if (board.mapUrl?.trim()) {
      const squares = mapSquaresOf(board);
      push({
        key: "current",
        name: mapDisplayName(board.mapUrl, board.preparedMaps),
        mapUrl: board.mapUrl,
        mapWidth: squares.cols,
        mapHeight: squares.rows,
        gridSize: board.gridSize,
        metersPerSquare: metersPerSquareOf(board),
      });
    }

    if (pendingScene?.mapUrl?.trim()) {
      push({
        key: "pending",
        name: mapDisplayName(pendingScene.mapUrl, board.preparedMaps),
        mapUrl: pendingScene.mapUrl,
        mapWidth: pendingScene.mapWidth,
        mapHeight: pendingScene.mapHeight,
        gridSize: pendingScene.gridSize,
        metersPerSquare: pendingScene.metersPerSquare,
      });
    }

    return options;
  }, [board, pendingScene]);

  function teleportToSceneMap(option: {
    mapUrl: string;
    mapWidth?: number;
    mapHeight?: number;
    gridSize?: number;
    metersPerSquare?: number;
  }) {
    const gridSize = option.gridSize || board.gridSize || DEFAULT_GRID_SIZE;
    const meters =
      option.metersPerSquare ??
      metersPerSquareOf(board) ??
      DEFAULT_METERS_PER_SQUARE;
    const squares = mapSquaresOf({
      ...board,
      mapWidth: option.mapWidth,
      mapHeight: option.mapHeight,
      gridSize,
    });
    const next = {
      mapUrl: option.mapUrl,
      mapWidth: squares.cols,
      mapHeight: squares.rows,
      gridSize,
      metersPerSquare: meters,
      widthDraft: String(squares.cols),
      heightDraft: String(squares.rows),
    };
    // Mesmo URL do mapa ativo ainda pode mover jogadores / atualizar views.
    commitSceneChange(next, movePlayerIds);
  }

  const tools: Array<{ id: BoardTool; label: string }> = [
    { id: "select", label: "Mover" },
    { id: "party-move", label: "Grupo" },
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

        {Object.keys(board.playerViewsByUserId ?? {}).length > 0 ||
        board.playerMapView ? (
          <div
            className="mt-2 rounded border px-2 py-1.5"
            style={{
              borderColor: "var(--color-crimson)",
              backgroundColor:
                "color-mix(in srgb, var(--color-crimson) 12%, var(--color-parchment))",
            }}
          >
            <p className="text-[11px] leading-snug text-[var(--color-ink)]">
              {Object.keys(board.playerViewsByUserId ?? {}).length > 0
                ? `${Object.keys(board.playerViewsByUserId ?? {}).length} jogador(es) em outro cenário`
                : "Jogadores em outro cenário"}
              {board.tokens.some((t) => t.onPlayerScene)
                ? ` · ${board.tokens.filter((t) => t.onPlayerScene).length} token(s) lá`
                : ""}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() =>
                  onWatchPlayerSceneChange?.(!watchPlayerScene)
                }
                className="text-[11px] font-medium text-[var(--color-crimson)] underline"
              >
                {watchPlayerScene
                  ? "Voltar ao meu mapa"
                  : "Ver mapa dos jogadores"}
              </button>
              <button
                type="button"
                onClick={() => {
                  onWatchPlayerSceneChange?.(false);
                  bringPlayersToCurrentScene();
                }}
                className="text-[11px] font-medium text-[var(--color-crimson)] underline"
              >
                Trazer todos para este mapa
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <nav
        className="grid shrink-0 grid-cols-5 border-b"
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
              <label className="mb-2 block text-[10px] text-[var(--color-ink-soft)]">
                Formato do grid
                <select
                  value={board.gridType === "hex" ? "hex" : "square"}
                  onChange={(event) => {
                    const nextType =
                      event.target.value === "hex" ? "hex" : "square";
                    onBoardChange({
                      ...board,
                      gridType: nextType,
                      metersPerSquare:
                        nextType === "hex"
                          ? 10_000
                          : board.metersPerSquare === 10_000
                            ? 1.5
                            : board.metersPerSquare || 1.5,
                    });
                  }}
                  className="mt-0.5 w-full border px-1.5 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                >
                  <option value="square">Quadrado</option>
                  <option value="hex">Hexagonal</option>
                </select>
              </label>
              <p className="mb-2 text-[10px] leading-snug text-[var(--color-ink-soft)]">
                Hexágono: cada célula = 10 km na régua.
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
                    <div
                      key={entry.id}
                      className="flex min-w-0 items-stretch border"
                      style={fieldStyle}
                    >
                      <button
                        type="button"
                        onClick={() => usePreparedMap(entry)}
                        className="min-w-0 flex-1 truncate px-2 py-2 text-left text-xs text-[var(--color-ink)]"
                        title={`Usar ${entry.name}`}
                      >
                        {entry.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePreparedMap(entry)}
                        className="shrink-0 px-2 text-sm leading-none text-[var(--color-ink-soft)] hover:text-[var(--color-crimson)]"
                        title={`Remover ${entry.name}`}
                        aria-label={`Remover mapa ${entry.name}`}
                      >
                        ×
                      </button>
                    </div>
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
              <p className="mb-2 text-[10px] text-[var(--color-ink-soft)]">
                Arraste a ficha para o mapa para criar o token (ou clique para
                abrir).
              </p>
              {characters.length === 0 && masterCharacters.length === 0 ? (
                <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum personagem disponível.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    ...characters,
                    ...masterCharacters.filter(
                      (mine) =>
                        !characters.some((character) => character.id === mine.id)
                    ),
                  ].map((character) => (
                    <div
                      key={character.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          "application/x-rpg-character",
                          String(character.id)
                        );
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenSheet(character)}
                        className="w-full border px-2.5 py-2 text-left"
                        style={fieldStyle}
                      >
                        <span className="block truncate text-sm text-[var(--color-ink)]">
                          {character.name}
                        </span>
                        <span className="block truncate text-[10px] text-[var(--color-ink-soft)]">
                          {character.className} · Nv. {character.level}
                          {character.player?.name
                            ? ` · ${character.player.name}`
                            : " · sua ficha"}
                        </span>
                      </button>
                    </div>
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
                className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Descanso
              </h4>
              <p className="mb-2 text-[10px] text-[var(--color-ink-soft)]">
                Recupera recursos de todos os personagens da mesa (ki, fúrias,
                espaços de magia etc.), conforme descanso curto ou longo.
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <RibbonButton
                  type="button"
                  className="w-full"
                  disabled={restBusy || !onRest}
                  onClick={() => void onRest?.("short")}
                >
                  {restBusy ? "…" : "Descanso curto"}
                </RibbonButton>
                <RibbonButton
                  type="button"
                  className="w-full"
                  disabled={restBusy || !onRest}
                  onClick={() => void onRest?.("long")}
                >
                  {restBusy ? "…" : "Descanso longo"}
                </RibbonButton>
              </div>
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
                Relógio de turnos
              </h4>
              <p className="mb-2 text-[10px] text-[var(--color-ink-soft)]">
                Peça iniciativa aos jogadores e depois inicie o relógio. Só o
                mestre pula a vez.
              </p>
              <select
                value={initiativeTargetId}
                onChange={(event) => setInitiativeTargetId(event.target.value)}
                className="mb-2 w-full border px-1.5 py-1.5 text-sm"
                style={fieldStyle}
              >
                <option value="">Todos os personagens</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
              <RibbonButton
                type="button"
                className="mb-2 w-full"
                onClick={() =>
                  onRequestInitiative?.({
                    targetCharacterId: initiativeTargetId
                      ? Number(initiativeTargetId)
                      : null,
                  })
                }
              >
                Pedir iniciativa
              </RibbonButton>

              {combat && combat.order.length > 0 ? (
                <ul className="mb-2 max-h-28 space-y-0.5 overflow-y-auto text-[11px] text-[var(--color-ink-muted)]">
                  {combat.order.map((entry, index) => (
                    <li key={entry.id} className="flex justify-between gap-2">
                      <span
                        className={
                          combat.active && index === combat.currentIndex
                            ? "font-semibold text-[var(--color-crimson)]"
                            : ""
                        }
                      >
                        {entry.name}
                      </span>
                      <span>
                        {entry.initiative}
                        {entry.natural === 20
                          ? " · 20!"
                          : entry.natural === 1
                            ? " · 1"
                            : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex flex-col gap-1.5">
                {!combat?.active && (combat?.order.length ?? 0) > 0 ? (
                  <RibbonButton type="button" className="w-full" onClick={onCombatStart}>
                    Iniciar relógio
                  </RibbonButton>
                ) : null}
                {combat?.active ? (
                  <RibbonButton type="button" className="w-full" onClick={onCombatNext}>
                    Próximo turno
                  </RibbonButton>
                ) : null}
                {combat ? (
                  <button
                    type="button"
                    className="w-full border px-2 py-1.5 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-danger)]"
                    style={fieldStyle}
                    onClick={onCombatEnd}
                  >
                    Encerrar combate
                  </button>
                ) : null}
              </div>
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

        {activeTab === "papiros" && campaignId != null && (
          <PapirosMasterSection
            campaignId={campaignId}
            characters={characters}
            onCharacterUpdated={onCharacterUpdated}
            onPreviewPapyrus={onPreviewPapyrus}
          />
        )}
        {activeTab === "papiros" && campaignId == null && (
          <p className="text-xs text-[var(--color-ink-soft)]">
            Campanha inválida para papiros.
          </p>
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
              setMovePlayerIds([]);
            }
          }}
        >
          <div
            className="flex max-h-[min(90vh,44rem)] w-full max-w-2xl flex-col border-2 shadow-xl"
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
                Escolha os jogadores e clique no mapa de destino para teleportar.
                Tokens dos que mudam são removidos.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">
                Mapas — clique para ir
              </p>
              {sceneMapOptions.length === 0 ? (
                <p className="mb-4 text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum mapa disponível. Salve mapas preparados ou aplique uma
                  imagem.
                </p>
              ) : (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {sceneMapOptions.map((option) => {
                    const isCurrent =
                      (option.mapUrl || "") === (board.mapUrl || "");
                    const isTarget =
                      Boolean(pendingScene) &&
                      (option.mapUrl || "") === (pendingScene?.mapUrl || "");
                    return (
                      <button
                        key={option.key}
                        type="button"
                        className="overflow-hidden border text-left transition hover:opacity-95"
                        style={{
                          borderColor: isTarget
                            ? "var(--color-crimson)"
                            : isCurrent
                              ? "var(--color-border)"
                              : "var(--color-border-subtle)",
                          boxShadow: isTarget
                            ? "0 0 0 1px var(--color-crimson)"
                            : undefined,
                          backgroundColor: "var(--color-panel)",
                        }}
                        title={
                          isCurrent
                            ? "Mapa atual"
                            : `Ir para ${option.name}`
                        }
                        onClick={() => teleportToSceneMap(option)}
                      >
                        <div
                          className="overflow-hidden"
                          style={{ aspectRatio: "16 / 10" }}
                        >
                          {option.mapUrl ? (
                            <img
                              src={option.mapUrl}
                              alt={option.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-[var(--color-ink-soft)]">
                              Sem imagem
                            </div>
                          )}
                        </div>
                        <div className="border-t px-2 py-1.5" style={{ borderColor: "var(--color-border-subtle)" }}>
                          <p className="truncate text-[11px] text-[var(--color-ink)]">
                            {option.name}
                          </p>
                          <p className="text-[10px] text-[var(--color-ink-soft)]">
                            {isCurrent ? "Atual" : "Clique para ir"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">
                Jogadores que mudam de mapa:
              </p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                  onClick={() => setMovePlayerIds([])}
                >
                  Ninguém
                </button>
                <button
                  type="button"
                  className="border px-2 py-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={fieldStyle}
                  onClick={() =>
                    setMovePlayerIds(fogPlayers.map((player) => player.userId))
                  }
                >
                  Todos
                </button>
              </div>

              {fogPlayers.length === 0 ? (
                <p className="text-[11px] italic text-[var(--color-ink-soft)]">
                  Nenhum jogador na campanha — só o mestre muda de mapa.
                </p>
              ) : (
                <div className="space-y-1">
                  {fogPlayers.map((player) => {
                    const checked = movePlayerIds.includes(player.userId);
                    const playerTokens = board.tokens.filter(
                      (token) =>
                        Number(token.ownerUserId) === Number(player.userId)
                    );
                    const frozen = playerIsOnFrozenScene(board, player.userId);
                    const mapUrl = frozen
                      ? board.playerViewsByUserId?.[String(player.userId)]
                          ?.mapUrl ?? board.playerMapView?.mapUrl ?? board.mapUrl
                      : board.mapUrl;
                    return (
                      <label
                        key={player.userId}
                        className="flex cursor-pointer items-start gap-2 border px-2 py-1.5 text-sm"
                        style={{
                          ...fieldStyle,
                          borderColor: checked
                            ? "var(--color-crimson)"
                            : "var(--color-border)",
                        }}
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={checked}
                          onChange={() => {
                            setMovePlayerIds((prev) =>
                              checked
                                ? prev.filter((id) => id !== player.userId)
                                : [...prev, player.userId]
                            );
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[var(--color-ink)]">
                            {player.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] leading-snug text-[var(--color-ink-muted)]">
                            {playerTokens.length} token(s)
                            {playerTokens.length > 0
                              ? `: ${playerTokens.map((t) => t.name).join(", ")}`
                              : ""}
                            <br />
                            Mapa atual:{" "}
                            {mapDisplayName(mapUrl, board.preparedMaps)}
                            {frozen ? " · congelado" : ""}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {board.tokens.some((token) => token.kind === "npc") ? (
                <p className="mt-3 text-[11px] leading-snug text-[var(--color-ink-soft)]">
                  NPCs acompanham o mestre no novo mapa.
                </p>
              ) : null}
            </div>

            <div
              className="space-y-2 border-t p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-[11px] leading-snug text-[var(--color-ink-soft)]">
                {movePlayerIds.length === 0
                  ? "Só o mestre vai para o mapa clicado. Jogadores ficam onde estão (com tokens)."
                  : movePlayerIds.length === fogPlayers.length
                    ? "Mestre e todos os jogadores vão ao mapa clicado. Tokens dos jogadores são removidos."
                    : "Mestre vai ao mapa clicado com o(s) jogador(es) marcado(s). Os demais ficam no cenário anterior."}
              </p>
              <button
                type="button"
                className="w-full text-xs text-[var(--color-ink-soft)] underline"
                onClick={() => {
                  setPendingScene(null);
                  setMovePlayerIds([]);
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
