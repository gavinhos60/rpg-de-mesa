import { useEffect, useMemo, useRef, useState } from "react";
import type { BoardEffect, BoardRuler, BoardState, BoardToken } from "../../types/game";
import {
  distanceMeters,
  formatMeters,
  boardMapForViewer,
  isTokenVisibleThroughFog,
  lightSourcesForViewer,
  loadMapImageSize,
  metersPerSquareOf,
  snapToGrid,
  tokenFootprintPx,
  tokensForViewer,
  viewerIgnoresFog,
  worldSizeOf,
} from "../../types/game";
import {
  DND_CONDITIONS,
  getCondition,
  isConditionId,
  type ConditionId,
} from "../../data/dnd/conditions";
import { FogLightOverlay } from "./FogLightOverlay";
import { ConditionIcon } from "./ConditionIcon";

export type BoardTool = "select" | "draw" | "ruler" | "effect" | "party-move";

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
  onRuler: (from: { x: number; y: number }, to: { x: number; y: number }) => void;
  onSelectToken?: (token: BoardToken | null) => void;
  onOpenMonsterSheet?: (token: BoardToken) => void;
  onOpenCharacterSheet?: (token: BoardToken) => void;
  onDropCharacter?: (characterId: number, x: number, y: number) => void;
  /** Mestre coloca novos desenhos/efeitos/NPCs na camada secreta. */
  placeOnSecretLayer?: boolean;
  /** Ref compartilhado: ids em arraste (GameRoom ignora ecos remotos). */
  draggingTokenIdsRef?: React.MutableRefObject<Set<string>>;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function hpRatio(token: BoardToken) {
  const max = token.hpMax ?? 0;
  const cur = token.hpCurrent ?? max;
  if (max <= 0) return 1;
  return Math.max(0, Math.min(1, cur / max));
}

