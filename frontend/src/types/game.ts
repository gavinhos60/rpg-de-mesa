export type BoardToken = {
  id: string;
  kind: "pc" | "npc";
  name: string;
  x: number;
  y: number;
  color: string;
  /** Cor da borda do token (jogador pode personalizar a própria). */
  borderColor?: string;
  characterId?: number;
  monsterId?: string;
  ownerUserId?: number;
  /**
   * Lado em quadrados (D&D 5e):
   * 1 = Pequeno/Médio (1 quad), 2 = Grande (4), 3 = Enorme (9), 4 = Imenso (16).
   */
  gridSpan?: number;
  /** Categoria de tamanho D&D (para recalcular o footprint). */
  sizeCategory?: "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";
  /** @deprecated use gridSpan × gridSize; mantido para sessões antigas. */
  size?: number;
  meta?: string;
  /** URL da imagem do token (monstro / avatar). */
  imageUrl?: string;
  hpMax?: number;
  hpCurrent?: number;
  /** Campo livre do mestre (círculo do meio). */
  customValue?: string;
  /** IDs de condições D&D 5e ativas no token. */
  conditions?: string[];
  /** Só o mestre vê (camada secreta). */
  secret?: boolean;
  /**
   * Token permanece no cenário dos jogadores (mapa antigo)
   * quando o mestre troca de mapa sem levá-lo.
   */
  onPlayerScene?: boolean;
  /** Mapa (URL) onde o token está posicionado. Ausente = mapa ativo na criação. */
  sceneMapUrl?: string;
};

export type BoardDrawing = {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
  byUserId?: number;
  /** Só o mestre vê (camada secreta). */
  secret?: boolean;
};

export type MeasureShape =
  | "line"
  | "square"
  | "circle"
  | "cone"
  | "beam"
  | "ping";

export type BoardRuler = {
  id: string;
  /** Forma da medição (padrão: linha). */
  shape?: MeasureShape;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Distância em metros. */
  meters: number;
  /** Distância em quadrados (D&D 5e / Roll20). */
  squares?: number;
  byUserId: number;
  /** Nome de quem está medindo (exibição estilo Roll20). */
  byUserName?: string;
  /** Cor da marcação (hex). */
  color?: string;
  /** Pré-visualização ao vivo — não persiste. */
  live?: boolean;
};

export type BoardEffect = {
  id: string;
  x: number;
  y: number;
  /** Raio em pixels do mapa. */
  radius: number;
  /** Raio em metros (para exibição). */
  meters?: number;
  color: string;
  label?: string;
  byUserId?: number;
  byUserName?: string;
  /** Só o mestre vê (camada secreta). */
  secret?: boolean;
  /** Ping estilo Roll20: respirar / feixe / foguete / queimar / brilho. */
  fxKind?: "breathe" | "beam" | "rocket" | "burn" | "glow";
  fxElement?:
    | "fire"
    | "charm"
    | "acid"
    | "death"
    | "holy"
    | "blood"
    | "frost"
    | "slime"
    | "smoke"
    | "water"
    | "magic";
  /** Extremidade do feixe/foguete. */
  toX?: number;
  toY?: number;
  /** Ping transitório (epoch ms) — clientes removem após expirar. */
  expiresAt?: number;
};

export type PreparedMap = {
  id: string;
  name: string;
  mapUrl: string;
  /** Largura em quadrados da grade. */
  mapWidth?: number;
  /** Altura em quadrados da grade. */
  mapHeight?: number;
  gridSize?: number;
  metersPerSquare?: number;
  gridType?: "square" | "hex";
};

/**
 * Cenário que os jogadores continuam vendo quando o mestre
 * troca de mapa sem levá-los junto.
 */
export type PlayerMapView = {
  mapUrl: string;
  mapWidth?: number;
  mapHeight?: number;
  gridSize?: number;
  metersPerSquare?: number;
  gridType?: "square" | "hex";
  drawings?: BoardDrawing[];
  effects?: BoardEffect[];
  rulers?: BoardRuler[];
};

