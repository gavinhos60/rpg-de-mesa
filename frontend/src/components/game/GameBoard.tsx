import { useEffect, useMemo, useRef, useState } from "react";
import type {
  BoardEffect,
  BoardState,
  BoardToken,
  MeasureShape,
} from "../../types/game";
import {
  distanceSquares5e,
  formatMeasureLabel,
  formatMeters,
  boardMapForViewer,
  gridTypeOf,
  isTokenVisibleThroughFog,
  lightSourcesForViewer,
  loadMapImageSize,
  metersPerSquareOf,
  snapToCellCenter,
  snapToCellCorner,
  snapToGrid,
  tokenFootprintPx,
  tokensForViewer,
  viewerIgnoresFog,
  withAnnotationsOnViewerScene,
  worldSizeOf,
} from "../../types/game";
import {
  distanceHexes,
  hexCentersInBounds,
  hexPolygonPoints,
  snapToHexCenter,
  snapTokenToHex,
} from "../../utils/hexGrid";
import {
  DND_CONDITIONS,
  getCondition,
  isConditionId,
  type ConditionId,
} from "../../data/dnd/conditions";
import { FogLightOverlay } from "./FogLightOverlay";
import { ConditionIcon } from "./ConditionIcon";
import {
  DEFAULT_MEASURE_SETTINGS,
  MeasurePanel,
  type MeasureSettings,
} from "./MeasurePanel";
import { EffectPanel } from "./EffectPanel";
import {
  EffectHitAreas,
  EffectParticleLayer,
} from "./EffectParticleLayer";
import {
  DEFAULT_EFFECT_SETTINGS,
  FX_INSTANT_MS,
  fxElementColor,
  fxElementLabel,
  fxKindLabel,
  fxKindNeedsDrag,
  fxKindScalesWithDrag,
  type EffectSettings,
} from "./effectPing";

export type BoardTool = "select" | "draw" | "ruler" | "effect" | "party-move";

/** Visual de medição próximo ao Roll20. */
const DEFAULT_MEASURE_COLOR = "#3DDCFF";

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return `rgba(61, 220, 255, ${alpha})`;
  }
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function measureColors(color?: string) {
  const stroke = color || DEFAULT_MEASURE_COLOR;
  return {
    stroke,
    fill: hexToRgba(stroke, 0.18),
    labelBg: "rgba(12, 28, 40, 0.88)",
  };
}

interface GameBoardProps {
  board: BoardState;
  tool: BoardTool;
  canAnnotate: boolean;
  currentUserId: number;
  isMaster: boolean;
  /** Movimento ao vivo (sem snap) — fluido. */
  onMoveToken: (
    tokenId: string,
    x: number,
    y: number,
    options?: { commit?: boolean }
  ) => void;
  onMoveTokens?: (
    moves: Array<{ tokenId: string; x: number; y: number }>,
    options?: { commit?: boolean }
  ) => void;
  onChangeBoard: (board: BoardState) => void;
  onRuler: (
    from: { x: number; y: number },
    to: { x: number; y: number },
    options?: {
      sticky?: boolean;
      clear?: boolean;
      clearAll?: boolean;
      broadcast?: boolean;
      shape?: MeasureShape;
      color?: string;
    }
  ) => void;
  onEffectPing?: (payload: {
    sticky: boolean;
    broadcast: boolean;
    effect: Omit<BoardEffect, "id" | "byUserId"> & { id?: string };
  }) => void;
  /** Pings instantâneos recebidos via socket (não persistidos). */
  transientEffects?: BoardEffect[];
  onSelectToken?: (token: BoardToken | null) => void;
  onOpenMonsterSheet?: (token: BoardToken) => void;
  onOpenCharacterSheet?: (token: BoardToken) => void;
  onDropCharacter?: (characterId: number, x: number, y: number) => void;
  /** Mestre coloca novos desenhos/efeitos/NPCs na camada secreta. */
  placeOnSecretLayer?: boolean;
  /** Mestre inspeciona o mapa congelado dos jogadores. */
  watchPlayerScene?: boolean;
  /** Incrementa para limpar marcações locais (não transmitidas). */
  localAnnotationResetKey?: number;
  /** Remoção explícita (socket token:remove) — evita race no board:update. */
  onRemoveTokens?: (tokenIds: string[]) => void;
  /** Mestre: rolar iniciativa dos tokens selecionados (NPCs e fichas) e colocar no relógio. */
  onRollTokenInitiative?: (tokens: BoardToken[]) => void;
  /** Destaca tokens no mapa (ex.: hover na régua de iniciativa) sem selecionar. */
  highlightedTokenIds?: string[];
  /** Ref compartilhado: ids em arraste (GameRoom ignora ecos remotos). */
  draggingTokenIdsRef?: React.MutableRefObject<Set<string>>;
}

function applyMeasureSnap(
  point: { x: number; y: number },
  gridSize: number,
  snap: MeasureSettings["snap"],
  hex = false
) {
  if (snap === "none") return point;
  if (hex) return snapToHexCenter(point.x, point.y, gridSize);
  if (snap === "center") return snapToCellCenter(point.x, point.y, gridSize);
  if (snap === "corner") return snapToCellCorner(point.x, point.y, gridSize);
  return point;
}

function conePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  angleDeg = 53
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const len = Math.max(1, Math.hypot(to.x - from.x, to.y - from.y));
  const half = ((angleDeg * Math.PI) / 180) / 2;
  const x1 = from.x + Math.cos(angle - half) * len;
  const y1 = from.y + Math.sin(angle - half) * len;
  const x2 = from.x + Math.cos(angle + half) * len;
  const y2 = from.y + Math.sin(angle + half) * len;
  return `M ${from.x} ${from.y} L ${x1} ${y1} L ${x2} ${y2} Z`;
}

function beamPolygon(
  from: { x: number; y: number },
  to: { x: number; y: number },
  width: number
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = (-dy / len) * (width / 2);
  const ny = (dx / len) * (width / 2);
  return [
    `${from.x + nx},${from.y + ny}`,
    `${to.x + nx},${to.y + ny}`,
    `${to.x - nx},${to.y - ny}`,
    `${from.x - nx},${from.y - ny}`,
  ].join(" ");
}

