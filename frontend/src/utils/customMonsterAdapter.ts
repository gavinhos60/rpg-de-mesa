import type { Monster, MonsterAction, MonsterSize } from "../data/dnd/monsters";
import type {
  CustomMonsterActionForm,
  CustomMonsterSheet,
} from "../types/customMonster";
import {
  formatMonsterOptionList,
  normalizeMonsterOptionList,
} from "../types/customMonster";
import { ABILITIES } from "../data/dnd/abilities";
import { formatMonsterSkillsLine } from "./monsterSkillBonuses";
import type { SavedCustomMonster } from "../services/monster.service";

const SIZE_LABELS: Record<MonsterSize, string> = {
  Tiny: "Minúsculo",
  Small: "Pequeno",
  Medium: "Médio",
  Large: "Grande",
  Huge: "Enorme",
  Gargantuan: "Imenso",
};

function parseHpValue(hp: string): number {
  const match = hp.match(/\d+/);
  return match ? Number(match[0]) : 10;
}

function parseAcValue(ac: string): number {
  const match = ac.match(/\d+/);
  return match ? Number(ac[0]) : 10;
}

function formatSpeed(sheet: CustomMonsterSheet): string {
  const parts: string[] = [];
  if (sheet.speedWalk?.trim()) {
    parts.push(`caminhada: ${sheet.speedWalk.trim()}`);
  }
  if (sheet.speedFly?.trim()) {
    parts.push(`voo: ${sheet.speedFly.trim()}`);
  }
  if (sheet.speedOther?.trim()) {
    parts.push(sheet.speedOther.trim());
  }
  return parts.join("; ") || "—";
}

function saveAbilityLabel(saveAbility?: string): string {
  if (!saveAbility?.trim()) return "";
  const raw = saveAbility.trim();
  const found = ABILITIES.find(
    (item) =>
      item.id === raw ||
      item.name.localeCompare(raw, "pt", { sensitivity: "accent" }) === 0
  );
  return found?.name ?? raw;
}

function actionToMonsterAction(item: CustomMonsterActionForm): MonsterAction {
  const attack =
    item.attackBonus?.trim() !== ""
      ? Number(item.attackBonus)
      : null;
  const attackBonus =
    attack != null && Number.isFinite(attack) ? attack : null;

  let description = item.description.trim();
  if (item.saveDc?.trim()) {
    const abilityName = saveAbilityLabel(item.saveAbility);
    const saveLine = `CD ${item.saveDc.trim()}${
      abilityName ? ` ${abilityName}` : ""
    }.`;
    description = description ? `${saveLine} ${description}` : saveLine;
  }

  return {
    name: item.name.trim() || "Ação",
    description,
    attackBonus,
    damage: item.damage?.trim() || null,
  };
}

export function customMonsterToMonster(saved: SavedCustomMonster): Monster {
  const sheet = (saved.sheet ?? {}) as CustomMonsterSheet;
  const size = sheet.size ?? "Medium";
  const hp = parseHpValue(sheet.hp || "10");

  return {
    id: `custom-${saved.id}`,
    name: saved.name,
    nameEn: saved.name,
    type: sheet.creatureType?.trim() || "monstro",
    size,
    sizeLabel: SIZE_LABELS[size],
    alignment: sheet.alignment?.trim() || "—",
    ac: parseAcValue(sheet.ac || "10"),
    hp,
    hitDice: sheet.hpFormula?.trim() || sheet.hp?.trim() || String(hp),
    cr: sheet.cr?.trim() || "—",
    xp: 0,
    speed: formatSpeed(sheet),
    abilities: sheet.abilities ?? {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: formatMonsterSkillsLine(sheet),
    senses: sheet.senses?.trim() || "—",
    languages: formatMonsterOptionList(
      normalizeMonsterOptionList(sheet.languages)
    ),
    damageResistances: formatMonsterOptionList(
      normalizeMonsterOptionList(sheet.damageResistances)
    ),
    damageImmunities: formatMonsterOptionList(
      normalizeMonsterOptionList(sheet.damageImmunities)
    ),
    conditionImmunities: formatMonsterOptionList(
      normalizeMonsterOptionList(sheet.conditionImmunities)
    ),
    damageVulnerabilities: "—",
    traits: (sheet.traits ?? []).map(actionToMonsterAction),
    actions: (sheet.actions ?? []).map(actionToMonsterAction),
    reactions: (sheet.reactions ?? []).map(actionToMonsterAction),
    legendaryActions: (sheet.legendaryActions ?? []).map(actionToMonsterAction),
    imageUrl: saved.avatar?.trim() || "",
    tokenUrl: saved.avatar?.trim() || "",
    color: "#5C1D26",
    tokenSize: 1,
  };
}

export function monsterPortraitFromSaved(saved: SavedCustomMonster): string {
  if (saved.avatar?.trim()) return saved.avatar.trim();
  return customMonsterToMonster(saved).imageUrl;
}
