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

export type BoardRuler = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Distância em metros. */
  meters: number;
  byUserId: number;
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
  /** Só o mestre vê (camada secreta). */
  secret?: boolean;
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
  /** Metros por quadrado (padrão D&D 5e = 1,5 m). */
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
   */
  playerMapView?: PlayerMapView | null;
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
};

export type SessionRuntimeState = {
  board: BoardState;
  chat: ChatMessage[];
};

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
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_VISION_RADIUS_SQUARES = 3;

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
    drawings: board.drawings,
    effects: board.effects,
    rulers: board.rulers,
  };
}

/**
 * Mapa que o cliente deve renderizar: mestre sempre vê o cenário ativo;
 * jogadores usam `playerMapView` se o mestre não os trouxe junto.
 */
export function boardMapForViewer(
  board: BoardState,
  isMaster: boolean
): BoardState {
  const view = board.playerMapView;
  if (isMaster || !view) return board;
  return {
    ...board,
    mapUrl: view.mapUrl,
    mapWidth: view.mapWidth,
    mapHeight: view.mapHeight,
    gridSize: view.gridSize ?? board.gridSize,
    metersPerSquare: view.metersPerSquare ?? board.metersPerSquare,
    drawings: view.drawings ?? [],
    effects: view.effects ?? [],
    rulers: view.rulers ?? [],
  };
}

/** Tokens visíveis no cenário atual do espectador. */
export function tokensForViewer(
  board: BoardState,
  isMaster: boolean
): BoardToken[] {
  if (isMaster) {
    return board.tokens.filter((token) => !token.onPlayerScene);
  }
  if (board.playerMapView) {
    return board.tokens.filter((token) => token.onPlayerScene);
  }
  return board.tokens.filter((token) => !token.onPlayerScene);
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
  // Sessões antigas usavam feetPerSquare (5 ft ≈ 1,5 m).
  if (typeof board.feetPerSquare === "number" && board.feetPerSquare > 0) {
    return Math.round(board.feetPerSquare * 0.3 * 100) / 100;
  }
  return DEFAULT_METERS_PER_SQUARE;
}

export function formatMeters(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} m` : `${rounded.toFixed(1)} m`;
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
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const pixels = Math.sqrt(dx * dx + dy * dy);
  const squares = pixels / (gridSize || DEFAULT_GRID_SIZE);
  return Math.round(squares * metersPerSquare * 10) / 10;
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