export type BoardState = {
  mapUrl: string;
  /**
   * Largura do mapa em quadrados da grade (não pixels).
   * Mundo em pixels = mapWidth × gridSize.
   */
  mapWidth?: number;
  /**
   * Altura do mapa em quadrados da grade (não pixels).
   * Mundo em pixels = mapHeight × gridSize.
   */
  mapHeight?: number;
  /** Tamanho do quadrado da grade em pixels (só para render). */
  gridSize: number;
  /** Formato da grade: quadrado (padrão) ou hexagonal. */
  gridType?: "square" | "hex";
  /** Metros por quadrado (padrão D&D 5e = 1,5 m; hex = 10 km). */
  metersPerSquare: number;
  /** @deprecated mantido para sessões antigas; migrado para metersPerSquare. */
  feetPerSquare?: number;
  tokens: BoardToken[];
  drawings: BoardDrawing[];
  rulers: BoardRuler[];
  effects: BoardEffect[];
  /** Mapa escuro: jogadores só veem a luz atual dos próprios personagens. */
  fogEnabled?: boolean;
  /** Raio de visão padrão em quadrados (fallback). */
  visionRadiusSquares?: number;
  /** Raio de visão por jogador (userId → quadrados). */
  visionByUserId?: Record<string, number>;
  /** Usuários que veem o mapa inteiro mesmo com escuridão ativa. */
  fogExemptUserIds?: number[];
  /** Mapas salvos pelo mestre para troca rápida. */
  preparedMaps?: PreparedMap[];
  /**
   * Se definido, jogadores renderizam este mapa em vez do mapa atual do mestre.
   * `null` limpa a trava (todos acompanham o cenário atual).
   * @deprecated preferir `playerViewsByUserId` (por jogador).
   */
  playerMapView?: PlayerMapView | null;
  /**
   * Mapa congelado por jogador (userId → view).
   * Ausente = jogador acompanha o mapa ativo do mestre (câmera + tokens).
   */
  playerViewsByUserId?: Record<string, PlayerMapView>;
};

export type ChatRollPart = {
  label?: string;
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
};

export type ChatMessage = {
  id: string;
  at: number;
  userId: number;
  userName: string;
  type: "text" | "roll" | "system";
  text: string;
  roll?: ChatRollPart & {
    parts?: ChatRollPart[];
  };
  /** Só o mestre vê (ex.: rolagem de token na camada secreta). */
  secret?: boolean;
};

export type SessionRuntimeState = {
  board: BoardState;
  chat: ChatMessage[];
  /** Ordem de iniciativa / relógio de turnos (mestre controla). */
  combat?: CombatState | null;
};

export type CombatantEntry = {
  id: string;
  name: string;
  initiative: number;
  /** Face natural do d20 (20 = primeiro, 1 = último, independente do modificador). */
  natural?: number;
  kind: "character" | "monster" | "other";
  characterId?: number | null;
  tokenId?: string | null;
  userId?: number | null;
  /** Combatente de token na camada secreta — oculto aos jogadores. */
  secret?: boolean;
};

export type CombatState = {
  active: boolean;
  collecting: boolean;
  round: number;
  currentIndex: number;
  order: CombatantEntry[];
};

export type InitiativeRequest = {
  id: string;
  at: number;
  fromUserId: number;
  targetCharacterId: number | null;
  characterName: string | null;
  targetUserId: number | null;
};

export function emptyCombatState(): CombatState {
  return {
    active: false,
    collecting: false,
    round: 1,
    currentIndex: 0,
    order: [],
  };
}


export type GameSessionSummary = {
  id: number;
  campaignId: number;
  status: "ACTIVE" | "CLOSED";
  roomCode: string;
  state?: SessionRuntimeState | null;
  campaign?: { id: number; name: string };
  startedBy?: { id: number; name: string; email: string };
};

export type CheckRequest = {
  id: string;
  at: number;
  type: "skill" | "ability";
  key: string;
  label: string;
  /** Personagem alvo (null = todos da mesa). */
  targetCharacterId: number | null;
  characterName: string | null;
  /** Usuário dono do personagem (roteamento do prompt). */
  targetUserId: number | null;
  fromUserId: number;
};

export type CampaignCharacterLite = {
  id: number;
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string | null;
  sheet?: unknown;
  playerId: number;
  player?: { id: number; name: string; email: string };
};

