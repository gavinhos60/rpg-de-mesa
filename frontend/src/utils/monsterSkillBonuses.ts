import { getAbilityModifier } from "../data/dnd/abilities";
import { DND_SKILLS } from "../data/dnd/skills";
import type {
  CustomMonsterAbilityScores,
  CustomMonsterSheet,
  MonsterSkillEntry,
} from "../types/customMonster";

/** Bônus de proficiência aproximado pelo ND (5e). */
export function proficiencyBonusFromCr(cr?: string | null): number {
  const raw = String(cr ?? "").trim().replace(",", ".");
  if (!raw) return 2;
  let crNum: number;
  if (raw.includes("/")) {
    const [a, b] = raw.split("/").map((part) => Number(part.trim()));
    if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) {
      crNum = a / b;
    } else {
      crNum = 0;
    }
  } else {
    crNum = Number(raw);
    if (!Number.isFinite(crNum)) return 2;
  }
  if (crNum < 5) return 2;
  if (crNum < 9) return 3;
  if (crNum < 13) return 4;
  if (crNum < 17) return 5;
  if (crNum < 21) return 6;
  if (crNum < 25) return 7;
  if (crNum < 29) return 8;
  return 9;
}

export function monsterSkillAbilityMod(
  abilities: CustomMonsterAbilityScores,
  skillId: string
): number {
  const skill = DND_SKILLS.find((item) => item.id === skillId);
  if (!skill) return 0;
  return getAbilityModifier(abilities[skill.ability] ?? 10);
}

export function computeMonsterSkillTotal(
  sheet: CustomMonsterSheet,
  skillId: string,
  entry?: MonsterSkillEntry | null
): number | null {
  if (!entry) return null;
  const hasFlag =
    entry.proficient ||
    entry.advantage ||
    (entry.extraBonus != null && entry.extraBonus !== 0);
  if (!hasFlag) return null;

  const mod = monsterSkillAbilityMod(sheet.abilities, skillId);
  const prof = entry.proficient
    ? proficiencyBonusFromCr(sheet.cr)
    : 0;
  const extra = entry.extraBonus ?? 0;
  return mod + prof + extra;
}

export function formatMonsterSkillsLine(sheet: CustomMonsterSheet): string {
  const legacy = sheet.skillBonuses ?? {};
  const hasLegacy = Object.keys(legacy).some(
    (key) => legacy[key] != null && Number.isFinite(legacy[key])
  );
  if (hasLegacy && !sheet.skillProficiencies) {
    const parts = DND_SKILLS.map((skill) => {
      const bonus = legacy[skill.id];
      if (bonus == null || !Number.isFinite(bonus)) return null;
      const sign = bonus >= 0 ? "+" : "";
      return `${skill.name} ${sign}${bonus}`;
    }).filter(Boolean) as string[];
    const saves = sheet.savingThrows?.trim();
    if (saves) parts.unshift(`Salvaguardas: ${saves}`);
    return parts.length ? parts.join(", ") : "—";
  }

  const entries = sheet.skillProficiencies ?? {};
  const parts = DND_SKILLS.map((skill) => {
    const entry = entries[skill.id];
    const total = computeMonsterSkillTotal(sheet, skill.id, entry);
    if (total == null) return null;
    const sign = total >= 0 ? "+" : "";
    let label = `${skill.name} ${sign}${total}`;
    if (entry?.advantage) label += " (vantagem)";
    return label;
  }).filter(Boolean) as string[];

  const saves = sheet.savingThrows?.trim();
  if (saves) parts.unshift(`Salvaguardas: ${saves}`);
  return parts.length ? parts.join(", ") : "—";
}
