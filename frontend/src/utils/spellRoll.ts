import type { CharacterFormData, Spell } from "../types/character";
import { getAbilityModifier } from "../data/dnd/abilities";
import { getFinalAbilities } from "../data/dnd/characterStats";
import { getProficiencyBonus } from "../data/dnd/rules";
import { getSpellDetail, type SpellDetail } from "../data/dnd/spellDetails";
import { getSpellcastingAbility } from "../data/dnd/spellcasting";

export type CharacterSheetAction = {
  actionName: string;
  description?: string;
  attackBonus?: number | null;
  damage?: string | null;
  saveDc?: number | null;
  saveLabel?: string | null;
};

/** Extrai notações de dados de um texto (ex.: 2d6+3, 1d10). */
export function extractDiceNotations(text: string): string[] {
  return String(text).match(/\d*d\d+(?:[+-]\d+)?/gi) ?? [];
}

function characterLevel(data: CharacterFormData): number {
  const fromClasses = data.classes?.reduce(
    (sum, item) => sum + (item.level || 0),
    0
  );
  return Math.max(1, fromClasses || data.level || 1);
}

/** Escala truques com base no texto de níveis superiores do PHB. */
export function cantripDiceAtLevel(
  baseText: string,
  higherLevels: string | undefined,
  level: number
): string | null {
  const base = extractDiceNotations(baseText)[0];
  if (!base) return null;
  if (!higherLevels || level < 5) return base;

  const picks = [
    ...higherLevels.matchAll(
      /(\d+)\s*[ºo°].*?\((\d*d\d+(?:[+-]\d+)?)\)/gi
    ),
  ];
  let dice = base;
  for (const match of picks) {
    const threshold = Number(match[1]);
    if (Number.isFinite(threshold) && level >= threshold) {
      dice = match[2];
    }
  }
  return dice;
}

export function resolveSpellcastingStats(data: CharacterFormData): {
  abilityId: string | null;
  modifier: number;
  attackBonus: number;
  saveDc: number;
  proficiency: number;
} {
  const abilities = getFinalAbilities(data);
  const level = characterLevel(data);
  const proficiency = getProficiencyBonus(level);

  let abilityId: string | null = null;
  for (const selection of data.classes ?? []) {
    const next = getSpellcastingAbility(
      selection.classId,
      selection.subclassId
    );
    if (next) {
      abilityId = next;
      break;
    }
  }

  const modifier = abilityId
    ? getAbilityModifier(abilities[abilityId as keyof typeof abilities])
    : 0;

  return {
    abilityId,
    modifier,
    attackBonus: proficiency + modifier,
    saveDc: 8 + proficiency + modifier,
    proficiency,
  };
}

function detectSaveLabel(text: string): string | null {
  const match = text.match(
    /teste de resistência de (Força|Destreza|Constituição|Inteligência|Sabedoria|Carisma)/i
  );
  if (!match) return null;
  return `CD (${match[1]})`;
}

export function buildSpellAction(
  data: CharacterFormData,
  spell: Spell
): CharacterSheetAction {
  const detail: SpellDetail | undefined = getSpellDetail(spell.id);
  const fullText = [
    spell.description,
    detail?.text,
    detail?.higherLevels,
  ]
    .filter(Boolean)
    .join(" ");

  const stats = resolveSpellcastingStats(data);
  const level = characterLevel(data);
  const sourceForDamage = detail?.text || spell.description || "";

  let damage: string | null = null;
  if (spell.level === 0) {
    damage = cantripDiceAtLevel(
      sourceForDamage,
      detail?.higherLevels,
      level
    );
  } else {
    const dice = extractDiceNotations(sourceForDamage);
    damage = dice.length > 0 ? dice.join("+") : null;
  }

  const hasSave = /teste de resistência/i.test(fullText);
  const saveLabel = hasSave ? detectSaveLabel(fullText) : null;

  const meta: string[] = [];
  if (detail?.castingTime) meta.push(detail.castingTime);
  if (detail?.range) meta.push(detail.range);
  if (spell.attack) meta.push(`ataque mágico ${stats.attackBonus >= 0 ? "+" : ""}${stats.attackBonus}`);
  if (hasSave) meta.push(`CD ${stats.saveDc}`);

  const descriptionParts = [
    meta.length ? meta.join(" · ") : null,
    detail?.text || spell.description || undefined,
  ].filter(Boolean);

  return {
    actionName: spell.name,
    description: descriptionParts.join("\n"),
    attackBonus: spell.attack ? stats.attackBonus : null,
    damage,
    saveDc: hasSave ? stats.saveDc : null,
    saveLabel,
  };
}

export function buildFeatureAction(
  name: string,
  description: string
): CharacterSheetAction {
  const dice = extractDiceNotations(description);
  return {
    actionName: name,
    description,
    attackBonus: null,
    damage: dice.length > 0 ? dice.join("+") : null,
    saveDc: null,
    saveLabel: null,
  };
}