/** Mundo padrão em quadrados quando o mestre ainda não definiu o tamanho. */
export const DEFAULT_MAP_COLS = 40;
export const DEFAULT_MAP_ROWS = 30;
/** @deprecated use DEFAULT_MAP_COLS/ROWS × gridSize */
export const DEFAULT_WORLD_WIDTH = DEFAULT_MAP_COLS * 50;
export const DEFAULT_WORLD_HEIGHT = DEFAULT_MAP_ROWS * 50;
/** Padrão D&D 5e: 1 quadrado = 5 ft ≈ 1,5 m. */
export const DEFAULT_METERS_PER_SQUARE = 1.5;
/** Hexágono: 1 célula = 10 km. */
export const DEFAULT_HEX_METERS = 10_000;
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_VISION_RADIUS_SQUARES = 3;

export function gridTypeOf(board: { gridType?: string | null }): "square" | "hex" {
  return board.gridType === "hex" ? "hex" : "square";
}

/**
 * Converte valor legado (pixels) para quadrados quando necessário.
 * Sessões antigas gravavam mapWidth/Height em px (> ~200).
 */
export function mapSquaresOf(board: BoardState): {
  cols: number;
  rows: number;
} {
  const grid = board.gridSize || DEFAULT_GRID_SIZE;
  let cols = board.mapWidth;
  let rows = board.mapHeight;
  if (typeof cols === "number" && cols > 200) {
    cols = Math.max(1, Math.round(cols / grid));
  }
  if (typeof rows === "number" && rows > 200) {
    rows = Math.max(1, Math.round(rows / grid));
  }
  return {
    cols: typeof cols === "number" && cols > 0 ? cols : DEFAULT_MAP_COLS,
    rows: typeof rows === "number" && rows > 0 ? rows : DEFAULT_MAP_ROWS,
  };
}

/** Tamanho do mundo em pixels = quadrados × gridSize (só para render). */
export function worldSizeOf(board: BoardState): {
  width: number;
  height: number;
} {
  const grid = board.gridSize || DEFAULT_GRID_SIZE;
  const { cols, rows } = mapSquaresOf(board);
  return {
    width: cols * grid,
    height: rows * grid,
  };
}

/** Congela o cenário atual para os jogadores permanecerem nele. */
export function snapshotPlayerMapView(board: BoardState): PlayerMapView {
  return {
    mapUrl: board.mapUrl,
    mapWidth: board.mapWidth,
    mapHeight: board.mapHeight,
    gridSize: board.gridSize,
    metersPerSquare: metersPerSquareOf(board),
    gridType: gridTypeOf(board),
    drawings: board.drawings,
    effects: board.effects,
    rulers: board.rulers,
  };
}

/**
 * Jogador está em mapa congelado (câmera própria, diferente do ativo).
 */
export function playerIsOnFrozenScene(
  board: BoardState,
  userId: number
): boolean {
  if (board.playerViewsByUserId?.[String(userId)]) return true;
  // Legado: um único playerMapView para todos os não-mestres.
  if (
    board.playerMapView &&
    (!board.playerViewsByUserId ||
      Object.keys(board.playerViewsByUserId).length === 0)
  ) {
    return true;
  }
  return false;
}

function applyPlayerMapView(
  board: BoardState,
  view: PlayerMapView
): BoardState {
  return {
    ...board,
    mapUrl: view.mapUrl,
    mapWidth: view.mapWidth,
    mapHeight: view.mapHeight,
    gridSize: view.gridSize ?? board.gridSize,
    metersPerSquare: view.metersPerSquare ?? board.metersPerSquare,
    gridType: view.gridType ?? board.gridType,
    drawings: view.drawings ?? [],
    effects: view.effects ?? [],
    rulers: view.rulers ?? [],
  };
}

/**
 * Mapa que o cliente deve renderizar.
 * Mestre: mapa ativo (ou inspeção do congelado).
 * Jogador: view própria se foi deixado para trás; senão acompanha o mestre.
 */
