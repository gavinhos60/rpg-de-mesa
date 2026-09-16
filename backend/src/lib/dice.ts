export type DiceRollResult = {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  publicText: string;
  /** Face natural do d20 usada no resultado (vantagem = maior). */
  natural?: number;
};

/** Parses notations like 1d20, 2d6+3, /R 1D20-1, d20+5 */
export function parseDiceNotation(raw: string): {
  count: number;
  sides: number;
  modifier: number;
  formula: string;
} | null {
  const cleaned = raw
    .trim()
    .replace(/^\/r\s+/i, "")
    .replace(/\s+/g, "")
    .toLowerCase();

  const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;

  const count = match[1] ? Number(match[1]) : 1;
  const sides = Number(match[2]);
  const modifier = match[3] ? Number(match[3]) : 0;

  if (
    !Number.isFinite(count) ||
    !Number.isFinite(sides) ||
    count < 1 ||
    count > 100 ||
    sides < 2 ||
    sides > 1000
  ) {
    return null;
  }

  const formula =
    `${count}d${sides}` +
    (modifier > 0 ? `+${modifier}` : modifier < 0 ? `${modifier}` : "");

  return { count, sides, modifier, formula };
}

export function rollDice(notation: string): DiceRollResult | null {
  const parsed = parseDiceNotation(notation);
  if (!parsed) return null;

  const rolls: number[] = [];
  for (let i = 0; i < parsed.count; i++) {
    rolls.push(1 + Math.floor(Math.random() * parsed.sides));
  }
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + parsed.modifier;
  const modText =
    parsed.modifier > 0
      ? ` + ${parsed.modifier}`
      : parsed.modifier < 0
        ? ` - ${Math.abs(parsed.modifier)}`
        : "";
  const rollsText =
    rolls.length === 1 ? String(rolls[0]) : `[${rolls.join(", ")}]`;

  return {
    formula: parsed.formula,
    rolls,
    modifier: parsed.modifier,
    total,
    publicText: `${parsed.formula}: ${rollsText}${modText} = ${total}`,
  };
}

export function rollD20WithModifier(
  modifier: number,
  options?: { advantage?: boolean }
): DiceRollResult {
  const first = 1 + Math.floor(Math.random() * 20);
  const advantage = Boolean(options?.advantage);

  let rolls = [first];
  let picked = first;
  let formula = `1d20${modifier >= 0 ? `+${modifier}` : `${modifier}`}`;

  if (advantage) {
    const second = 1 + Math.floor(Math.random() * 20);
    rolls = [first, second];
    picked = Math.max(first, second);
    formula = `2d20kh1${modifier >= 0 ? `+${modifier}` : `${modifier}`}`;
  }

  const total = picked + modifier;
  const modText =
    modifier > 0
      ? ` + ${modifier}`
      : modifier < 0
        ? ` - ${Math.abs(modifier)}`
        : "";

  const publicText = advantage
    ? `vantagem [${rolls.join(", ")}] → ${picked}${modText} = ${total}`
    : `1d20: ${picked}${modText} = ${total}`;

  return {
    formula,
    rolls,
    modifier,
    total,
    publicText,
    natural: picked,
  };
}

/** Rola expressões compostas como "2d6+5 + 1d12". */
export function rollCompoundDice(raw: string): {
  parts: DiceRollResult[];
  total: number;
  publicText: string;
} | null {
  const matches = String(raw).match(/\d*d\d+(?:[+-]\d+)?/gi);
  if (!matches?.length) return null;

  const parts: DiceRollResult[] = [];
  for (const match of matches) {
    const rolled = rollDice(match);
    if (rolled) parts.push(rolled);
  }
  if (!parts.length) return null;

  const total = parts.reduce((sum, part) => sum + part.total, 0);
  const publicText =
    parts.length === 1
      ? parts[0].publicText
      : `${parts.map((p) => p.publicText).join(" | ")} → total ${total}`;

  return { parts, total, publicText };
}

/** Acerto crítico: d20 natural 20 (em vantagem, o dado mantido). */
export function isCriticalHit(result: {
  natural?: number;
  rolls: number[];
  formula?: string;
}): boolean {
  if (typeof result.natural === "number") return result.natural === 20;
  if (!result.rolls.length) return false;
  if (result.rolls.length >= 2 || /kh1|2d20/i.test(result.formula || "")) {
    return Math.max(...result.rolls) === 20;
  }
  return result.rolls[0] === 20;
}

/** Dano em crítico: total × 2 (modificadores inclusos). */
export function applyCriticalDamage(damage: {
  parts: DiceRollResult[];
  total: number;
  publicText: string;
}): {
  parts: DiceRollResult[];
  total: number;
  publicText: string;
  formula: string;
  rolls: number[];
  modifier: number;
} {
  const total = damage.total * 2;
  return {
    parts: damage.parts,
    total,
    publicText: `${damage.publicText} → crítico ×2 = ${total}`,
    formula: damage.parts.map((p) => p.formula).join("+"),
    rolls: damage.parts.flatMap((p) => p.rolls),
    modifier: damage.parts.reduce((s, p) => s + p.modifier, 0),
  };
}
