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
  shape?: "line" | "square" | "circle" | "cone" | "beam";
  from: { x: number; y: number };
  to: { x: number; y: number };
  meters: number;
  squares?: number;
  byUserId: number;
  byUserName?: string;
  color?: string;
  live?: boolean;
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
  gridType?: "square" | "hex";
};

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
  /** Largura do mapa em quadrados (não pixels). */
  mapWidth?: number;
  /** Altura do mapa em quadrados (não pixels). */
  mapHeight?: number;
  gridSize: number;
  gridType?: "square" | "hex";
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
  /** @deprecated preferir playerViewsByUserId */
  playerMapView?: PlayerMapView | null;
  /** Mapa congelado por jogador (userId → view). */
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

export const DEFAULT_METERS_PER_SQUARE = 1.5;
export const DEFAULT_HEX_METERS = 10_000;
export const DEFAULT_GRID_SIZE = 50;
export const DEFAULT_VISION_RADIUS_SQUARES = 3;

export function gridTypeOf(board: { gridType?: string | null }): "square" | "hex" {
  return board.gridType === "hex" ? "hex" : "square";
}

export function emptyBoardState(): BoardState {
  return {
    mapUrl: "",
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
  if (typeof board.feetPerSquare === "number" && board.feetPerSquare > 0) {
    return Math.round(board.feetPerSquare * 0.3 * 100) / 100;
  }
  return DEFAULT_METERS_PER_SQUARE;
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

/** Distância em quadrados D&D 5e / Roll20 (diagonal = 1). */
export function distanceSquares5e(
  from: { x: number; y: number },
  to: { x: number; y: number },
  gridSize: number
): number {
  const a = cellCoords(from.x, from.y, gridSize);
  const b = cellCoords(to.x, to.y, gridSize);
  return Math.max(Math.abs(a.cx - b.cx), Math.abs(a.cy - b.cy));
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
  /** Relógio ativo — turnos avançam. */
  active: boolean;
  /** Aguardando jogadores rolarem iniciativa. */
  collecting: boolean;
  round: number;
  currentIndex: number;
  order: CombatantEntry[];
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

export function sortCombatOrder(order: CombatantEntry[]): CombatantEntry[] {
  return [...order].sort((a, b) => {
    const aCrit = a.natural === 20 ? 1 : 0;
    const bCrit = b.natural === 20 ? 1 : 0;
    if (bCrit !== aCrit) return bCrit - aCrit;
    const aFumble = a.natural === 1 ? 1 : 0;
    const bFumble = b.natural === 1 ? 1 : 0;
    if (aFumble !== bFumble) return aFumble - bFumble;
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    return a.name.localeCompare(b.name, "pt");
  });
}

/** Personagem só tem tokens secretos no tabuleiro → rolagens ocultas. */
export function characterIsOnSecretLayer(
  board: BoardState,
  characterId: number
): boolean {
  const tokens = board.tokens.filter(
    (token) => token.characterId === characterId
  );
  if (tokens.length === 0) return false;
  return tokens.every((token) => Boolean(token.secret));
}

export function tokenIsOnSecretLayer(
  board: BoardState,
  tokenId: string
): boolean {
  return Boolean(board.tokens.find((token) => token.id === tokenId)?.secret);
}

export function monsterIsOnSecretLayer(
  board: BoardState,
  options: { tokenId?: string | null; monsterName?: string | null }
): boolean {
  if (options.tokenId) {
    return tokenIsOnSecretLayer(board, options.tokenId);
  }
  const name = options.monsterName?.trim();
  if (!name) return false;
  const tokens = board.tokens.filter(
    (token) =>
      !token.characterId &&
      token.name.trim().toLowerCase() === name.toLowerCase()
  );
  if (tokens.length === 0) return false;
  return tokens.every((token) => Boolean(token.secret));
}

/** Visão pública do relógio (sem combatentes secretos). */
export function publicCombatState(
  combat: CombatState | null | undefined
): CombatState | null {
  if (!combat) return null;
  const order = combat.order.filter((entry) => !entry.secret);
  const current = combat.order[combat.currentIndex];
  let currentIndex = 0;
  if (current && !current.secret) {
    const idx = order.findIndex((entry) => entry.id === current.id);
    currentIndex = idx >= 0 ? idx : 0;
  }
  return {
    ...combat,
    order,
    currentIndex,
  };
}

/**
 * Atualiza `secret` dos combatentes conforme a camada atual dos tokens.
 * Revelar um token (sair da secreta) faz o combatente aparecer no relógio dos jogadores.
 */
export function syncCombatantSecrets(
  board: BoardState,
  combat: CombatState | null | undefined
): { combat: CombatState | null; changed: boolean } {
  if (!combat) return { combat: null, changed: false };

  let changed = false;
  const order = combat.order.map((entry) => {
    let secret = false;
    if (entry.tokenId) {
      secret = tokenIsOnSecretLayer(board, entry.tokenId);
    } else if (entry.characterId != null) {
      secret = characterIsOnSecretLayer(board, entry.characterId);
    } else {
      secret = monsterIsOnSecretLayer(board, { monsterName: entry.name });
    }
    const nextSecret = secret || undefined;
    if (Boolean(entry.secret) !== Boolean(nextSecret)) {
      changed = true;
    }
    return { ...entry, secret: nextSecret };
  });

  return {
    combat: changed ? { ...combat, order } : combat,
    changed,
  };
}

/** Anotações de outros (ou sem dono) — o jogador não pode apagá-las via board:update. */
export function mergeOwnedAnnotations<
  T extends { id: string; byUserId?: number },
>(existing: T[], incoming: T[] | undefined, userId: number): T[] {
  if (!incoming) return existing;
  const uid = Number(userId);
  const others = existing.filter((item) => Number(item.byUserId) !== uid);
  const ownIncoming = incoming.filter((item) => Number(item.byUserId) === uid);
  return [...others, ...ownIncoming];
}

export function playerFrozenView(
  board: BoardState,
  userId: number
): PlayerMapView | null {
  const views = board.playerViewsByUserId ?? {};
  const mine = views[String(userId)];
  if (mine) return mine;
  if (
    board.playerMapView &&
    (!board.playerViewsByUserId ||
      Object.keys(board.playerViewsByUserId).length === 0)
  ) {
    return board.playerMapView;
  }
  return null;
}

export function withPlayerViewAnnotations(
  board: BoardState,
  userId: number,
  patch: Partial<
    Pick<PlayerMapView, "drawings" | "effects" | "rulers">
  >
): BoardState {
  const key = String(userId);
  const current =
    board.playerViewsByUserId?.[key] ?? board.playerMapView ?? null;
  if (!current) return board;
  const nextView: PlayerMapView = {
    ...current,
    ...(patch.drawings ? { drawings: patch.drawings } : {}),
    ...(patch.effects ? { effects: patch.effects } : {}),
    ...(patch.rulers ? { rulers: patch.rulers } : {}),
  };
  return {
    ...board,
    playerViewsByUserId: {
      ...(board.playerViewsByUserId ?? {}),
      [key]: nextView,
    },
  };
}