export function boardMapForViewer(
  board: BoardState,
  isMaster: boolean,
  options?: { watchPlayerScene?: boolean; currentUserId?: number }
): BoardState {
  const views = board.playerViewsByUserId ?? {};
  const viewList = Object.values(views);

  if (isMaster && options?.watchPlayerScene) {
    const view = viewList[0] ?? board.playerMapView ?? null;
    if (view) return applyPlayerMapView(board, view);
  }
  if (isMaster) return board;

  const uid = options?.currentUserId;
  if (uid != null && views[String(uid)]) {
    return applyPlayerMapView(board, views[String(uid)]);
  }
  // Legado: playerMapView global.
  if (
    board.playerMapView &&
    viewList.length === 0 &&
    playerIsOnFrozenScene(board, uid ?? -1)
  ) {
    return applyPlayerMapView(board, board.playerMapView);
  }
  return board;
}

/** Grava anotações no cenário que o jogador está vendo (ativo ou congelado). */
export function withAnnotationsOnViewerScene(
  board: BoardState,
  userId: number,
  patch: {
    drawings?: BoardState["drawings"];
    effects?: BoardState["effects"];
    rulers?: BoardState["rulers"];
  }
): BoardState {
  if (!playerIsOnFrozenScene(board, userId)) {
    return {
      ...board,
      ...(patch.drawings ? { drawings: patch.drawings } : {}),
      ...(patch.effects ? { effects: patch.effects } : {}),
      ...(patch.rulers ? { rulers: patch.rulers } : {}),
    };
  }

  const key = String(userId);
  const views = board.playerViewsByUserId ?? {};
  const current =
    views[key] ??
    (board.playerMapView && Object.keys(views).length === 0
      ? board.playerMapView
      : null);
  if (!current) {
    return {
      ...board,
      ...(patch.drawings ? { drawings: patch.drawings } : {}),
      ...(patch.effects ? { effects: patch.effects } : {}),
      ...(patch.rulers ? { rulers: patch.rulers } : {}),
    };
  }

  const nextView: PlayerMapView = {
    ...current,
    ...(patch.drawings ? { drawings: patch.drawings } : {}),
    ...(patch.effects ? { effects: patch.effects } : {}),
    ...(patch.rulers ? { rulers: patch.rulers } : {}),
  };

  return {
    ...board,
    playerViewsByUserId: {
      ...views,
      [key]: nextView,
    },
  };
}

/** Remove só as anotações do userId no mapa ativo e na view congelada dele. */
export function clearOwnAnnotations(
  board: BoardState,
  userId: number
): BoardState {
  const uid = Number(userId);
  const keep = <T extends { byUserId?: number }>(items: T[]) =>
    items.filter((item) => Number(item.byUserId) !== uid);

  let next: BoardState = {
    ...board,
    drawings: keep(board.drawings),
    effects: keep(board.effects),
    rulers: keep(board.rulers),
  };

  const key = String(uid);
  const views = { ...(next.playerViewsByUserId ?? {}) };
  const mine = views[key];
  if (mine) {
    views[key] = {
      ...mine,
      drawings: keep(mine.drawings ?? []),
      effects: keep(mine.effects ?? []),
      rulers: keep(mine.rulers ?? []),
    };
    next = { ...next, playerViewsByUserId: views };
  } else if (
    next.playerMapView &&
    Object.keys(views).length === 0
  ) {
    next = {
      ...next,
      playerMapView: {
        ...next.playerMapView,
        drawings: keep(next.playerMapView.drawings ?? []),
        effects: keep(next.playerMapView.effects ?? []),
        rulers: keep(next.playerMapView.rulers ?? []),
      },
    };
  }

  return next;
}

export function resolveTokenSceneMapUrl(
  token: BoardToken,
  activeMapUrl: string
): string {
  const pinned = token.sceneMapUrl?.trim();
  if (pinned) return pinned;
  if (token.onPlayerScene) return "";
  return activeMapUrl;
}