function hpBarColor(ratio: number) {
  if (ratio > 0.5) return "var(--color-green)";
  if (ratio > 0.25) return "#8A5A1E";
  return "var(--color-crimson)";
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

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 6;

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
  onSelectToken,
  onOpenMonsterSheet,
  onOpenCharacterSheet,
  onDropCharacter,
  placeOnSecretLayer = false,
  draggingTokenIdsRef,
}: GameBoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<{
    kind: "drawing" | "effect";
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
  const [effectStart, setEffectStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [effectPreview, setEffectPreview] = useState<{
    x: number;
    y: number;
    radius: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ w: 1, h: 1 });
  const [fieldDrafts, setFieldDrafts] = useState<Record<string, string>>({});
  const [isPanning, setIsPanning] = useState(false);
  const panOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const lastEmitRef = useRef(0);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const fitScaleRef = useRef(1);
  const liveDragRef = useRef<Record<string, { x: number; y: number }>>({});
  const probedMapRef = useRef<string | null>(null);
  zoomRef.current = zoom;
  panRef.current = pan;

  const mapBoard = useMemo(
    () => boardMapForViewer(board, isMaster),
    [board, isMaster]
  );
  const viewTokens = useMemo(
    () => tokensForViewer(board, isMaster),
    [board, isMaster]
  );
  const sceneBoard = useMemo(
    () => ({ ...mapBoard, tokens: viewTokens }),
    [mapBoard, viewTokens]
  );
  const gridSize = mapBoard.gridSize || 50;
  const mPerSquare = metersPerSquareOf(mapBoard);
  const world = worldSizeOf(mapBoard);
  const fitScale = Math.min(
    viewportSize.w / world.width,
    viewportSize.h / world.height
  );
  const displayScale = fitScale * zoom;
  fitScaleRef.current = fitScale;
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
    const scale = fitScaleRef.current * zoomRef.current;
    const p = panRef.current;
    return {
      x: (event.clientX - rect.left - p.x) / scale,
      y: (event.clientY - rect.top - p.y) / scale,
    };
  }

  function centerPanForZoom(nextZoom: number) {
    const scale = fitScaleRef.current * nextZoom;
    setPan({
      x: (viewportSize.w - world.width * scale) / 2,
      y: (viewportSize.h - world.height * scale) / 2,
    });
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

  function canDeleteAnnotation(byUserId?: number) {
    return isMaster || byUserId === currentUserId;
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
        const drawing = board.drawings.find((item) => item.id === id);
        if (!drawing || !canDeleteAnnotation(drawing.byUserId)) return;
        onChangeBoard({
          ...board,
          drawings: board.drawings.filter((item) => item.id !== id),
        });
      } else {
        const effect = board.effects.find((item) => item.id === id);
        if (!effect || !canDeleteAnnotation(effect.byUserId)) return;
        onChangeBoard({
          ...board,
          effects: board.effects.filter((item) => item.id !== id),
        });
      }
      setSelectedAnnotation(null);
      return;
    }

    if (selectedIds.length === 0) return;
    const removable = viewTokens.filter((token) => {
      if (!selectedIds.includes(token.id)) return false;
      return isMaster || token.ownerUserId === currentUserId;
    });
    if (removable.length === 0) return;
    const removeIds = new Set(removable.map((token) => token.id));
    onChangeBoard({
      ...board,
      tokens: board.tokens.filter((token) => !removeIds.has(token.id)),
    });
    setSelection([]);
  }

  function adjustZoom(next: number, anchor?: { x: number; y: number }) {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    if (!viewportRef.current) {
      setZoom(clamped);
      return;
    }
    const rect = viewportRef.current.getBoundingClientRect();
    const ax = anchor?.x ?? rect.width / 2;
    const ay = anchor?.y ?? rect.height / 2;
    const fit = fitScaleRef.current;
    const worldX = (ax - pan.x) / (fit * zoom);
    const worldY = (ay - pan.y) / (fit * zoom);
    setZoom(clamped);
    setPan({
      x: ax - worldX * fit * clamped,
      y: ay - worldY * fit * clamped,
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
    if (zoom !== 1) return;
    const scale = Math.min(
      viewportSize.w / world.width,
      viewportSize.h / world.height
    );
    setPan({
      x: (viewportSize.w - world.width * scale) / 2,
      y: (viewportSize.h - world.height * scale) / 2,
    });
  }, [world.width, world.height, viewportSize.w, viewportSize.h, zoom]);

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
        adjustZoom(zoom + 0.15);
      }
      if (event.key === "-" || event.key === "_") {
        adjustZoom(zoom - 0.15);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, selectedIds, selectedAnnotation, tokenLayerMenu, isMaster, zoom, pan]);

  const dragTokenIdsRef = useRef(dragTokenIds);
  const dragOriginRef = useRef(dragOrigin);
  const dragStartsRef = useRef(dragStarts);
  const boardTokensRef = useRef(board.tokens);
  const viewTokensRef = useRef(viewTokens);
  const isPanningFlagRef = useRef(isPanning);
  const marqueeRef = useRef(marquee);
  const toolRef = useRef(tool);
  const gridSizeRef = useRef(gridSize);
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
        const moves = activeDragIds.map((id) => {
          const live = liveDragRef.current[id];
          const token = boardTokensRef.current.find((item) => item.id === id);
          const x = snapToGrid(live?.x ?? token?.x ?? 0, g);
          const y = snapToGrid(live?.y ?? token?.y ?? 0, g);
          return { tokenId: id, x, y };
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
        // Mantém bloqueio de eco um instante após o drop (pacotes atrasados).
        window.setTimeout(() => {
          draggingTokenIdsRef?.current.clear();
        }, 200);
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
      const snappedX = snapToGrid(point.x, gridSize);
      const snappedY = snapToGrid(point.y, gridSize);
      onChangeBoard({
        ...board,
        tokens: board.tokens.map((token) => {
          if (!movers.some((item) => item.id === token.id)) return token;
          return { ...token, x: snappedX, y: snappedY };
        }),
      });
      return;
    }

    if (tool === "select" && isMaster && event.shiftKey) {
      setSelection([]);
      setMarquee({ x1: point.x, y1: point.y, x2: point.x, y2: point.y });
      return;
    }

    if (tool === "select") {
      setSelection([]);
      setSelectedAnnotation(null);
      return;
    }

    if (tool === "draw" && canAnnotate) {
      setDrawPoints([point]);
      return;
    }

    if (tool === "ruler") {
      setRulerStart(point);
      setRulerPreview(point);
      return;
    }

    if (tool === "effect" && canAnnotate) {
      setEffectStart(point);
      setEffectPreview({ x: point.x, y: point.y, radius: 0 });
    }
  }

  function handleBoardPointerMove(event: React.PointerEvent) {
    const point = localPoint(event);
    if (tool === "draw" && drawPoints.length > 0 && canAnnotate) {
      setDrawPoints((prev) => [...prev, point]);
    }
    if (tool === "ruler" && rulerStart) {
      setRulerPreview(point);
    }
    if (tool === "effect" && effectStart) {
      const radius = Math.max(
        4,
        Math.sqrt(
          (point.x - effectStart.x) ** 2 + (point.y - effectStart.y) ** 2
        )
      );
      setEffectPreview({ x: effectStart.x, y: effectStart.y, radius });
    }
  }

  function handleBoardPointerUp() {
    if (tool === "draw" && drawPoints.length > 1 && canAnnotate) {
      onChangeBoard({
        ...board,
        drawings: [
          ...board.drawings,
          {
            id: uid("draw"),
            points: drawPoints,
            color: "var(--color-crimson)",
            width: 3,
            byUserId: currentUserId,
            secret: placeOnSecretLayer && isMaster ? true : undefined,
          },
        ],
      });
    }
    setDrawPoints([]);

    if (tool === "ruler" && rulerStart && rulerPreview) {
      onRuler(rulerStart, rulerPreview);
    }
    setRulerStart(null);
    setRulerPreview(null);

    if (tool === "effect" && effectStart && effectPreview && canAnnotate) {
      const meters =
        Math.round((effectPreview.radius / gridSize) * mPerSquare * 10) / 10;
      if (effectPreview.radius >= 8) {
        const effect: BoardEffect = {
          id: uid("fx"),
          x: effectPreview.x,
          y: effectPreview.y,
          radius: effectPreview.radius,
          meters,
          color: "rgba(122,37,48,0.35)",
          label: formatMeters(meters),
          byUserId: currentUserId,
          secret: placeOnSecretLayer && isMaster ? true : undefined,
        };
        onChangeBoard({
          ...board,
          effects: [...board.effects, effect],
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
    const delta = event.deltaY > 0 ? -0.12 : 0.12;
    adjustZoom(zoom + delta, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  const previewMeters =
    rulerStart && rulerPreview
      ? distanceMeters(rulerStart, rulerPreview, gridSize, mPerSquare)
      : effectPreview
        ? Math.round((effectPreview.radius / gridSize) * mPerSquare * 10) / 10
        : null;

  return (
    <div
      className="relative h-full min-h-0 w-full overflow-hidden border"
      style={{
        borderColor: "var(--color-border-strong)",
        backgroundColor: "#1A140F",
        minHeight: 420,
      }}
    >
      <div className="absolute right-2 top-2 z-30 flex items-center gap-1">
        <button
          type="button"
          className="h-8 w-8 border text-sm text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.85)",
            borderColor: "var(--color-border-strong)",
          }}
          onClick={() => adjustZoom(zoom - 0.15)}
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
          onClick={() => {
            setZoom(1);
            centerPanForZoom(1);
          }}
          title="Enquadrar mapa"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="h-8 w-8 border text-sm text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.85)",
            borderColor: "var(--color-border-strong)",
          }}
          onClick={() => adjustZoom(zoom + 0.15)}
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
          onDropCharacter(
            characterId,
            snapToGrid(point.x, gridSize),
            snapToGrid(point.y, gridSize)
          );
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

          <svg className="absolute inset-0 h-full w-full overflow-visible">
            {mapBoard.effects
              .filter((effect) => isMaster || !effect.secret)
              .map((effect) => {
              const selected =
                selectedAnnotation?.kind === "effect" &&
                selectedAnnotation.id === effect.id;
              return (
              <g key={effect.id}>
                <circle
                  cx={effect.x}
                  cy={effect.y}
                  r={effect.radius}
                  fill={effect.color}
                  stroke={selected ? "#C09A5A" : "var(--color-crimson)"}
                  strokeWidth={selected ? 3 : 2}
                  style={{ cursor: tool === "select" ? "pointer" : "default" }}
                  onPointerDown={(event) => {
                    if (tool !== "select") return;
                    event.stopPropagation();
                    setSelection([]);
                    setSelectedAnnotation({ kind: "effect", id: effect.id });
                  }}
                />
                {effect.meters != null && (
                  <text
                    x={effect.x}
                    y={effect.y - effect.radius - 6}
                    fill="var(--color-ink-inverse)"
                    fontSize="11"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {formatMeters(effect.meters)}
                  </text>
                )}
              </g>
            );
            })}
            {mapBoard.drawings
              .filter((drawing) => isMaster || !drawing.secret)
              .map((drawing) => {
              const selected =
                selectedAnnotation?.kind === "drawing" &&
                selectedAnnotation.id === drawing.id;
              return (
              <polyline
                key={drawing.id}
                points={drawing.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={selected ? "#C09A5A" : drawing.color}
                strokeWidth={selected ? drawing.width + 2 : drawing.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ cursor: tool === "select" ? "pointer" : "default" }}
                onPointerDown={(event) => {
                  if (tool !== "select") return;
                  event.stopPropagation();
                  setSelection([]);
                  setSelectedAnnotation({ kind: "drawing", id: drawing.id });
                }}
              />
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
            {mapBoard.rulers.map((ruler) => {
              const legacyFeet = (ruler as BoardRuler & { feet?: number }).feet;
              const meters =
                typeof ruler.meters === "number"
                  ? ruler.meters
                  : typeof legacyFeet === "number"
                    ? Math.round(legacyFeet * 0.3 * 10) / 10
                    : 0;
              return (
                <g key={ruler.id} className="pointer-events-none">
                  <line
                    x1={ruler.from.x}
                    y1={ruler.from.y}
                    x2={ruler.to.x}
                    y2={ruler.to.y}
                    stroke="var(--color-parchment)"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  <text
                    x={(ruler.from.x + ruler.to.x) / 2}
                    y={(ruler.from.y + ruler.to.y) / 2 - 8}
                    fill="var(--color-parchment)"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {formatMeters(meters)}
                  </text>
                </g>
              );
            })}
            {rulerStart && rulerPreview && (
              <g>
                <line
                  x1={rulerStart.x}
                  y1={rulerStart.y}
                  x2={rulerPreview.x}
                  y2={rulerPreview.y}
                  stroke="var(--color-ink-inverse)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <text
                  x={(rulerStart.x + rulerPreview.x) / 2}
                  y={(rulerStart.y + rulerPreview.y) / 2 - 8}
                  fill="var(--color-ink-inverse)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {formatMeters(previewMeters ?? 0)}
                </text>
              </g>
            )}
            {effectPreview && effectPreview.radius > 0 && (
              <g>
                <circle
                  cx={effectPreview.x}
                  cy={effectPreview.y}
                  r={effectPreview.radius}
                  fill="rgba(192,154,90,0.25)"
                  stroke="#C09A5A"
                  strokeWidth={2}
                />
                <text
                  x={effectPreview.x}
                  y={effectPreview.y - effectPreview.radius - 6}
                  fill="var(--color-ink-inverse)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {formatMeters(previewMeters ?? 0)}
                </text>
              </g>
            )}
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
            const ratio = hpRatio(token);
            const showHp =
              typeof token.hpMax === "number" ||
              typeof token.hpCurrent === "number";
            const dragging = dragTokenIds.includes(token.id);
            const span = size / gridSize;

            const inset = Math.max(2, Math.round(gridSize * 0.08));
            const body = Math.max(8, size - inset * 2);
            /** Controles (PV / status) proporcionais ao círculo do token. */
            const controlSize = Math.max(
              16,
              Math.min(48, Math.round(body * 0.45))
            );
            const controlFont = Math.max(
              8,
              Math.min(16, Math.round(controlSize * 0.36))
            );
            const controlIcon = Math.max(10, Math.round(controlSize * 0.5));
            const controlGap = Math.max(2, Math.round(controlSize * 0.12));
            const conditionBadge = Math.max(
              12,
              Math.min(28, Math.round(body * 0.3))
            );
            const conditionIcon = Math.max(
              7,
              Math.round(conditionBadge * 0.58)
            );
            const nameFont = Math.max(9, Math.min(14, Math.round(body * 0.22)));
            const controlsTop = showHp
              ? -inset - controlSize - Math.round(controlSize * 0.35) - 8
              : -inset - controlSize - Math.round(controlSize * 0.2);

            return (
              <div
                key={token.id}
                data-token="true"
                className="absolute overflow-visible"
                style={{
                  left: token.x,
                  top: token.y,
                  width: size,
                  height: size,
                  zIndex: selected || dragging ? 20 : 10,
                  transition: dragging
                    ? "none"
                    : "left 50ms linear, top 50ms linear",
                  willChange: dragging ? "left, top" : undefined,
                }}
              >
                {showHp && (
                  <div
                    className="absolute left-0 right-0 overflow-hidden border"
                    style={{
                      top: -inset - Math.max(4, Math.round(body * 0.08)),
                      height: Math.max(3, Math.round(body * 0.06)),
                      borderColor: "var(--color-parchment)",
                      backgroundColor: "var(--color-panel)",
                    }}
                    data-token="true"
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${ratio * 100}%`,
                        backgroundColor: hpBarColor(ratio),
                      }}
                    />
                  </div>
                )}

                {selected &&
                  selectedIds.length === 1 &&
                  canEditTokenFields(token) && (
                  <div
                    className="absolute left-1/2 z-40 flex -translate-x-1/2 items-center"
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
                          }
                        }}
                        onBlur={() => {
                          const raw = (fieldDrafts[draftKey] ?? value).trim();
                          setFieldDrafts((prev) => {
                            const next = { ...prev };
                            delete next[draftKey];
                            return next;
                          });
                          if (field === "customValue") return;
                          if (raw === "") {
                            updateTokenFields(token.id, { [field]: undefined } as Partial<BoardToken>);
                            return;
                          }
                          if (/^[+-]\d+$/.test(raw)) {
                            const base =
                              field === "hpCurrent"
                                ? (token.hpCurrent ?? token.hpMax ?? 0)
                                : (token.hpMax ?? 0);
                            updateTokenFields(token.id, {
                              [field]: Math.max(0, base + Number(raw)),
                            } as Partial<BoardToken>);
                            return;
                          }
                          const num = Number(raw);
                          if (Number.isNaN(num)) return;
                          updateTokenFields(token.id, {
                            [field]: Math.max(0, num),
                          } as Partial<BoardToken>);
                        }}
                        className="rounded-full border-2 text-center font-semibold outline-none"
                        style={{
                          width: controlSize,
                          height: controlSize,
                          fontSize: controlFont,
                          borderColor: border,
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-ink)",
                        }}
                        title={
                          field === "hpMax"
                            ? "PV máximo (use +10 / -10)"
                            : field === "hpCurrent"
                              ? "PV atual (use +10 / -10)"
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
                    setSelection([token.id]);
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
                  className="absolute flex items-center justify-center overflow-hidden border-2 font-semibold text-[var(--color-ink-inverse)] shadow"
                  style={{
                    left: inset,
                    top: inset,
                    width: body,
                    height: body,
                    borderRadius: span <= 1 ? "9999px" : "10%",
                    backgroundColor: token.color,
                    borderColor: selected
                      ? "#C09A5A"
                      : token.borderColor || "var(--color-parchment)",
                    boxShadow: selected
                      ? "0 0 0 2px #7A2530"
                      : token.borderColor
                        ? `0 0 0 1px ${token.borderColor}`
                        : undefined,
                    opacity: token.secret ? 0.75 : 1,
                    outline: token.secret ? "1px dashed #C09A5A" : undefined,
                    fontFamily: "'Cinzel', serif",
                    fontSize: nameFont,
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

                {(token.conditions ?? []).length > 0 && (
                  <div
                    className="pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 flex-nowrap items-center justify-center"
                    style={{
                      top: size + inset * 0.25 + Math.round(conditionBadge * 0.35),
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

                <div
                  className="pointer-events-none absolute left-1/2 truncate text-center font-medium text-[var(--color-ink-inverse)]"
                  style={{
                    top: size + inset * 0.25,
                    width: size + Math.round(body * 0.4),
                    transform: "translateX(-50%)",
                    fontSize: nameFont,
                    textShadow: "0 1px 2px #1A140F",
                  }}
                >
                  {token.name}
                </div>
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
          const menuWidth = 180;
          const menuHeight = 96;
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
              className="fixed z-[60] min-w-[11rem] border-2 py-1 shadow-xl"
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
                Camada — {menuToken.name}
              </p>
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
          className="absolute bottom-2 left-2 z-40 max-w-[min(96vw,28rem)] rounded border px-2 py-1 text-[11px] text-[var(--color-ink-inverse)]"
          style={{
            backgroundColor: "rgba(26,20,15,0.92)",
            borderColor: "var(--color-border-strong)",
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {selectedAnnotation ? (
              <span>
                {selectedAnnotation.kind === "effect" ? "Marcação" : "Desenho"}{" "}
                selecionado
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
                  ` · PV ${selectedToken.hpCurrent}/${selectedToken.hpMax}`}
              </span>
            )}
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
                Delete
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
