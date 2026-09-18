/**
 * Tabela oficial de XP do D&D 5e (Player's Handbook / SRD).
 * Valores = XP total acumulado mínimo para alcançar cada nível.
 *
 * | Nível | XP acumulado |
 * |-------|--------------|
 * |   1   | 0            |
 * |   2   | 300          |
 * |   3   | 900          |
 * |  ...  | ...          |
 * |  20   | 355.000      |
 */
export const XP_BY_LEVEL: readonly number[] = [
  0,
  300,
  900,
  2_700,
  6_500,
  14_000,
  23_000,
  34_000,
  48_000,
  64_000,
  85_000,
  100_000,
  120_000,
  140_000,
  165_000,
  195_000,
  225_000,
  265_000,
  305_000,
  355_000,
];

export const MAX_CHARACTER_LEVEL = XP_BY_LEVEL.length;

/** XP total acumulado mínimo para estar no nível informado. */
export function xpForLevel(level: number): number {
  const clamped = Math.max(1, Math.min(level, MAX_CHARACTER_LEVEL));
  return XP_BY_LEVEL[clamped - 1] ?? 0;
}

/** XP total acumulado necessário para alcançar o próximo nível. */
export function xpToNextLevel(totalLevel: number): number | null {
  if (totalLevel >= MAX_CHARACTER_LEVEL) return null;
  return xpForLevel(totalLevel + 1);
}

/** XP adicional necessário para subir do nível atual ao próximo (faixa do nível). */
export function xpSpanForLevel(totalLevel: number): number | null {
  const next = xpToNextLevel(totalLevel);
  if (next == null) return null;
  return next - xpForLevel(totalLevel);
}

export function resolveCharacterXp(
  xp: number | undefined | null,
  totalLevel: number
): number {
  if (typeof xp === "number" && Number.isFinite(xp) && xp >= 0) {
    return Math.floor(xp);
  }
  return xpForLevel(totalLevel);
}

export function xpProgress(
  totalLevel: number,
  xp: number
): {
  currentThreshold: number;
  nextThreshold: number | null;
  /** 0–1 dentro da faixa do nível atual (PHB). */
  progress: number;
  /** XP ganho desde o início do nível atual. */
  inLevel: number;
  /** XP que falta até o próximo nível. */
  remaining: number | null;
} {
  const currentThreshold = xpForLevel(totalLevel);
  const nextThreshold = xpToNextLevel(totalLevel);

  if (nextThreshold == null) {
    return {
      currentThreshold,
      nextThreshold: null,
      progress: 1,
      inLevel: Math.max(0, xp - currentThreshold),
      remaining: null,
    };
  }

  const span = nextThreshold - currentThreshold;
  const inLevel = Math.max(0, xp - currentThreshold);
  const progress = span > 0 ? Math.min(1, inLevel / span) : 0;
  const remaining = Math.max(0, nextThreshold - xp);

  return {
    currentThreshold,
    nextThreshold,
    progress,
    inLevel,
    remaining,
  };
}

/** Pode subir de nível quando o XP total atinge o mínimo do próximo nível (PHB). */
export function canAdvanceLevel(totalLevel: number, xp: number): boolean {
  if (totalLevel >= MAX_CHARACTER_LEVEL) return false;
  const next = xpToNextLevel(totalLevel);
  return next != null && xp >= next;
}

export function formatXp(value: number): string {
  return value.toLocaleString("pt-BR");
}