/** NPC/monstro permanece no mapa onde foi colocado ao trocar de cenário. */
export function npcTokenAfterSceneChange(
  token: BoardToken,
  oldMapUrl: string,
  nextMapUrl: string,
  hasFrozen: boolean
): BoardToken {
  const pinned = resolveTokenSceneMapUrl(token, oldMapUrl);
  if (nextMapUrl === pinned) {
    return { ...token, sceneMapUrl: pinned, onPlayerScene: undefined };
  }
  if (!token.sceneMapUrl?.trim() && oldMapUrl && nextMapUrl !== oldMapUrl) {
    return {
      ...token,
      sceneMapUrl: oldMapUrl,
      onPlayerScene: hasFrozen ? true : undefined,
    };
  }
  return {
    ...token,
    sceneMapUrl: pinned,
    onPlayerScene:
      pinned !== nextMapUrl && hasFrozen ? true : undefined,
  };
}

function frozenSceneMapUrls(board: BoardState): Set<string> {
  const urls = new Set<string>();
  for (const view of Object.values(board.playerViewsByUserId ?? {})) {
    if (view.mapUrl) urls.add(view.mapUrl);
  }
  if (
    board.playerMapView?.mapUrl &&
    Object.keys(board.playerViewsByUserId ?? {}).length === 0
  ) {
    urls.add(board.playerMapView.mapUrl);
  }
  return urls;
}

/** Repara sessões antigas (tokens invisíveis após troca de mapa). */
export function normalizeBoardState(board: BoardState): BoardState {
  const activeMapUrl = board.mapUrl ?? "";
  const frozenUrls = frozenSceneMapUrls(board);
  const legacyFrozenUrl =
    frozenUrls.size === 1 ? [...frozenUrls][0] : undefined;

  const tokens = board.tokens.map((token) => {
    if (token.sceneMapUrl?.trim()) return token;
    if (token.onPlayerScene) {
      if (legacyFrozenUrl) {
        return { ...token, sceneMapUrl: legacyFrozenUrl };
      }
      return {
        ...token,
        onPlayerScene: undefined,
        sceneMapUrl: activeMapUrl || undefined,
      };
    }
    return {
      ...token,
      sceneMapUrl: activeMapUrl || token.sceneMapUrl,
    };
  });

  return { ...board, tokens };
}

function tokensOnMap(
  board: BoardState,
  mapUrl: string,
  activeMapUrl: string
): BoardToken[] {
  return board.tokens.filter((token) => {
    const scene = resolveTokenSceneMapUrl(token, activeMapUrl);
    if (!scene) return Boolean(token.onPlayerScene);
    return scene === mapUrl;
  });
}

/** Tokens visíveis no cenário atual do espectador. */
export function tokensForViewer(
  board: BoardState,
  isMaster: boolean,
  options?: { watchPlayerScene?: boolean; currentUserId?: number }
): BoardToken[] {
  const activeMapUrl = board.mapUrl ?? "";
  const views = board.playerViewsByUserId ?? {};
  const hasPerUser = Object.keys(views).length > 0;
  const hasLegacy = Boolean(board.playerMapView) && !hasPerUser;
  const hasFrozen = hasPerUser || hasLegacy;

  if (!hasFrozen) {
    return tokensOnMap(board, activeMapUrl, activeMapUrl);
  }

  if (isMaster) {
    if (options?.watchPlayerScene) {
      const frozenUrls = frozenSceneMapUrls(board);
      if (frozenUrls.size === 0) {
        return board.tokens.filter((token) => token.onPlayerScene);
      }
      return board.tokens.filter((token) => {
        const scene = resolveTokenSceneMapUrl(token, activeMapUrl);
        return scene !== "" && frozenUrls.has(scene);
      });
    }
    return tokensOnMap(board, activeMapUrl, activeMapUrl);
  }

  const uid = options?.currentUserId;
  const myView = uid != null ? views[String(uid)] : undefined;

  if (myView || (hasLegacy && uid != null && playerIsOnFrozenScene(board, uid))) {
    const myUrl = myView?.mapUrl ?? board.playerMapView?.mapUrl ?? activeMapUrl;
    return board.tokens.filter((token) => {
      const scene = resolveTokenSceneMapUrl(token, activeMapUrl);
      if (scene !== myUrl) return false;
      if (!hasPerUser) return true;
      if (token.ownerUserId == null) return true;
      const ownerView = views[String(token.ownerUserId)];
      if (!ownerView) return true;
      return ownerView.mapUrl === myUrl;
    });
  }

  return tokensOnMap(board, activeMapUrl, activeMapUrl);
}

