export type DiceRollResult = {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  publicText: string;
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
  for (let i = 0; i < parsed.count; i += 1) {
    rolls.push(1 + Math.floor(Math.random() * parsed.sides));
  }

  const diceSum = rolls.reduce((sum, value) => sum + value, 0);
  const total = diceSum + parsed.modifier;

  const rollsText =
    rolls.length === 1 ? String(rolls[0]) : `[${rolls.join(", ")}]`;

  const modText =
    parsed.modifier > 0
      ? ` + ${parsed.modifier}`
      : parsed.modifier < 0
        ? ` - ${Math.abs(parsed.modifier)}`
        : "";

  const publicText = `${parsed.formula}: ${rollsText}${modText} = ${total}`;

  return {
    formula: parsed.formula,
    rolls,
    modifier: parsed.modifier,
    total,
    publicText,
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
