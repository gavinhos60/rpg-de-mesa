export type Ability =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type Skill =
  | "acrobatics"
  | "animal-handling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleight-of-hand"
  | "stealth"
  | "survival";

export type BoardToken = {
  id: string;
  kind: "pc" | "npc";
  name: string;
  x: number;
  y: number;
  color: string;
  borderColor?: string;
  characterId?: number;
  monsterId?: string;
  ownerUserId?: number;
  gridSpan?: number;
  sizeCategory?: "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";
  size?: number;
  meta?: string;
  imageUrl?: string;
  hpMax?: number;
  hpCurrent?: number;
  customValue?: string;
  conditions?: string[];
  secret?: boolean;
  /** Token no cenário congelado dos jogadores. */
  onPlayerScene?: boolean;
};

export type BoardDrawing = {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
  byUserId?: number;
  secret?: boolean;
};

export type BoardRuler = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  meters: number;
  byUserId: number;
};

export type BoardEffect = {
  id: string;
  x: number;
  y: number;
  radius: number;
  meters?: number;
  color: string;
  label?: string;
  byUserId?: number;
  secret?: boolean;
};

export type PreparedMap = {
  id: string;
  name: string;
  mapUrl: string;
  /** Largura/altura em quadrados da grade. */
  mapWidth?: number;
  mapHeight?: number;
  gridSize?: number;
  metersPerSquare?: number;
};

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
  /** Largura do mapa em quadrados (não pixels). */
  mapWidth?: number;
  /** Altura do mapa em quadrados (não pixels). */
  mapHeight?: number;
  gridSize: number;
  metersPerSquare: number;
  feetPerSquare?: number;
  tokens: BoardToken[];
  drawings: BoardDrawing[];
  rulers: BoardRuler[];
  effects: BoardEffect[];
  fogEnabled?: boolean;
  visionRadiusSquares?: number;
  visionByUserId?: Record<string, number>;
  fogExemptUserIds?: number[];
  preparedMaps?: PreparedMap[];
  /** Cenário congelado para jogadores quando o mestre troca sem levá-los. */
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

export const DEFAULT_METERS_PER_SQUARE = 1.5;
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_VISION_RADIUS_SQUARES = 3;

export function emptyBoardState(): BoardState {
  return {
    mapUrl: "",
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
  if (typeof board.feetPerSquare === "number" && board.feetPerSquare > 0) {
    return Math.round(board.feetPerSquare * 0.3 * 100) / 100;
  }
  return DEFAULT_METERS_PER_SQUARE;
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

export function tokenGridSpan(
  token: {
    gridSpan?: number;
    sizeCategory?: string;
    size?: number;
  },
  gridSize = DEFAULT_GRID_SIZE
): number {
  if (typeof token.gridSpan === "number" && token.gridSpan >= 1) {
    return Math.min(4, Math.max(1, Math.round(token.gridSpan)));
  }
  if (token.sizeCategory) {
    return sizeCategoryToSpan(token.sizeCategory);
  }
  if (typeof token.size === "number" && gridSize > 0) {
    const approx = Math.round(token.size / gridSize);
    if (approx >= 4) return 4;
    if (approx >= 3) return 3;
    if (approx >= 2) return 2;
  }
  return 1;
}

export function fogCellKey(cx: number, cy: number) {
  return `${cx},${cy}`;
}

export type SessionRuntimeState = {
  board: BoardState;
  chat: ChatMessage[];
};