export function loadMapImageSize(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      } else {
        reject(new Error("invalid image size"));
      }
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = url;
  });
}

export function emptyBoardState(): BoardState {
  return {
    mapUrl: "",
    mapWidth: DEFAULT_MAP_COLS,
    mapHeight: DEFAULT_MAP_ROWS,
    gridSize: DEFAULT_GRID_SIZE,
    gridType: "square",
    metersPerSquare: DEFAULT_METERS_PER_SQUARE,
    tokens: [],
    drawings: [],
    rulers: [],
    effects: [],
    fogEnabled: false,
    visionRadiusSquares: DEFAULT_VISION_RADIUS_SQUARES,
    fogExemptUserIds: [],
  };
}

export function metersPerSquareOf(board: BoardState): number {
  if (typeof board.metersPerSquare === "number" && board.metersPerSquare > 0) {
    return board.metersPerSquare;
  }
  if (gridTypeOf(board) === "hex") return DEFAULT_HEX_METERS;
  // Sessões antigas usavam feetPerSquare (5 ft ≈ 1,5 m).
  if (typeof board.feetPerSquare === "number" && board.feetPerSquare > 0) {
    return Math.round(board.feetPerSquare * 0.3 * 100) / 100;
  }
  return DEFAULT_METERS_PER_SQUARE;
}