function MeasureShapeGraphic({
  shape,
  from,
  to,
  gridSize,
  label,
  byUserName,
  color,
  selected = false,
  interactive = false,
  onSelect,
}: {
  shape: MeasureShape;
  from: { x: number; y: number };
  to: { x: number; y: number };
  gridSize: number;
  label: string;
  byUserName?: string;
  color?: string;
  selected?: boolean;
  interactive?: boolean;
  onSelect?: () => void;
}) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const radius = Math.hypot(to.x - from.x, to.y - from.y);
  const badgeText = byUserName ? `${byUserName}: ${label}` : label;
  const palette = measureColors(color);
  const stroke = selected ? "#C09A5A" : palette.stroke;
  const strokeWidth = selected ? 4 : 2.5;

  function handlePointerDown(event: React.PointerEvent) {
    if (!interactive || !onSelect) return;
    event.stopPropagation();
    onSelect();
  }

  const hitProps = interactive
    ? {
        style: { cursor: "pointer" as const },
        onPointerDown: handlePointerDown,
      }
    : {};

  if (shape === "square") {
    const x = Math.min(from.x, to.x);
    const y = Math.min(from.y, to.y);
    const w = Math.max(4, Math.abs(to.x - from.x));
    const h = Math.max(4, Math.abs(to.y - from.y));
    return (
      <g className={interactive ? undefined : "pointer-events-none"}>
        {interactive ? (
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill="transparent"
            stroke="transparent"
            strokeWidth={14}
            {...hitProps}
          />
        ) : null}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={palette.fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={interactive ? "pointer-events-none" : undefined}
        />
        <MeasureBadge
          x={x + w / 2}
          y={y - 14}
          text={badgeText}
          color={stroke}
        />
      </g>
    );
  }

  if (shape === "circle") {
    return (
      <g className={interactive ? undefined : "pointer-events-none"}>
        {interactive ? (
          <circle
            cx={from.x}
            cy={from.y}
            r={Math.max(4, radius)}
            fill="transparent"
            stroke="transparent"
            strokeWidth={14}
            {...hitProps}
          />
        ) : null}
        <circle
          cx={from.x}
          cy={from.y}
          r={Math.max(4, radius)}
          fill={palette.fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={interactive ? "pointer-events-none" : undefined}
        />
        <circle
          cx={from.x}
          cy={from.y}
          r={3.5}
          fill={stroke}
          stroke="#FFFFFF"
          strokeWidth={1.5}
          className="pointer-events-none"
        />
        <MeasureBadge
          x={from.x}
          y={from.y - Math.max(4, radius) - 14}
          text={badgeText}
          color={stroke}
        />
      </g>
    );
  }

  if (shape === "cone") {
    return (
      <g className={interactive ? undefined : "pointer-events-none"}>
        {interactive ? (
          <path
            d={conePath(from, to)}
            fill="transparent"
            stroke="transparent"
            strokeWidth={14}
            {...hitProps}
          />
        ) : null}
        <path
          d={conePath(from, to)}
          fill={palette.fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className={interactive ? "pointer-events-none" : undefined}
        />
        <MeasureBadge
          x={midX}
          y={midY - 16}
          text={badgeText}
          color={stroke}
        />
      </g>
    );
  }

  if (shape === "beam") {
    return (
      <g className={interactive ? undefined : "pointer-events-none"}>
        {interactive ? (
          <polygon
            points={beamPolygon(from, to, gridSize)}
            fill="transparent"
            stroke="transparent"
            strokeWidth={14}
            {...hitProps}
          />
        ) : null}
        <polygon
          points={beamPolygon(from, to, gridSize)}
          fill={palette.fill}
          stroke={stroke}
          strokeWidth={selected ? 3.5 : 2}
          className={interactive ? "pointer-events-none" : undefined}
        />
        <MeasureBadge
          x={midX}
          y={midY - 16}
          text={badgeText}
          color={stroke}
        />
      </g>
    );
  }

  return (
    <g className={interactive ? undefined : "pointer-events-none"}>
      {interactive ? (
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="transparent"
          strokeWidth={16}
          strokeLinecap="round"
          {...hitProps}
        />
      ) : null}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={stroke}
        strokeWidth={selected ? 4.5 : 3}
        strokeLinecap="round"
        className={interactive ? "pointer-events-none" : undefined}
      />
      <circle
        cx={from.x}
        cy={from.y}
        r={5}
        fill="#FFFFFF"
        stroke={stroke}
        strokeWidth={2}
        className="pointer-events-none"
      />
      <circle
        cx={to.x}
        cy={to.y}
        r={5}
        fill="#FFFFFF"
        stroke={stroke}
        strokeWidth={2}
        className="pointer-events-none"
      />
      <MeasureBadge
        x={midX}
        y={midY - 16}
        text={badgeText}
        color={stroke}
      />
    </g>
  );
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function MeasureBadge({
  x,
  y,
  text,
  color,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
}) {
  if (!text) return null;
  const width = Math.max(72, text.length * 6.6 + 16);
  const height = 22;
  const stroke = color || DEFAULT_MEASURE_COLOR;
  return (
    <g className="pointer-events-none">
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill="rgba(12, 28, 40, 0.9)"
        stroke={stroke}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 4}
        fill="#F2FBFF"
        fontSize="11"
        fontWeight={600}
        textAnchor="middle"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      >
        {text}
      </text>
    </g>
  );
}

function isTokenDead(token: BoardToken) {
  return typeof token.hpCurrent === "number" && token.hpCurrent <= 0;
}

function parseHpDraft(raw: string | undefined, fallback: number | undefined) {
  if (raw != null && /^\d+$/.test(raw.trim())) return Number(raw.trim());
  if (typeof fallback === "number") return fallback;
  return null;
}

function rectsOverlap(
  a: { x1: number; y1: number; x2: number; y2: number },
  b: { x: number; y: number; w: number; h: number }
) {
  const left = Math.min(a.x1, a.x2);
  const right = Math.max(a.x1, a.x2);
  const top = Math.min(a.y1, a.y2);
  const bottom = Math.max(a.y1, a.y2);
  return !(
    b.x + b.w < left ||
    b.x > right ||
    b.y + b.h < top ||
    b.y > bottom
  );
}

/** Escala absoluta mundo→tela (1 = 100% = 1 px do mapa por px da tela), como no Roll20. */
const MIN_SCALE = 0.05;
const MAX_SCALE = 2.5;
const ZOOM_FACTOR = 1.12;

export function GameBoard({
  board,
  tool,
  canAnnotate,
  currentUserId,
  isMaster,
  onMoveToken,
  onMoveTokens,
  onChangeBoard,
  onRuler,
  onEffectPing,
  transientEffects = [],
  onSelectToken,
  onOpenMonsterSheet,
  onOpenCharacterSheet,
  onDropCharacter,
  placeOnSecretLayer = false,
  watchPlayerScene = false,
  localAnnotationResetKey = 0,
  onRemoveTokens,
  onRollTokenInitiative,
  highlightedTokenIds = [],
  draggingTokenIdsRef,
}: GameBoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<{
    kind: "drawing" | "effect" | "ruler" | "local-measure";
    id: string;
  } | null>(null);
  const [conditionMenuOpen, setConditionMenuOpen] = useState(false);
  const [tokenLayerMenu, setTokenLayerMenu] = useState<{
    tokenId: string;
    x: number;
    y: number;
  } | null>(null);
  const [dragTokenIds, setDragTokenIds] = useState<string[]>([]);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragStarts, setDragStarts] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [marquee, setMarquee] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [drawPoints, setDrawPoints] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [rulerStart, setRulerStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [rulerPreview, setRulerPreview] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [measureSettings, setMeasureSettings] = useState<MeasureSettings>(
    DEFAULT_MEASURE_SETTINGS
  );
  const [measurePanelCollapsed, setMeasurePanelCollapsed] = useState(false);
  const [effectSettings, setEffectSettings] = useState<EffectSettings>(
    DEFAULT_EFFECT_SETTINGS
  );
  const [effectPanelCollapsed, setEffectPanelCollapsed] = useState(false);
  const [effectStart, setEffectStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [effectPreview, setEffectPreview] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [localStickyEffects, setLocalStickyEffects] = useState<BoardEffect[]>(
    []
  );
  const [localStickyMeasures, setLocalStickyMeasures] = useState<
    Array<{
      id: string;
      shape: MeasureShape;
      from: { x: number; y: number };
      to: { x: number; y: number };
      color: string;
    }>
  >([]);

  useEffect(() => {
    if (localAnnotationResetKey > 0) {
      setLocalStickyMeasures([]);
      setLocalStickyEffects([]);
    }
  }, [localAnnotationResetKey]);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ w: 1, h: 1 });
  const [fieldDrafts, setFieldDrafts] = useState<Record<string, string>>({});
  const [isPanning, setIsPanning] = useState(false);
  const hpCommitLockRef = useRef<Set<string>>(new Set());
  const panOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const lastEmitRef = useRef(0);
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  /** Enquanto true, redimensionar viewport/mapa reencaixa (zoom = fit). */
  const followFitRef = useRef(true);
  const liveDragRef = useRef<Record<string, { x: number; y: number }>>({});
  const probedMapRef = useRef<string | null>(null);
  scaleRef.current = scale;
  panRef.current = pan;

  const mapBoard = useMemo(
    () =>
      boardMapForViewer(board, isMaster, {
        watchPlayerScene,
        currentUserId,
      }),
    [board, isMaster, watchPlayerScene, currentUserId]
  );
  const viewTokens = useMemo(
    () =>
      tokensForViewer(board, isMaster, {
        watchPlayerScene,
        currentUserId,
      }),
    [board, isMaster, watchPlayerScene, currentUserId]
  );
  const sceneBoard = useMemo(
    () => ({ ...mapBoard, tokens: viewTokens }),
    [mapBoard, viewTokens]
  );
  const gridSize = mapBoard.gridSize || 50;
  const gridType = gridTypeOf(mapBoard);
  const isHex = gridType === "hex";
  const mPerSquare = metersPerSquareOf(mapBoard);
  const world = worldSizeOf(mapBoard);
  const hexCells = useMemo(
    () =>
      isHex ? hexCentersInBounds(world.width, world.height, gridSize) : [],
    [isHex, world.width, world.height, gridSize]
  );

  function snapBoardPoint(x: number, y: number, footprintPx = gridSize) {
    if (isHex) {
      return snapTokenToHex(x, y, footprintPx, gridSize);
    }
    return { x: snapToGrid(x, gridSize), y: snapToGrid(y, gridSize) };
  }

  function measureCells(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    if (isHex) return distanceHexes(from, to, gridSize);
    return distanceSquares5e(from, to, gridSize);
  }

  function measureLabel(cells: number) {
    return formatMeasureLabel(cells, mPerSquare, { hex: isHex });
  }
  const fitScale = Math.min(
    viewportSize.w / Math.max(1, world.width),
    viewportSize.h / Math.max(1, world.height)
  );
  const displayScale = scale;
  const minScale = Math.min(MIN_SCALE, fitScale * 0.85);
  const fogViewer = useMemo(
    () => ({ isMaster, currentUserId }),
    [isMaster, currentUserId]
  );
  const ignoresFog = viewerIgnoresFog(board, fogViewer);
  const showFog = Boolean(board.fogEnabled) && !ignoresFog;
  const lightSources = useMemo(
    () => (showFog ? lightSourcesForViewer(sceneBoard, fogViewer) : []),
    [sceneBoard, fogViewer, showFog]
  );
  const fogBounds = useMemo(() => {
    let maxX = world.width;
    let maxY = world.height;
    for (const token of viewTokens) {
      const size = tokenFootprintPx(token, gridSize);
      maxX = Math.max(maxX, token.x + size + gridSize * 10);
      maxY = Math.max(maxY, token.y + size + gridSize * 10);
    }
    for (const light of lightSources) {
      maxX = Math.max(maxX, light.x + light.radiusPx + gridSize);
      maxY = Math.max(maxY, light.y + light.radiusPx + gridSize);
    }
    return {
      width: Math.ceil(maxX),
      height: Math.ceil(maxY),
    };
  }, [viewTokens, gridSize, lightSources, world.width, world.height]);
  const selectedToken =
    selectedIds.length === 1
      ? viewTokens.find((token) => token.id === selectedIds[0]) ?? null
      : null;

  function localPoint(event: { clientX: number; clientY: number }) {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const s = scaleRef.current;
    const p = panRef.current;
    return {
      x: (event.clientX - rect.left - p.x) / s,
      y: (event.clientY - rect.top - p.y) / s,
    };
  }

  function centerPanForScale(nextScale: number) {
    setPan({
      x: (viewportSize.w - world.width * nextScale) / 2,
      y: (viewportSize.h - world.height * nextScale) / 2,
    });
  }

  function fitToViewport() {
    followFitRef.current = true;
    setScale(fitScale);
    centerPanForScale(fitScale);
  }

  function canDragToken(token: BoardToken) {
    return (
      isMaster || Number(token.ownerUserId) === Number(currentUserId)
    );
  }

  function setSelection(ids: string[]) {
    setSelectedIds(ids);
    setSelectedAnnotation(null);
    setConditionMenuOpen(false);
    const first =
      ids.length === 1
        ? board.tokens.find((token) => token.id === ids[0]) ?? null
        : null;
    onSelectToken?.(first);
  }

  function canEditTokenFields(token: BoardToken) {
    return (
      isMaster ||
      Number(token.ownerUserId) === Number(currentUserId)
    );
  }

  /** Mestre vê todos os números; jogador só os do próprio personagem. */
  function canSeeTokenHpNumbers(token: BoardToken) {
    if (isMaster) return true;
    return Number(token.ownerUserId) === Number(currentUserId);
  }

  function isNpcToken(token: BoardToken) {
    return Boolean(token.monsterId) || !token.characterId;
  }

  /** Token que pode entrar no relógio (ficha ou NPC). */
  function canRollInitiative(token: BoardToken) {
    return Boolean(token.characterId) || isNpcToken(token);
  }

  function initiativeTokensFromIds(ids: string[]) {
    return board.tokens.filter(
      (token) => ids.includes(token.id) && canRollInitiative(token)
    );
  }

  function rollInitiativeForTokens(tokens: BoardToken[]) {
    if (!isMaster || !onRollTokenInitiative) return;
    const targets = tokens.filter(canRollInitiative);
    if (targets.length === 0) return;
    onRollTokenInitiative(targets);
    setTokenLayerMenu(null);
  }

  function canDeleteAnnotation(byUserId?: number) {
    return isMaster || Number(byUserId) === Number(currentUserId);
  }

  function updateTokenFields(
    tokenId: string,
    patch: Partial<
      Pick<
        BoardToken,
        "hpMax" | "hpCurrent" | "customValue" | "conditions" | "borderColor"
      >
    >
  ) {
    const token = board.tokens.find((item) => item.id === tokenId);
    if (!token || !canEditTokenFields(token)) return;
    onChangeBoard({
      ...board,
      tokens: board.tokens.map((item) =>
        item.id === tokenId ? { ...item, ...patch } : item
      ),
    });
  }

  /** Aplica PV absoluto ou relativo (+20 / -20) a partir do texto do input. */
  function commitTokenHpField(
    tokenId: string,
    field: "hpMax" | "hpCurrent",
    rawInput: string
  ) {
    const draftKey = `${tokenId}:${field}`;
    if (hpCommitLockRef.current.has(draftKey)) return;
    hpCommitLockRef.current.add(draftKey);
    queueMicrotask(() => hpCommitLockRef.current.delete(draftKey));

    setFieldDrafts((prev) => {
      if (!(draftKey in prev)) return prev;
      const next = { ...prev };
      delete next[draftKey];
      return next;
    });
    const live = board.tokens.find((item) => item.id === tokenId);
    if (!live || !canEditTokenFields(live)) return;
    const raw = rawInput.trim();
    if (raw === "") {
      updateTokenFields(tokenId, { [field]: undefined } as Partial<BoardToken>);
      return;
    }
    if (/^[+-]\d+$/.test(raw)) {
      const base =
        field === "hpCurrent"
          ? (live.hpCurrent ?? live.hpMax ?? 0)
          : (live.hpMax ?? 0);
      updateTokenFields(tokenId, {
        [field]: Math.max(0, base + Number(raw)),
      } as Partial<BoardToken>);
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    updateTokenFields(tokenId, {
      [field]: Math.max(0, num),
    } as Partial<BoardToken>);
  }

  function setTokenLayer(tokenId: string, secret: boolean) {
    if (!isMaster) return;
    onChangeBoard({
      ...board,
      tokens: board.tokens.map((item) =>
        item.id === tokenId
          ? { ...item, secret: secret ? true : undefined }
          : item
      ),
    });
    setTokenLayerMenu(null);
  }

  function toggleTokenCondition(token: BoardToken, conditionId: ConditionId) {
    if (!canEditTokenFields(token)) return;
    const current = token.conditions ?? [];
    const next = current.includes(conditionId)
      ? current.filter((id) => id !== conditionId)
      : [...current, conditionId];
    updateTokenFields(token.id, { conditions: next });
  }

  function deleteSelected() {
    if (selectedAnnotation) {
      const { kind, id } = selectedAnnotation;
      if (kind === "drawing") {
        const drawing = mapBoard.drawings.find((item) => item.id === id);
        if (!drawing || !canDeleteAnnotation(drawing.byUserId)) return;
        onChangeBoard(
          withAnnotationsOnViewerScene(board, currentUserId, {
            drawings: mapBoard.drawings.filter((item) => item.id !== id),
          })
        );
      } else if (kind === "effect") {
        if (localStickyEffects.some((item) => item.id === id)) {
          setLocalStickyEffects((prev) => prev.filter((item) => item.id !== id));
        } else {
          const effect = mapBoard.effects.find((item) => item.id === id);
          if (!effect || !canDeleteAnnotation(effect.byUserId)) return;
          onChangeBoard(
            withAnnotationsOnViewerScene(board, currentUserId, {
              effects: mapBoard.effects.filter((item) => item.id !== id),
            })
          );
        }
      } else if (kind === "ruler") {
        const ruler = mapBoard.rulers.find((item) => item.id === id);
        if (!ruler || !canDeleteAnnotation(ruler.byUserId)) return;
        onChangeBoard(
          withAnnotationsOnViewerScene(board, currentUserId, {
            rulers: mapBoard.rulers.filter((item) => item.id !== id),
          })
        );
      } else if (kind === "local-measure") {
        setLocalStickyMeasures((prev) =>
          prev.filter((item) => item.id !== id)
        );
      }
      setSelectedAnnotation(null);
      return;
    }

    if (selectedIds.length === 0) return;
    const removable = viewTokens.filter((token) => {
      if (!selectedIds.includes(token.id)) return false;
      return (
        isMaster ||
        Number(token.ownerUserId) === Number(currentUserId)
      );
    });
    if (removable.length === 0) return;
    const removeIds = removable.map((token) => token.id);
    if (onRemoveTokens) {
      onRemoveTokens(removeIds);
    } else {
      const removeSet = new Set(removeIds);
      onChangeBoard({
        ...board,
        tokens: board.tokens.filter((token) => !removeSet.has(token.id)),
      });
    }
    setSelection([]);
  }

  function adjustScale(next: number, anchor?: { x: number; y: number }) {
    followFitRef.current = false;
    const clamped = Math.min(MAX_SCALE, Math.max(minScale, next));
    if (!viewportRef.current) {
      setScale(clamped);
      return;
    }
    const rect = viewportRef.current.getBoundingClientRect();
    const ax = anchor?.x ?? rect.width / 2;
    const ay = anchor?.y ?? rect.height / 2;
    const current = scaleRef.current;
    const worldX = (ax - pan.x) / current;
    const worldY = (ay - pan.y) / current;
    setScale(clamped);
    setPan({
      x: ax - worldX * clamped,
      y: ay - worldY * clamped,
    });
  }

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setViewportSize({
        w: Math.max(1, rect.width),
        h: Math.max(1, rect.height),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    followFitRef.current = true;
    setScale(fitScale);
    setPan({
      x: (viewportSize.w - world.width * fitScale) / 2,
      y: (viewportSize.h - world.height * fitScale) / 2,
    });
    // Novo mapa / grade: reencaixa como ao abrir a página no Roll20.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world.width, world.height, gridSize, mapBoard.mapUrl]);

  useEffect(() => {
    if (!followFitRef.current) return;
    setScale(fitScale);
    setPan({
      x: (viewportSize.w - world.width * fitScale) / 2,
      y: (viewportSize.h - world.height * fitScale) / 2,
    });
  }, [world.width, world.height, viewportSize.w, viewportSize.h, fitScale]);

  useEffect(() => {
    if (!isMaster || !board.mapUrl) return;
    if (
      typeof board.mapWidth === "number" &&
      board.mapWidth > 0 &&
      typeof board.mapHeight === "number" &&
      board.mapHeight > 0
    ) {
      return;
    }
    if (probedMapRef.current === board.mapUrl) return;
    probedMapRef.current = board.mapUrl;
    let cancelled = false;
    void loadMapImageSize(board.mapUrl)
      .then((size) => {
        if (cancelled) return;
        const grid = board.gridSize || 50;
        onChangeBoard({
          ...board,
          mapWidth: Math.max(1, Math.round(size.width / grid)),
          mapHeight: Math.max(1, Math.round(size.height / grid)),
        });
      })
      .catch(() => {
        /* keep fallback world size */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.mapUrl, board.mapWidth, board.mapHeight, isMaster]);

  useEffect(() => {
    if (!tokenLayerMenu) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-token-layer-menu]")) return;
      setTokenLayerMenu(null);
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [tokenLayerMenu]);

  useEffect(() => {
    function onPointerDownOutside(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest("[data-token]") ||
        target.closest("[data-token-selection]") ||
        target.closest("[data-token-layer-menu]") ||
        target.closest("[data-condition-menu]")
      ) {
        return;
      }
      // Clique dentro do mapa: handleBoardPointerDown já desmarca.
      if (viewportRef.current?.contains(target)) return;
      setSelection([]);
      setSelectedAnnotation(null);
      setConditionMenuOpen(false);
      setTokenLayerMenu(null);
    }
    window.addEventListener("pointerdown", onPointerDownOutside, true);
    return () =>
      window.removeEventListener("pointerdown", onPointerDownOutside, true);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelected();
      }
      if (event.key === "Escape") {
        if (tokenLayerMenu) {
          setTokenLayerMenu(null);
          return;
        }
        setSelection([]);
        setSelectedAnnotation(null);
      }
      if (event.key === "+" || event.key === "=") {
        adjustScale(scale * ZOOM_FACTOR);
      }
      if (event.key === "-" || event.key === "_") {
        adjustScale(scale / ZOOM_FACTOR);
      }

      const arrowDelta: Record<string, { dx: number; dy: number }> = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
      };
      const delta = arrowDelta[event.key];
      if (delta && selectedIds.length > 0 && !selectedAnnotation) {
        const movable = board.tokens.filter(
          (token) => selectedIds.includes(token.id) && canDragToken(token)
        );
        if (movable.length === 0) return;
        event.preventDefault();
        const step = gridSize;
        const moves = movable.map((token) => {
          const footprint = tokenFootprintPx(token, step);
          const snapped = snapBoardPoint(
            token.x + delta.dx * step,
            token.y + delta.dy * step,
            footprint
          );
          return { tokenId: token.id, x: snapped.x, y: snapped.y };
        });
        if (moves.length === 1) {
          onMoveToken(moves[0].tokenId, moves[0].x, moves[0].y, {
            commit: true,
          });
        } else {
          onMoveTokens?.(moves, { commit: true });
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    board,
    selectedIds,
    selectedAnnotation,
    tokenLayerMenu,
    isMaster,
    scale,
    pan,
    gridSize,
  ]);

  const dragTokenIdsRef = useRef(dragTokenIds);
  const dragOriginRef = useRef(dragOrigin);
  const dragStartsRef = useRef(dragStarts);
  const boardTokensRef = useRef(board.tokens);
  const viewTokensRef = useRef(viewTokens);
  const isPanningFlagRef = useRef(isPanning);
  const marqueeRef = useRef(marquee);
  const toolRef = useRef(tool);
  const gridSizeRef = useRef(gridSize);
  const isHexRef = useRef(isHex);
  const onMoveTokenRef = useRef(onMoveToken);
  const onMoveTokensRef = useRef(onMoveTokens);
  dragTokenIdsRef.current = dragTokenIds;
  dragOriginRef.current = dragOrigin;
  dragStartsRef.current = dragStarts;
  boardTokensRef.current = board.tokens;
  viewTokensRef.current = viewTokens;
  isPanningFlagRef.current = isPanning;
  marqueeRef.current = marquee;
  toolRef.current = tool;
  gridSizeRef.current = gridSize;
  isHexRef.current = isHex;
  onMoveTokenRef.current = onMoveToken;
  onMoveTokensRef.current = onMoveTokens;

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      if (isPanningFlagRef.current && panOriginRef.current) {
        const origin = panOriginRef.current;
        setPan({
          x: origin.panX + (event.clientX - origin.pointerX),
          y: origin.panY + (event.clientY - origin.pointerY),
        });
        return;
      }

      const activeDragIds = dragTokenIdsRef.current;
      const origin = dragOriginRef.current;
      if (activeDragIds.length > 0 && origin) {
        const point = localPoint(event);
        const dx = point.x - origin.x;
        const dy = point.y - origin.y;
        const starts = dragStartsRef.current;
        const moves = activeDragIds.map((id) => {
          const start = starts[id] ?? { x: 0, y: 0 };
          return {
            tokenId: id,
            x: start.x + dx,
            y: start.y + dy,
          };
        });
        for (const move of moves) {
          liveDragRef.current[move.tokenId] = { x: move.x, y: move.y };
        }
        lastEmitRef.current = performance.now();
        const moveMany = onMoveTokensRef.current;
        const moveOne = onMoveTokenRef.current;
        if (moveMany && moves.length > 1) {
          moveMany(moves, { commit: false });
        } else {
          for (const move of moves) {
            moveOne(move.tokenId, move.x, move.y, { commit: false });
          }
        }
        return;
      }

      const currentMarquee = marqueeRef.current;
      if (currentMarquee) {
        const point = localPoint(event);
        setMarquee((prev) =>
          prev ? { ...prev, x2: point.x, y2: point.y } : prev
        );
      }
    }

    function onPointerUp() {
      const activeDragIds = dragTokenIdsRef.current;
      if (activeDragIds.length > 0) {
        const g = gridSizeRef.current;
        const hex = isHexRef.current;
        const moves = activeDragIds.map((id) => {
          const live = liveDragRef.current[id];
          const token = boardTokensRef.current.find((item) => item.id === id);
          const footprint = token ? tokenFootprintPx(token, g) : g;
          const rawX = live?.x ?? token?.x ?? 0;
          const rawY = live?.y ?? token?.y ?? 0;
          if (hex) {
            const snapped = snapTokenToHex(rawX, rawY, footprint, g);
            return { tokenId: id, x: snapped.x, y: snapped.y };
          }
          return {
            tokenId: id,
            x: snapToGrid(rawX, g),
            y: snapToGrid(rawY, g),
          };
        });
        liveDragRef.current = {};
        const moveMany = onMoveTokensRef.current;
        const moveOne = onMoveTokenRef.current;
        if (moveMany && moves.length > 1) {
          moveMany(moves, { commit: true });
        } else {
          for (const move of moves) {
            moveOne(move.tokenId, move.x, move.y, { commit: true });
          }
        }
        // Mantém bloqueio de eco após o drop (pacotes live atrasados).
        window.setTimeout(() => {
          for (const id of activeDragIds) {
            draggingTokenIdsRef?.current.delete(id);
          }
        }, 500);
      }

      const currentMarquee = marqueeRef.current;
      if (currentMarquee && toolRef.current === "select" && isMaster) {
        const g = gridSizeRef.current;
        const hits = viewTokensRef.current
          .filter((token) => {
            const size = tokenFootprintPx(token, g);
            return rectsOverlap(currentMarquee, {
              x: token.x,
              y: token.y,
              w: size,
              h: size,
            });
          })
          .map((token) => token.id);
        setSelection(hits);
      }
      setMarquee(null);
      setDragTokenIds([]);
      setDragOrigin(null);
      setDragStarts({});
      setIsPanning(false);
      panOriginRef.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    // Listeners montados uma vez; callbacks/estado via refs.
  }, [isMaster]);

  function handleBoardPointerDown(event: React.PointerEvent) {
    if (
      event.target !== event.currentTarget &&
      (event.target as HTMLElement).dataset.token
    ) {
      return;
    }

    setTokenLayerMenu(null);
    // Clique no vazio do mapa (ou fora do token): desmarca.
    setSelection([]);
    setSelectedAnnotation(null);
    setConditionMenuOpen(false);

    if (event.button === 1 || event.altKey || (tool === "select" && !event.shiftKey)) {
      event.preventDefault();
      setIsPanning(true);
      panOriginRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        panX: pan.x,
        panY: pan.y,
      };
      return;
    }

    const point = localPoint(event);

    if (tool === "party-move" && isMaster) {
      const selected = viewTokens.filter((token) =>
        selectedIds.includes(token.id)
      );
      const movers =
        selected.length > 0
          ? selected.filter((token) => !token.secret || isMaster)
          : viewTokens.filter(
              (token) => token.kind === "pc" && !token.secret
            );
      if (movers.length === 0) return;
      const snapped = snapBoardPoint(point.x, point.y);
      onChangeBoard({
        ...board,
        tokens: board.tokens.map((token) => {
          if (!movers.some((item) => item.id === token.id)) return token;
          return { ...token, x: snapped.x, y: snapped.y };
        }),
      });
      return;
    }

    if (tool === "select" && isMaster && event.shiftKey) {
      setMarquee({ x1: point.x, y1: point.y, x2: point.x, y2: point.y });
      return;
    }

    if (tool === "select") {
      return;
    }

    if (tool === "draw" && canAnnotate) {
      setDrawPoints([point]);
      return;
    }

    if (tool === "ruler") {
      const snapped = applyMeasureSnap(point, gridSize, measureSettings.snap, isHex);
      setRulerStart(snapped);
      setRulerPreview(snapped);
      return;
    }

    if (tool === "effect" && canAnnotate) {
      setEffectStart(point);
      setEffectPreview(point);
      return;
    }
  }

  function handleBoardPointerMove(event: React.PointerEvent) {
    const point = localPoint(event);
    if (tool === "draw" && drawPoints.length > 0 && canAnnotate) {
      setDrawPoints((prev) => [...prev, point]);
    }
    if (tool === "ruler" && rulerStart) {
      // Só preview local — evita “replay” de ecos do socket a cada frame.
      const snapped = applyMeasureSnap(point, gridSize, measureSettings.snap, isHex);
      setRulerPreview(snapped);
    }
    if (tool === "effect" && effectStart) {
      setEffectPreview(point);
    }
  }

  function handleBoardPointerUp(event?: React.PointerEvent) {
    if (tool === "draw" && drawPoints.length > 1 && canAnnotate) {
      onChangeBoard(
        withAnnotationsOnViewerScene(board, currentUserId, {
          drawings: [
            ...mapBoard.drawings,
            {
              id: uid("draw"),
              points: drawPoints,
              color: "var(--color-crimson)",
              width: 3,
              byUserId: currentUserId,
              secret: placeOnSecretLayer && isMaster ? true : undefined,
            },
          ],
        })
      );
    }
    setDrawPoints([]);

    if (tool === "ruler" && rulerStart && rulerPreview) {
      const stay =
        measureSettings.fade === "stay" || Boolean(event?.shiftKey);
      if (stay) {
        if (measureSettings.broadcast) {
          onRuler(rulerStart, rulerPreview, {
            sticky: true,
            broadcast: true,
            shape: measureSettings.shape,
            color: measureSettings.color,
          });
        } else {
          setLocalStickyMeasures((previous) => [
            ...previous,
            {
              id: uid("local-measure"),
              shape: measureSettings.shape,
              from: rulerStart,
              to: rulerPreview,
              color: measureSettings.color,
            },
          ]);
        }
      }
      // Instantânea: some só o preview local; não apaga marcações fixas.
    }
    setRulerStart(null);
    setRulerPreview(null);

    if (tool === "effect" && effectStart && effectPreview && canAnnotate) {
      const needsDrag = fxKindNeedsDrag(effectSettings.kind);
      const scalesWithDrag = fxKindScalesWithDrag(effectSettings.kind);
      const dragDist = Math.hypot(
        effectPreview.x - effectStart.x,
        effectPreview.y - effectStart.y
      );
      if (needsDrag && dragDist < 8) {
        setEffectStart(null);
        setEffectPreview(null);
        return;
      }
      const stay =
        effectSettings.fade === "stay" || Boolean(event?.shiftKey);
      const color = fxElementColor(effectSettings.element);
      const defaultRadius = Math.max(18, Math.round(gridSize * 1.35));
      const radius = scalesWithDrag
        ? Math.max(defaultRadius, Math.round(dragDist))
        : defaultRadius;
      const toX =
        needsDrag || scalesWithDrag || dragDist >= 8
          ? effectPreview.x
          : effectStart.x;
      const toY =
        needsDrag || scalesWithDrag || dragDist >= 8
          ? effectPreview.y
          : effectStart.y;
      const label = `${fxKindLabel(effectSettings.kind)} · ${fxElementLabel(
        effectSettings.element
      )}`;
      const effectPayload: BoardEffect = {
        id: uid("fx"),
        x: effectStart.x,
        y: effectStart.y,
        toX,
        toY,
        radius,
        color,
        label,
        fxKind: effectSettings.kind,
        fxElement: effectSettings.element,
        secret: placeOnSecretLayer && isMaster ? true : undefined,
        expiresAt: stay ? undefined : Date.now() + FX_INSTANT_MS,
      };
      if (stay && !effectSettings.broadcast) {
        setLocalStickyEffects((previous) => [...previous, effectPayload]);
      } else {
        onEffectPing?.({
          sticky: stay,
          broadcast: effectSettings.broadcast,
          effect: effectPayload,
        });
      }
    }
    setEffectStart(null);
    setEffectPreview(null);
  }

  function handleWheel(event: React.WheelEvent) {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const factor = event.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    adjustScale(scale * factor, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  const previewSquares =
    rulerStart && rulerPreview
      ? measureCells(rulerStart, rulerPreview)
      : null;
  const previewLabel =
    previewSquares != null ? measureLabel(previewSquares) : null;
  const activeMeasure =
    rulerStart && rulerPreview
      ? {
          shape: measureSettings.shape,
          from: rulerStart,
          to: rulerPreview,
          label: previewLabel ?? "",
          color: measureSettings.color,
        }
      : null;

  const particleEffects = useMemo(() => {
    const list = [
      ...mapBoard.effects,
      ...localStickyEffects,
      ...transientEffects,
    ].filter(
      (effect) => Boolean(effect.fxKind) && (isMaster || !effect.secret)
    );
    if (tool === "effect" && effectStart && effectPreview) {
      const dragDist = Math.hypot(
        effectPreview.x - effectStart.x,
        effectPreview.y - effectStart.y
      );
      const defaultRadius = Math.max(18, Math.round(gridSize * 1.35));
      const radius = fxKindScalesWithDrag(effectSettings.kind)
        ? Math.max(defaultRadius, Math.round(dragDist))
        : defaultRadius;
      list.push({
        id: "fx-preview",
        x: effectStart.x,
        y: effectStart.y,
        toX: effectPreview.x,
        toY: effectPreview.y,
        radius,
        color: fxElementColor(effectSettings.element),
        fxKind: effectSettings.kind,
        fxElement: effectSettings.element,
        label: fxKindLabel(effectSettings.kind),
        expiresAt: Date.now() + 60_000,
      });
    }
    return list;
  }, [
    mapBoard.effects,
    localStickyEffects,
    transientEffects,
    isMaster,
    tool,
    effectStart,
    effectPreview,
    gridSize,
    effectSettings.element,
    effectSettings.kind,
  ]);

  const selectedFxId =
    selectedAnnotation?.kind === "effect" ? selectedAnnotation.id : null;

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden border"
      style={{
        borderColor: "var(--color-border-strong)",
        backgroundColor: "#1A140F",
        minHeight: 420,
      }}
    >
      {tool === "ruler" ? (
        <div className="absolute left-2 top-2 z-40">
          <MeasurePanel
            settings={measureSettings}
            onChange={setMeasureSettings}
            metersPerSquare={mPerSquare}
            collapsed={measurePanelCollapsed}
            onToggleCollapsed={() =>
              setMeasurePanelCollapsed((value) => !value)
            }
          />
        </div>
      ) : null}

      {tool === "effect" ? (
        <div className="absolute left-2 top-2 z-40">
          <EffectPanel
            settings={effectSettings}
            onChange={setEffectSettings}
            collapsed={effectPanelCollapsed}
            onToggleCollapsed={() =>
              setEffectPanelCollapsed((value) => !value)
            }
          />
        </div>
      ) : null}

      <div className="absolute right-2 top-2 z-30 flex items-center gap-1">
        <button
          type="button"
          className="h-8 w-8 border text-sm text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.85)",
            borderColor: "var(--color-border-strong)",
          }}
          onClick={() => adjustScale(scale / ZOOM_FACTOR)}
          title="Afastar (−)"
        >
          −
        </button>
        <button
          type="button"
          className="h-8 min-w-[3.5rem] border px-2 text-xs text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.85)",
            borderColor: "var(--color-border-strong)",
          }}
          onClick={fitToViewport}
          title="Enquadrar mapa (duplo clique = 100%)"
          onDoubleClick={(event) => {
            event.preventDefault();
            followFitRef.current = false;
            setScale(1);
            centerPanForScale(1);
          }}
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          className="h-8 w-8 border text-sm text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.85)",
            borderColor: "var(--color-border-strong)",
          }}
          onClick={() => adjustScale(scale * ZOOM_FACTOR)}
          title="Aproximar (+)"
        >
          +
        </button>
      </div>

      <div
        ref={viewportRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: isPanning
            ? "grabbing"
            : tool === "select"
              ? "default"
              : "crosshair",
        }}
        onWheel={handleWheel}
        onPointerDown={handleBoardPointerDown}
        onPointerMove={handleBoardPointerMove}
        onPointerUp={handleBoardPointerUp}
        onContextMenu={(event) => event.preventDefault()}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("application/x-rpg-character")) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          const raw = event.dataTransfer.getData("application/x-rpg-character");
          if (!raw || !onDropCharacter) return;
          const characterId = Number(raw);
          if (!characterId) return;
          const point = localPoint(event);
          const snapped = snapBoardPoint(point.x, point.y);
          onDropCharacter(characterId, snapped.x, snapped.y);
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: world.width,
            height: world.height,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${displayScale})`,
            backgroundImage: mapBoard.mapUrl
              ? `url(${mapBoard.mapUrl})`
              : undefined,
            backgroundSize: mapBoard.mapUrl ? "100% 100%" : undefined,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#1A140F",
          }}
        >
          {isHex ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
              width={world.width}
              height={world.height}
            >
              {hexCells.map((cell) => (
                <polygon
                  key={`${cell.q},${cell.r}`}
                  points={hexPolygonPoints(cell.x, cell.y, gridSize)}
                  fill="none"
                  stroke="rgba(235,223,196,0.28)"
                  strokeWidth={1}
                />
              ))}
            </svg>
          ) : (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
              linear-gradient(rgba(235,223,196,0.22) 1px, transparent 1px),
              linear-gradient(90deg, rgba(235,223,196,0.22) 1px, transparent 1px)
            `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
              }}
            />
          )}

          {particleEffects.length > 0 || selectedFxId ? (
            <EffectParticleLayer
              effects={particleEffects}
              width={world.width}
              height={world.height}
              gridSize={gridSize}
              selectedId={selectedFxId}
            />
          ) : null}

          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <EffectHitAreas
              effects={[...mapBoard.effects, ...localStickyEffects].filter(
                (effect) =>
                  Boolean(effect.fxKind) && (isMaster || !effect.secret)
              )}
              interactive={tool === "select"}
              selectedId={selectedFxId}
              onSelect={(id) => {
                setSelection([]);
                setSelectedAnnotation({ kind: "effect", id });
              }}
            />
            {tool === "effect" &&
            effectSettings.kind === "breathe" &&
            effectStart &&
            effectPreview ? (
              <g className="pointer-events-none">
                {(() => {
                  const dragDist = Math.hypot(
                    effectPreview.x - effectStart.x,
                    effectPreview.y - effectStart.y
                  );
                  const r = Math.max(
                    Math.round(gridSize * 1.35),
                    Math.round(dragDist)
                  );
                  const color = fxElementColor(effectSettings.element);
                  return (
                    <>
                      <circle
                        cx={effectStart.x}
                        cy={effectStart.y}
                        r={r}
                        fill={`${color}22`}
                        stroke={color}
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                        opacity={0.85}
                      />
                      <line
                        x1={effectStart.x}
                        y1={effectStart.y}
                        x2={effectPreview.x}
                        y2={effectPreview.y}
                        stroke={color}
                        strokeWidth={1.5}
                        opacity={0.7}
                      />
                    </>
                  );
                })()}
              </g>
            ) : null}
            {mapBoard.effects
              .filter(
                (effect) => !effect.fxKind && (isMaster || !effect.secret)
              )
              .map((effect) => {
              const selected =
                selectedAnnotation?.kind === "effect" &&
                selectedAnnotation.id === effect.id;
              const squares =
                effect.meters != null
                  ? Math.max(1, Math.round(effect.meters / mPerSquare))
                  : Math.max(1, Math.round(effect.radius / gridSize));
              const label =
                effect.label || measureLabel(squares);
              const palette = measureColors(effect.color);
              return (
              <g key={effect.id}>
                <circle
                  cx={effect.x}
                  cy={effect.y}
                  r={effect.radius}
                  fill={effect.color?.startsWith("rgba") ? effect.color : palette.fill}
                  stroke={selected ? "#F0D080" : palette.stroke}
                  strokeWidth={selected ? 3 : 2.5}
                  style={{ cursor: tool === "select" ? "pointer" : "default" }}
                  onPointerDown={(event) => {
                    if (tool !== "select") return;
                    event.stopPropagation();
                    setSelection([]);
                    setSelectedAnnotation({ kind: "effect", id: effect.id });
                  }}
                />
                <MeasureBadge
                  x={effect.x}
                  y={effect.y - effect.radius - 14}
                  text={label}
                  color={palette.stroke}
                />
              </g>
            );
            })}
            {mapBoard.drawings
              .filter((drawing) => isMaster || !drawing.secret)
              .map((drawing) => {
              const selected =
                selectedAnnotation?.kind === "drawing" &&
                selectedAnnotation.id === drawing.id;
              const points = drawing.points
                .map((p) => `${p.x},${p.y}`)
                .join(" ");
              return (
              <g key={drawing.id}>
                {tool === "select" ? (
                  <polyline
                    points={points}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={Math.max(14, drawing.width + 10)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      setSelection([]);
                      setSelectedAnnotation({
                        kind: "drawing",
                        id: drawing.id,
                      });
                    }}
                  />
                ) : null}
                <polyline
                  points={points}
                  fill="none"
                  stroke={selected ? "#C09A5A" : drawing.color}
                  strokeWidth={selected ? drawing.width + 2 : drawing.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none"
                />
              </g>
            );
            })}
            {drawPoints.length > 1 && (
              <polyline
                points={drawPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#C09A5A"
                strokeWidth={3}
                className="pointer-events-none"
              />
            )}
            {mapBoard.rulers
              .filter((ruler) => !ruler.live)
              .map((ruler) => {
              const squares =
                typeof ruler.squares === "number"
                  ? ruler.squares
                  : measureCells(ruler.from, ruler.to);
              const label = measureLabel(squares);
              const shape = (ruler.shape ?? "line") as MeasureShape;
              const selected =
                selectedAnnotation?.kind === "ruler" &&
                selectedAnnotation.id === ruler.id;
              return (
                <MeasureShapeGraphic
                  key={ruler.id}
                  shape={shape}
                  from={ruler.from}
                  to={ruler.to}
                  gridSize={gridSize}
                  label={label}
                  byUserName={ruler.byUserName}
                  color={ruler.color}
                  selected={selected}
                  interactive={tool === "select"}
                  onSelect={() => {
                    setSelection([]);
                    setSelectedAnnotation({ kind: "ruler", id: ruler.id });
                  }}
                />
              );
            })}
            {localStickyMeasures.map((mark) => {
              const selected =
                selectedAnnotation?.kind === "local-measure" &&
                selectedAnnotation.id === mark.id;
              return (
                <MeasureShapeGraphic
                  key={mark.id}
                  shape={mark.shape}
                  from={mark.from}
                  to={mark.to}
                  gridSize={gridSize}
                  label={measureLabel(measureCells(mark.from, mark.to))}
                  color={mark.color}
                  selected={selected}
                  interactive={tool === "select"}
                  onSelect={() => {
                    setSelection([]);
                    setSelectedAnnotation({
                      kind: "local-measure",
                      id: mark.id,
                    });
                  }}
                />
              );
            })}
            {activeMeasure ? (
              <MeasureShapeGraphic
                shape={activeMeasure.shape}
                from={activeMeasure.from}
                to={activeMeasure.to}
                gridSize={gridSize}
                label={activeMeasure.label}
                color={activeMeasure.color}
              />
            ) : null}
            {marquee && (
              <rect
                x={Math.min(marquee.x1, marquee.x2)}
                y={Math.min(marquee.y1, marquee.y2)}
                width={Math.abs(marquee.x2 - marquee.x1)}
                height={Math.abs(marquee.y2 - marquee.y1)}
                fill="rgba(192,154,90,0.2)"
                stroke="#C09A5A"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            )}
          </svg>

          {showFog && (
            <FogLightOverlay
              width={fogBounds.width}
              height={fogBounds.height}
              lights={lightSources}
            />
          )}

          {viewTokens
            .filter((token) =>
              isTokenVisibleThroughFog(token, sceneBoard, fogViewer, lightSources)
            )
            .map((token) => {
            const size = tokenFootprintPx(token, gridSize);
            const selected = selectedIds.includes(token.id);
            const highlighted =
              !selected && highlightedTokenIds.includes(token.id);
            const emphasize = selected || highlighted;
            const showHp =
              typeof token.hpMax === "number" ||
              typeof token.hpCurrent === "number";
            const dead = isTokenDead(token);
            const dragging = dragTokenIds.includes(token.id);
            const live = liveDragRef.current[token.id];
            const renderX = dragging && live ? live.x : token.x;
            const renderY = dragging && live ? live.y : token.y;

            const inset = Math.max(1, Math.round(gridSize * 0.04));
            const body = Math.max(8, size - inset * 2);
            /** Controles (PV / status) um pouco maiores. */
            const controlSize = Math.max(
              24,
              Math.min(58, Math.round(body * 0.58))
            );
            const controlFont = Math.max(
              10,
              Math.min(18, Math.round(controlSize * 0.38))
            );
            const controlIcon = Math.max(12, Math.round(controlSize * 0.5));
            const controlGap = Math.max(3, Math.round(controlSize * 0.14));
            const conditionBadge = Math.max(
              12,
              Math.min(28, Math.round(body * 0.3))
            );
            const conditionIcon = Math.max(
              7,
              Math.round(conditionBadge * 0.58)
            );
            /** Nome legível só quando o token tem tamanho útil na tela. */
            const tokenScreenPx = size * displayScale;
            const showNameplate = tokenScreenPx >= 28;
            const invScale = 1 / Math.max(0.001, displayScale);
            const nameFont = 11 * invScale;
            const namePadX = 5 * invScale;
            const namePadY = 2 * invScale;
            const nameRadius = 3 * invScale;
            const nameMaxWidth = Math.max(size * 1.8, 88 * invScale);
            const nameGap = 3 * invScale;
            const initialFont = Math.max(
              8,
              Math.min(18, Math.round(body * 0.28))
            );
            const hpBarWidth = size * 1.28;
            const hpBarHeight = Math.max(8, Math.round(size * 0.12));
            const hpBarFont = Math.max(6, Math.round(hpBarHeight * 0.55));
            const hpBarGap = Math.max(2, Math.round(size * 0.03));
            const hpBarTop = -inset - hpBarHeight - hpBarGap;
            const controlsTop = showHp
              ? hpBarTop - controlSize - Math.round(controlSize * 0.25)
              : -inset - controlSize - Math.round(controlSize * 0.2);
            const draftMax = fieldDrafts[`${token.id}:hpMax`];
            const draftCur = fieldDrafts[`${token.id}:hpCurrent`];
            const hpMaxNum = parseHpDraft(draftMax, token.hpMax);
            const hpCurNum = parseHpDraft(
              draftCur,
              typeof token.hpCurrent === "number"
                ? token.hpCurrent
                : token.hpMax
            );
            const hpMaxLabel =
              hpMaxNum != null ? String(hpMaxNum) : "—";
            const hpCurLabel =
              hpCurNum != null ? String(hpCurNum) : "—";
            const hpRatio =
              hpMaxNum != null && hpMaxNum > 0 && hpCurNum != null
                ? Math.max(0, Math.min(1, hpCurNum / hpMaxNum))
                : 0;
            const showHpNumbers = canSeeTokenHpNumbers(token);

            return (
              <div
                key={token.id}
                data-token="true"
                className="absolute overflow-visible"
                style={{
                  left: renderX,
                  top: renderY,
                  width: size,
                  height: size,
                  zIndex: emphasize || dragging ? 20 : 10,
                  // Sem transition de posição: ecos live + CSS = "andar/rollback".
                  transition: "none",
                  willChange: dragging ? "left, top" : undefined,
                }}
              >
                {showHp ? (
                  <div
                    className="pointer-events-none absolute left-1/2 z-[14] overflow-hidden"
                    style={{
                      top: hpBarTop,
                      width: hpBarWidth,
                      height: hpBarHeight,
                      marginLeft: -hpBarWidth / 2,
                      borderRadius: Math.max(3, Math.round(hpBarHeight * 0.2)),
                      backgroundColor: "rgba(40, 20, 20, 0.85)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.45)",
                    }}
                    data-token="true"
                  >
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${hpRatio * 100}%`,
                        backgroundColor: "#C62828",
                      }}
                    />
                    {showHpNumbers ? (
                      <span
                        className="absolute inset-0 flex items-center justify-center font-arial tabular-nums"
                        style={{
                          fontFamily: "Arial, Helvetica, sans-serif",
                          fontSize: hpBarFont,
                          lineHeight: 1,
                          color: "#FFFFFF",
                          textShadow: "0 1px 1px rgba(0,0,0,0.55)",
                          letterSpacing: "0.02em",
                          whiteSpace: "nowrap",
                          paddingLeft: 2,
                          paddingRight: 2,
                        }}
                      >
                        {hpMaxLabel} / {hpCurLabel}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {selected &&
                  selectedIds.length === 1 &&
                  canEditTokenFields(token) && (
                  <div
                    className="token-controls-rise absolute left-1/2 z-40 flex -translate-x-1/2 items-center"
                    style={{
                      top: controlsTop,
                      gap: controlGap,
                    }}
                    data-token="true"
                  >
                    {(
                      [
                        ["hpMax", String(token.hpMax ?? ""), "#B91C1C"],
                        ["customValue", token.customValue ?? "", "#15803D"],
                        ["hpCurrent", String(token.hpCurrent ?? ""), "#1D4ED8"],
                      ] as const
                    ).map(([field, value, border]) => {
                      const draftKey = `${token.id}:${field}`;
                      return (
                      <input
                        key={field}
                        data-token="true"
                        value={fieldDrafts[draftKey] ?? value}
                        onClick={(event) => event.stopPropagation()}
                        onPointerDown={(event) => event.stopPropagation()}
                        onChange={(event) => {
                          const raw = event.target.value;
                          setFieldDrafts((prev) => ({ ...prev, [draftKey]: raw }));
                          if (field === "customValue") {
                            updateTokenFields(token.id, { customValue: raw });
                            return;
                          }
                          // Absolute ao digitar; relativo (+20/-20) só no Enter/blur.
                          if (/^\d+$/.test(raw.trim())) {
                            updateTokenFields(token.id, {
                              [field]: Math.max(0, Number(raw.trim())),
                            } as Partial<BoardToken>);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter") return;
                          event.preventDefault();
                          event.stopPropagation();
                          if (field === "customValue") {
                            (event.target as HTMLInputElement).blur();
                            return;
                          }
                          commitTokenHpField(
                            token.id,
                            field,
                            (event.target as HTMLInputElement).value
                          );
                          (event.target as HTMLInputElement).blur();
                        }}
                        onBlur={(event) => {
                          if (field === "customValue") {
                            setFieldDrafts((prev) => {
                              const next = { ...prev };
                              delete next[draftKey];
                              return next;
                            });
                            return;
                          }
                          commitTokenHpField(
                            token.id,
                            field,
                            event.currentTarget.value
                          );
                        }}
                        className="rounded-full border-2 text-center font-semibold outline-none shadow"
                        style={{
                          width: controlSize,
                          height: controlSize,
                          fontSize: controlFont,
                          borderColor: border,
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-ink)",
                          fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                        title={
                          field === "hpMax"
                            ? "PV máximo (use +10 / -10 e Enter)"
                            : field === "hpCurrent"
                              ? "PV atual (use +10 / -10 e Enter)"
                              : "Campo livre"
                        }
                      />
                    );})}
                    <label
                      data-token="true"
                      title="Cor da borda"
                      className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 shadow"
                      style={{
                        width: controlSize,
                        height: controlSize,
                        borderColor: token.borderColor || "#C09A5A",
                        backgroundColor: "var(--color-parchment)",
                      }}
                      onClick={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      <input
                        type="color"
                        data-token="true"
                        value={token.borderColor || "#C09A5A"}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={(event) =>
                          updateTokenFields(token.id, {
                            borderColor: event.target.value,
                          } as Partial<BoardToken>)
                        }
                      />
                      <span
                        className="pointer-events-none block rounded-full border"
                        style={{
                          width: controlIcon,
                          height: controlIcon,
                          borderColor: token.borderColor || "#C09A5A",
                          backgroundColor: token.borderColor || "#C09A5A",
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      data-token="true"
                      title="Condições / status"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelection([token.id]);
                        setConditionMenuOpen((open) => !open);
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                      className="flex items-center justify-center rounded-full border-2 shadow"
                      style={{
                        width: controlSize,
                        height: controlSize,
                        borderColor: "#C09A5A",
                        backgroundColor: "var(--color-crimson)",
                        color: "var(--color-ink-inverse)",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        style={{ width: controlIcon, height: controlIcon }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M12 3 L14.2 8.2 L20 9 L15.8 12.8 L17.2 18.5 L12 15.6 L6.8 18.5 L8.2 12.8 L4 9 L9.8 8.2 Z" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  data-token="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    setTokenLayerMenu(null);
                    if (event.shiftKey && isMaster) {
                      setSelection(
                        selectedIds.includes(token.id)
                          ? selectedIds.filter((id) => id !== token.id)
                          : [...selectedIds, token.id]
                      );
                      return;
                    }
                    setSelection([token.id]);
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!isMaster) return;
                    const nextSelection =
                      selectedIds.includes(token.id) && selectedIds.length > 1
                        ? selectedIds
                        : [token.id];
                    setSelection(nextSelection);
                    setConditionMenuOpen(false);
                    setTokenLayerMenu({
                      tokenId: token.id,
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    if (event.button === 2) return;
                    setTokenLayerMenu(null);
                    if (!canDragToken(token) || tool !== "select") return;
                    const group =
                      selectedIds.includes(token.id) && selectedIds.length > 1
                        ? selectedIds
                        : [token.id];
                    if (!selectedIds.includes(token.id)) {
                      setSelection([token.id]);
                    }
                    const starts: Record<string, { x: number; y: number }> = {};
                    for (const id of group) {
                      const item = board.tokens.find((t) => t.id === id);
                      if (item) starts[id] = { x: item.x, y: item.y };
                    }
                    setDragTokenIds(group);
                    setDragStarts(starts);
                    setDragOrigin(localPoint(event));
                    if (draggingTokenIdsRef) {
                      draggingTokenIdsRef.current = new Set(group);
                    }
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    if (!isMaster) return;
                    if (token.monsterId) onOpenMonsterSheet?.(token);
                    else if (token.characterId) onOpenCharacterSheet?.(token);
                  }}
                  className="absolute flex items-center justify-center overflow-hidden rounded-full font-semibold text-[var(--color-ink-inverse)]"
                  style={{
                    left: inset,
                    top: inset,
                    width: body,
                    height: body,
                    borderRadius: "9999px",
                    backgroundColor: token.color,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: emphasize
                      ? "#C09A5A"
                      : token.borderColor || "var(--color-parchment)",
                    boxShadow: emphasize
                      ? "0 0 0 1px #7A2530"
                      : undefined,
                    opacity: token.secret ? 0.75 : 1,
                    outline: token.secret ? "1px dashed #C09A5A" : undefined,
                    fontFamily: "'Cinzel', serif",
                    fontSize: initialFont,
                    cursor:
                      canDragToken(token) && tool === "select"
                        ? "grab"
                        : "pointer",
                    backgroundImage: token.imageUrl
                      ? `url(${token.imageUrl})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  title={token.name}
                >
                  {!token.imageUrl && token.name.slice(0, 2).toUpperCase()}
                </button>

                {dead ? (
                  <div
                    className="pointer-events-none absolute z-[16]"
                    style={{
                      left: inset,
                      top: inset,
                      width: body,
                      height: body,
                    }}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="h-full w-full"
                      overflow="visible"
                    >
                      <line
                        x1="16"
                        y1="16"
                        x2="84"
                        y2="84"
                        stroke="#1A0505"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                      <line
                        x1="84"
                        y1="16"
                        x2="16"
                        y2="84"
                        stroke="#1A0505"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="16"
                        x2="84"
                        y2="84"
                        stroke="#E11D2E"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />
                      <line
                        x1="84"
                        y1="16"
                        x2="16"
                        y2="84"
                        stroke="#E11D2E"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                ) : null}

                {(token.conditions ?? []).length > 0 && (
                  <div
                    className="pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 flex-nowrap items-center justify-center"
                    style={{
                      top: showNameplate
                        ? size +
                          nameGap +
                          nameFont +
                          namePadY * 2 +
                          2 * invScale
                        : size + inset * 0.25 + Math.round(conditionBadge * 0.35),
                      gap: Math.max(2, Math.round(conditionBadge * 0.12)),
                    }}
                    data-token="true"
                  >
                    {(token.conditions ?? []).map((conditionId) => {
                      if (!isConditionId(conditionId)) return null;
                      const condition = getCondition(conditionId);
                      if (!condition) return null;
                      return (
                        <span
                          key={conditionId}
                          title={condition.name}
                          className="flex shrink-0 items-center justify-center rounded-full border"
                          style={{
                            width: conditionBadge,
                            height: conditionBadge,
                            backgroundColor: "#1A140F",
                            borderColor: condition.color,
                            color: condition.color,
                          }}
                        >
                          <ConditionIcon
                            id={conditionId}
                            style={{
                              width: conditionIcon,
                              height: conditionIcon,
                            }}
                            color={condition.color}
                            title={condition.name}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {showNameplate ? (
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 text-center font-semibold"
                    style={{
                      top: size + nameGap,
                      maxWidth: nameMaxWidth,
                      transform: "translateX(-50%)",
                      fontSize: nameFont,
                      lineHeight: 1.2,
                      padding: `${namePadY}px ${namePadX}px`,
                      borderRadius: nameRadius,
                      color: "#1A140F",
                      backgroundColor: "rgba(255, 255, 255, 0.55)",
                      boxShadow: `0 ${1 * invScale}px ${3 * invScale}px rgba(0,0,0,0.25)`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {token.name}
                  </div>
                ) : null}
              </div>
            );
          })}

          {!mapBoard.mapUrl && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-[#C09A5A]">
              Scroll = zoom · Arrastar = pan · Shift+arrastar = seleção · 1 quad ={" "}
              {formatMeters(mPerSquare)}
            </div>
          )}
        </div>
      </div>

      {tokenLayerMenu &&
        (() => {
          const menuToken = board.tokens.find(
            (item) => item.id === tokenLayerMenu.tokenId
          );
          if (!menuToken || !isMaster) return null;
          const onSecret = Boolean(menuToken.secret);
          const menuTargets =
            selectedIds.includes(menuToken.id) && selectedIds.length > 1
              ? initiativeTokensFromIds(selectedIds)
              : canRollInitiative(menuToken)
                ? [menuToken]
                : [];
          const showInitiative =
            Boolean(onRollTokenInitiative) && menuTargets.length > 0;
          const menuWidth = 200;
          const menuHeight = showInitiative ? 148 : 96;
          const left = Math.min(
            tokenLayerMenu.x,
            window.innerWidth - menuWidth - 8
          );
          const top = Math.min(
            tokenLayerMenu.y,
            window.innerHeight - menuHeight - 8
          );
          return (
            <div
              data-token-layer-menu
              className="fixed z-[60] min-w-[12rem] border-2 py-1 shadow-xl"
              style={{
                left: Math.max(8, left),
                top: Math.max(8, top),
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-crimson)",
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onContextMenu={(event) => event.preventDefault()}
            >
              <p
                className="border-b px-3 py-1.5 text-[11px] text-[var(--color-ink-muted)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                {menuTargets.length > 1
                  ? `${menuTargets.length} tokens`
                  : `Camada — ${menuToken.name}`}
              </p>
              {showInitiative ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-parchment)]"
                  onClick={() => rollInitiativeForTokens(menuTargets)}
                >
                  {menuTargets.length > 1
                    ? `Rolar iniciativa (${menuTargets.length})`
                    : "Rolar iniciativa"}
                </button>
              ) : null}
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-parchment)]"
                onClick={() => setTokenLayer(menuToken.id, false)}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border"
                  style={{
                    borderColor: "var(--color-border-strong)",
                    backgroundColor: onSecret
                      ? "transparent"
                      : "var(--color-crimson)",
                  }}
                />
                Pública
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-parchment)]"
                onClick={() => setTokenLayer(menuToken.id, true)}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border"
                  style={{
                    borderColor: "var(--color-border-strong)",
                    backgroundColor: onSecret
                      ? "var(--color-crimson)"
                      : "transparent",
                  }}
                />
                Secreta
              </button>
            </div>
          );
        })()}

      {conditionMenuOpen &&
        selectedToken &&
        selectedIds.length === 1 &&
        canEditTokenFields(selectedToken) && (
          <div
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/35 p-3 sm:items-center"
            data-condition-menu
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) {
                setConditionMenuOpen(false);
              }
            }}
          >
            <div
              className="max-h-[70vh] w-full max-w-md overflow-y-auto border-2 p-3 shadow-xl"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3
                    className="text-base text-[var(--color-ink)]"
                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                  >
                    Condições — {selectedToken.name}
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    Livro do Jogador (5e). Pode marcar várias.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xl text-[var(--color-border-strong)]"
                  onClick={() => setConditionMenuOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {DND_CONDITIONS.map((condition) => {
                  const active = (selectedToken.conditions ?? []).includes(
                    condition.id
                  );
                  return (
                    <button
                      key={condition.id}
                      type="button"
                      title={condition.summary}
                      className="flex items-start gap-2 border px-2 py-2 text-left"
                      style={{
                        borderColor: active ? condition.color : "var(--color-border)",
                        backgroundColor: active
                          ? "var(--color-parchment)"
                          : "var(--color-surface)",
                        boxShadow: active
                          ? `inset 0 0 0 1px ${condition.color}`
                          : undefined,
                      }}
                      onClick={() =>
                        toggleTokenCondition(selectedToken, condition.id)
                      }
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                        style={{
                          borderColor: condition.color,
                          backgroundColor: "#1A140F",
                        }}
                      >
                        <ConditionIcon
                          id={condition.id}
                          className="h-4 w-4"
                          color={condition.color}
                        />
                      </span>
                      <span className="min-w-0">
                        <span
                          className="block text-sm text-[var(--color-ink)]"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {condition.name}
                          {active ? " ✓" : ""}
                        </span>
                        <span className="block text-[10px] leading-snug text-[var(--color-ink-muted)]">
                          {condition.summary}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {(selectedToken || selectedIds.length > 1 || selectedAnnotation) && (
        <div
          data-token-selection
          className="absolute bottom-2 left-2 z-40 max-w-[min(96vw,28rem)] rounded border px-2 py-1 text-[11px] text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.92)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {selectedAnnotation ? (
              <span>
                {selectedAnnotation.kind === "effect"
                  ? "Marcação"
                  : selectedAnnotation.kind === "drawing"
                    ? "Desenho"
                    : "Medida"}{" "}
                selecionada
              </span>
            ) : selectedIds.length > 1 ? (
              <span>{selectedIds.length} tokens selecionados</span>
            ) : (
              <span>
                {selectedToken?.name}
                {selectedToken &&
                  (() => {
                    const s = tokenFootprintPx(selectedToken, gridSize) / gridSize;
                    return ` · ${s}×${s}`;
                  })()}
                {typeof selectedToken?.hpCurrent === "number" &&
                  typeof selectedToken?.hpMax === "number" &&
                  canSeeTokenHpNumbers(selectedToken) &&
                  ` · PV ${selectedToken.hpCurrent}/${selectedToken.hpMax}`}
              </span>
            )}
            {isMaster &&
              onRollTokenInitiative &&
              (() => {
                const targets =
                  selectedIds.length > 1
                    ? initiativeTokensFromIds(selectedIds)
                    : selectedToken && canRollInitiative(selectedToken)
                      ? [selectedToken]
                      : [];
                if (targets.length === 0) return null;
                return (
                  <button
                    type="button"
                    className="pointer-events-auto underline"
                    onClick={() => rollInitiativeForTokens(targets)}
                  >
                    {targets.length > 1
                      ? `Iniciativa (${targets.length})`
                      : "Iniciativa"}
                  </button>
                );
              })()}
            {selectedToken &&
              selectedIds.length === 1 &&
              (isMaster ||
                Number(selectedToken.ownerUserId) === Number(currentUserId)) &&
              (selectedToken.monsterId || selectedToken.characterId) && (
                <button
                  type="button"
                  className="pointer-events-auto underline"
                  onClick={() => {
                    if (selectedToken.monsterId) {
                      onOpenMonsterSheet?.(selectedToken);
                    } else {
                      onOpenCharacterSheet?.(selectedToken);
                    }
                  }}
                >
                  Abrir ficha
                </button>
              )}
            {selectedToken &&
              selectedIds.length === 1 &&
              canEditTokenFields(selectedToken) && (
                <button
                  type="button"
                  className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full border"
                  style={{ borderColor: "#C09A5A", color: "#C09A5A" }}
                  title="Condições / status"
                  onClick={() => setConditionMenuOpen(true)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M12 3 L14.2 8.2 L20 9 L15.8 12.8 L17.2 18.5 L12 15.6 L6.8 18.5 L8.2 12.8 L4 9 L9.8 8.2 Z" />
                  </svg>
                </button>
              )}
            {(isMaster ||
              selectedAnnotation ||
              (selectedToken &&
                Number(selectedToken.ownerUserId) === Number(currentUserId)) ||
              selectedIds.some(
                (id) =>
                  Number(
                    board.tokens.find((token) => token.id === id)?.ownerUserId
                  ) === Number(currentUserId)
              )) && (
              <button
                type="button"
                className="pointer-events-auto underline text-[#E8D4C4]"
                onClick={deleteSelected}
              >
                Apagar
              </button>
            )}
          </div>

          {selectedToken &&
            selectedIds.length === 1 &&
            (selectedToken.conditions ?? []).length > 0 && (
              <div className="mt-1 flex flex-nowrap items-center gap-1 overflow-x-auto">
                {(selectedToken.conditions ?? []).map((conditionId) => {
                  if (!isConditionId(conditionId)) return null;
                  const condition = getCondition(conditionId);
                  if (!condition) return null;
                  return (
                    <button
                      key={conditionId}
                      type="button"
                      title={`${condition.name}: ${condition.summary}`}
                      className="pointer-events-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                      style={{
                        borderColor: condition.color,
                        color: condition.color,
                        backgroundColor: "rgba(0,0,0,0.35)",
                      }}
                      onClick={() => {
                        if (!canEditTokenFields(selectedToken)) return;
                        toggleTokenCondition(selectedToken, conditionId);
                      }}
                    >
                      <ConditionIcon
                        id={conditionId}
                        className="h-3.5 w-3.5"
                        color={condition.color}
                      />
                    </button>
                  );
                })}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