export function formatMeters(value: number): string {
  if (value >= 1000) {
    const km = Math.round((value / 1000) * 10) / 10;
    return Number.isInteger(km) ? `${km} km` : `${km.toFixed(1)} km`;
  }
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} m` : `${rounded.toFixed(1)} m`;
}

/** Âncora no centro do quadrado (snap padrão do Roll20 em mapas com grade). */
export function snapToCellCenter(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  const g = gridSize || DEFAULT_GRID_SIZE;
  return {
    x: Math.floor(x / g) * g + g / 2,
    y: Math.floor(y / g) * g + g / 2,
  };
}

/** Âncora no canto mais próximo da grade. */
export function snapToCellCorner(
  x: number,
  y: number,
  gridSize: number
): { x: number; y: number } {
  const g = gridSize || DEFAULT_GRID_SIZE;
  return {
    x: Math.round(x / g) * g,
    y: Math.round(y / g) * g,
  };
}

export function cellCoords(
  x: number,
  y: number,
  gridSize: number
): { cx: number; cy: number } {
  const g = gridSize || DEFAULT_GRID_SIZE;
  return {
    cx: Math.floor(x / g),
    cy: Math.floor(y / g),
  };
}

/**
 * Distância em quadrados no estilo D&D 5e / Roll20:
 * cada diagonal conta como 1 quadrado (Chebyshev).
 */
export function distanceSquares5e(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gridSize: number
): number {
  const a = cellCoords(from.x, from.y, gridSize);
  const b = cellCoords(to.x, to.y, gridSize);
  return Math.max(Math.abs(a.cx - b.cx), Math.abs(a.cy - b.cy));
}

export function formatMeasureLabel(
  squares: number,
  metersPerSquare: number,
  options?: { hex?: boolean }
): string {
  const meters = Math.round(squares * metersPerSquare * 10) / 10;
  const cellMark = options?.hex ? "⬡" : "□";
  return `${formatMeters(meters)} (${squares}${cellMark})`;
}

export function snapToGrid(value: number, gridSize: number): number {
  const g = gridSize || DEFAULT_GRID_SIZE;
  return Math.round(value / g) * g;
}

/**
 * Pequeno/Médio → 1×1 (1 quad)
 * Grande → 2×2 (4 quads)
 * Enorme → 3×3 (9 quads)
 * Imenso → 4×4 (16 quads)
 */
export function sizeCategoryToSpan(
  size?: string | null
): 1 | 2 | 3 | 4 {
  switch (String(size || "").trim()) {
    case "Large":
    case "Grande":
      return 2;
    case "Huge":
    case "Enorme":
      return 3;
    case "Gargantuan":
    case "Imenso":
      return 4;
    default:
      return 1;
  }
}

export function tokenGridSpan(token: {
  gridSpan?: number;
  sizeCategory?: string;
  size?: number;
}, gridSize = DEFAULT_GRID_SIZE): number {
  if (typeof token.gridSpan === "number" && token.gridSpan >= 1) {
    return Math.min(4, Math.max(1, Math.round(token.gridSpan)));
  }
  if (token.sizeCategory) {
    return sizeCategoryToSpan(token.sizeCategory);
  }
  // Inferência legada: size em px ≈ N × grid
  if (typeof token.size === "number" && gridSize > 0) {
    const approx = Math.round(token.size / gridSize);
    if (approx >= 4) return 4;
    if (approx >= 3) return 3;
    if (approx >= 2) return 2;
  }
  return 1;
}

/** Pixel exato para preencher N×N quadrados da grade. */
export function tokenFootprintPx(
  token: { gridSpan?: number; sizeCategory?: string; size?: number },
  gridSize: number
): number {
  return tokenGridSpan(token, gridSize) * (gridSize || DEFAULT_GRID_SIZE);
}

export function distanceMeters(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gridSize: number,
  metersPerSquare: number
): number {
  const squares = distanceSquares5e(from, to, gridSize);
  return Math.round(squares * metersPerSquare * 10) / 10;
}

/** Células sob uma régua (caminho Chebyshev aproximado, estilo Roll20). */
export function cellsAlongMeasure(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gridSize: number
): Array<{ cx: number; cy: number }> {
  const a = cellCoords(from.x, from.y, gridSize);
  const b = cellCoords(to.x, to.y, gridSize);
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return [{ cx: a.cx, cy: a.cy }];
  const cells: Array<{ cx: number; cy: number }> = [];
  for (let i = 0; i <= steps; i += 1) {
    const cx = a.cx + Math.round((dx * i) / steps);
    const cy = a.cy + Math.round((dy * i) / steps);
    const prev = cells[cells.length - 1];
    if (!prev || prev.cx !== cx || prev.cy !== cy) {
      cells.push({ cx, cy });
    }
  }
  return cells;
}

/** Células cobertas por um círculo (centro do quadrado dentro do raio). */
export function cellsInRadius(
  center: { x: number; y: number },
  radiusPx: number,
  gridSize: number
): Array<{ cx: number; cy: number }> {
  const g = gridSize || DEFAULT_GRID_SIZE;
  const origin = cellCoords(center.x, center.y, g);
  const reach = Math.ceil(radiusPx / g) + 1;
  const cells: Array<{ cx: number; cy: number }> = [];
  for (let cy = origin.cy - reach; cy <= origin.cy + reach; cy += 1) {
    for (let cx = origin.cx - reach; cx <= origin.cx + reach; cx += 1) {
      const cellCenterX = cx * g + g / 2;
      const cellCenterY = cy * g + g / 2;
      const dist = Math.hypot(cellCenterX - center.x, cellCenterY - center.y);
      if (dist <= radiusPx + 0.01) {
        cells.push({ cx, cy });
      }
    }
  }
  return cells;
}

export function fogCellKey(cx: number, cy: number) {
  return `${cx},${cy}`;
}

export function parseFogCellKey(key: string): { cx: number; cy: number } | null {
  const [cxRaw, cyRaw] = key.split(",");
  const cx = Number(cxRaw);
  const cy = Number(cyRaw);
  if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
  return { cx, cy };
}

function isPlayerCharacterToken(token: BoardToken) {
  return token.kind === "pc";
}

export type FogLightSource = {
  id: string;
  x: number;
  y: number;
  radiusPx: number;
};

/** Células iluminadas (Chebyshev) — útil para grade; a renderização usa luz radial. */
export function cellsLitByToken(
  token: BoardToken,
  gridSize: number,
  radiusSquares: number
): string[] {
  const g = gridSize || DEFAULT_GRID_SIZE;
  const span = tokenGridSpan(token, g);
  const startCx = Math.floor(token.x / g);
  const startCy = Math.floor(token.y / g);
  const radius = Math.max(0, Math.round(radiusSquares));
  const keys: string[] = [];

  for (let cy = startCy - radius; cy < startCy + span + radius; cy++) {
    for (let cx = startCx - radius; cx < startCx + span + radius; cx++) {
      let dist = Infinity;
      for (let ty = startCy; ty < startCy + span; ty++) {
        for (let tx = startCx; tx < startCx + span; tx++) {
          dist = Math.min(dist, Math.max(Math.abs(cx - tx), Math.abs(cy - ty)));
        }
      }
      if (dist <= radius) keys.push(fogCellKey(cx, cy));
    }
  }
  return keys;
}

export function viewerIgnoresFog(
  board: BoardState,
  options: { isMaster: boolean; currentUserId: number }
): boolean {
  if (!board.fogEnabled) return true;
  if (options.isMaster) return true;
  return (board.fogExemptUserIds ?? []).includes(options.currentUserId);
}

export function lightSourcesForViewer(
  board: BoardState,
  options: { isMaster: boolean; currentUserId: number }
): FogLightSource[] {
  const defaultRadius =
    typeof board.visionRadiusSquares === "number"
      ? board.visionRadiusSquares
      : DEFAULT_VISION_RADIUS_SQUARES;
  const g = board.gridSize || DEFAULT_GRID_SIZE;
  const sources: FogLightSource[] = [];

  for (const token of board.tokens) {
    if (!isPlayerCharacterToken(token)) continue;
    if (token.secret && !options.isMaster) continue;
    if (!options.isMaster && token.ownerUserId !== options.currentUserId) {
      continue;
    }
    const ownerKey =
      token.ownerUserId != null ? String(token.ownerUserId) : "";
    const radiusSquares =
      ownerKey && board.visionByUserId?.[ownerKey] != null
        ? board.visionByUserId[ownerKey]
        : defaultRadius;
    const size = tokenFootprintPx(token, g);
    sources.push({
      id: token.id,
      x: token.x + size / 2,
      y: token.y + size / 2,
      radiusPx: Math.max(g * 0.75, radiusSquares * g + size * 0.35),
    });
  }
  return sources;
}

/** Luz atual vista por um jogador: só os próprios tokens PC. */
export function litCellsForViewer(
  board: BoardState,
  options: { isMaster: boolean; currentUserId: number }
): Set<string> {
  const defaultRadius =
    typeof board.visionRadiusSquares === "number"
      ? board.visionRadiusSquares
      : DEFAULT_VISION_RADIUS_SQUARES;
  const lit = new Set<string>();

  for (const token of board.tokens) {
    if (!isPlayerCharacterToken(token)) continue;
    if (token.secret && !options.isMaster) continue;
    if (!options.isMaster && token.ownerUserId !== options.currentUserId) {
      continue;
    }
    const ownerKey =
      token.ownerUserId != null ? String(token.ownerUserId) : "";
    const radius =
      ownerKey && board.visionByUserId?.[ownerKey] != null
        ? board.visionByUserId[ownerKey]
        : defaultRadius;
    for (const key of cellsLitByToken(token, board.gridSize, radius)) {
      lit.add(key);
    }
  }
  return lit;
}

function tokenInLightSources(
  token: BoardToken,
  board: BoardState,
  lights: FogLightSource[]
): boolean {
  const g = board.gridSize || DEFAULT_GRID_SIZE;
  const size = tokenFootprintPx(token, g);
  const cx = token.x + size / 2;
  const cy = token.y + size / 2;

  for (const light of lights) {
    const dx = cx - light.x;
    const dy = cy - light.y;
    if (Math.hypot(dx, dy) <= light.radiusPx * 0.9) return true;
  }
  return false;
}

/** Jogadores só veem tokens na própria luz (exceto o próprio token). */
export function isTokenVisibleThroughFog(
  token: BoardToken,
  board: BoardState,
  options: { isMaster: boolean; currentUserId: number },
  lights?: FogLightSource[]
): boolean {
  if (token.secret && !options.isMaster) return false;
  if (viewerIgnoresFog(board, options)) return true;
  if (token.ownerUserId === options.currentUserId) return true;
  const sources = lights ?? lightSourcesForViewer(board, options);
  return tokenInLightSources(token, board, sources);
}
