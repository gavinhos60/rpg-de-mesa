import type { CharacterFormData, CharacterClassSelection, Skill } from "../../types/character";
import { DND_CLASSES } from "./classes";
import {
  FIGHTING_STYLE_KEY,
  FIGHTING_STYLE_2_KEY,
} from "./fightingStyles";
import {
  getBattleManeuver,
  getBattleManeuverLimit,
  getSelectedManeuvers,
} from "./battleMasterManeuvers";
import {
  getMartialAdeptManeuverIds,
  hasSelectedFeat,
} from "./classFeatures";
import {
  METAMAGIC_OPTIONS,
  getMetamagicLimit,
  getSelectedMetamagic,
} from "./metamagicOptions";
import { DRACONIC_ANCESTRY_KEY, DRACONIC_ANCESTRIES } from "./draconicAncestry";
import {
  DRUID_LAND_BONUS_CANTRIP_KEY,
  LAND_TERRAINS,
  getLandTerrainId,
} from "./landCircle";
import {
  BARBARIAN_TOTEM_SPIRIT_KEY,
  BARBARIAN_TOTEM_ASPECT_KEY,
  BARBARIAN_TOTEM_ATTUNEMENT_KEY,
} from "./totemBarbarian";
import {
  RANGER_FAVORED_ENEMIES_KEY,
  RANGER_FAVORED_TERRAINS_KEY,
  RANGER_HUNTER_PREY_KEY,
  RANGER_HUNTER_DEFENSE_KEY,
  RANGER_HUNTER_MULTIATTACK_KEY,
  RANGER_HUNTER_SUPERIOR_KEY,
  RANGER_BEAST_COMPANION_KEY,
  favoredEnemyLimit,
  favoredTerrainLimit,
} from "./rangerOptions";
import { getSpell } from "./spells";
import { WARLOCK_PACT_BOON_KEY } from "./eldritchInvocations";

export const BARD_LORE_SKILLS_KEY = "bard:lore-bonus-skills";
export const BARD_EXPERTISE_KEY = "bard:expertise";
export const ROGUE_EXPERTISE_KEY = "rogue:expertise";
export const CLERIC_KNOWLEDGE_SKILLS_KEY = "cleric:knowledge-skills";
export const CLERIC_KNOWLEDGE_LANGUAGES_KEY = "cleric:knowledge-languages";
export const CLERIC_NATURE_SKILL_KEY = "cleric:nature-skill";
export const CLERIC_NATURE_CANTRIP_KEY = "cleric:nature-cantrip";
export const WARLOCK_CHAIN_FAMILIAR_KEY = "warlock:chain-familiar";
export const BARD_MAGICAL_SECRETS_6_KEY = "bard:magical-secrets-6";
export const BARD_MAGICAL_SECRETS_10_KEY = "bard:magical-secrets-10";
export const BARD_MAGICAL_SECRETS_14_KEY = "bard:magical-secrets-14";

export const CHAIN_FAMILIAR_OPTIONS = [
  { id: "imp", name: "Diabrete" },
  { id: "pseudodragon", name: "Pseudodragão" },
  { id: "quasit", name: "Quasit" },
  { id: "raven", name: "Corvo" },
  { id: "other", name: "Outro (ver magia)" },
];

function choiceValues(
  featureChoices: Record<string, string[]> | undefined,
  key: string
): string[] {
  return (featureChoices?.[key] ?? []).filter(Boolean);
}

function filledUnique(values: string[], count: number): boolean {
  const unique = new Set(values.filter(Boolean));
  return unique.size >= count;
}

export function getClassLevel(
  data: CharacterFormData,
  classId: string
): number {
  return (
    data.classes.find((item) => item.classId === classId)?.level ?? 0
  );
}

export function getExpertiseLimit(classId: string, level: number): number {
  if (classId === "bard") {
    if (level >= 10) return 4;
    if (level >= 3) return 2;
    return 0;
  }
  if (classId === "rogue") {
    if (level >= 17) return 8;
    if (level >= 11) return 6;
    if (level >= 6) return 4;
    if (level >= 1) return 2;
    return 0;
  }
  return 0;
}

export function expertiseKey(classId: string): string | null {
  if (classId === "bard") return BARD_EXPERTISE_KEY;
  if (classId === "rogue") return ROGUE_EXPERTISE_KEY;
  return null;
}

/** Sincroniza flags de expertise na ficha a partir das escolhas de classe. */
export function syncExpertiseOnSheet(data: CharacterFormData): CharacterFormData {
  const skills = { ...data.skills };
  const expertiseSkills = new Set<string>();

  for (const selection of data.classes) {
    const key = expertiseKey(selection.classId);
    if (!key) continue;
    choiceValues(data.featureChoices, key).forEach((id) =>
      expertiseSkills.add(id)
    );
  }

  for (const skillId of Object.keys(skills) as Skill[]) {
    const entry = skills[skillId];
    if (!entry) continue;
    skills[skillId] = {
      ...entry,
      expertise: expertiseSkills.has(skillId),
    };
  }

  return { ...data, skills };
}

export function getMagicalSecretsIssues(
  data: CharacterFormData,
  selection: CharacterClassSelection
): string[] {
  if (selection.classId !== "bard") return [];
  const issues: string[] = [];
  const name = "bardo";

  if (
    selection.subclassId === "college-of-lore" &&
    selection.level >= 6
  ) {
    const picks = choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_6_KEY);
    if (picks.length < 2) {
      issues.push("Escolha 2 magias de Segredos Mágicos adicionais (Colégio do Conhecimento).");
    }
  }
  if (selection.level >= 10) {
    const picks = choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_10_KEY);
    if (picks.length < 2) {
      issues.push(`Escolha 2 magias de Segredos Mágicos (10º nível de ${name}).`);
    }
  }
  if (selection.level >= 14) {
    const picks = choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_14_KEY);
    if (picks.length < 2) {
      issues.push(`Escolha 2 magias de Segredos Mágicos (14º nível de ${name}).`);
    }
  }
  return issues;
}

export function getClassFeatureChoiceIssues(data: CharacterFormData): string[] {
  const issues: string[] = [];

  for (const selection of data.classes) {
    const { classId, subclassId, level } = selection;
    const className =
      DND_CLASSES.find((item) => item.id === classId)?.name ?? classId;

    if (
      classId === "fighter" ||
      classId === "paladin" ||
      classId === "ranger"
    ) {
      const minLevel = classId === "fighter" ? 1 : 2;
      if (level >= minLevel && !choiceValues(data.featureChoices, FIGHTING_STYLE_KEY)[0]) {
        issues.push(`Escolha o estilo de luta de ${className}.`);
      }
    }

    if (classId === "fighter" && subclassId === "champion" && level >= 10) {
      if (!choiceValues(data.featureChoices, FIGHTING_STYLE_2_KEY)[0]) {
        issues.push("Escolha o segundo estilo de luta (Campeão).");
      }
    }

    if (classId === "fighter" && subclassId === "battle-master" && level >= 3) {
      const limit = getBattleManeuverLimit(level);
      const selected = getSelectedManeuvers(data.featureChoices);
      if (selected.length < limit) {
        issues.push(
          `Escolha ${limit} manobra${limit === 1 ? "" : "s"} de Mestre de Batalha (${selected.length}/${limit}).`
        );
      }
    }

    if (classId === "sorcerer" && level >= 3) {
      const limit = getMetamagicLimit(level);
      const selected = getSelectedMetamagic(data.featureChoices);
      if (selected.length < limit) {
        issues.push(
          `Escolha ${limit} opção${limit === 1 ? "" : "ões"} de metamagia (${selected.length}/${limit}).`
        );
      }
    }

    if (
      classId === "sorcerer" &&
      subclassId === "draconic-bloodline" &&
      level >= 1
    ) {
      if (!choiceValues(data.featureChoices, DRACONIC_ANCESTRY_KEY)[0]) {
        issues.push("Escolha o ancestral dracônico.");
      }
    }

    if (
      classId === "druid" &&
      subclassId === "circle-of-the-land" &&
      level >= 2
    ) {
      if (!getLandTerrainId(data.featureChoices)) {
        issues.push("Escolha o terreno do Círculo da Terra.");
      }
      if (level >= 2 && !choiceValues(data.featureChoices, DRUID_LAND_BONUS_CANTRIP_KEY)[0]) {
        issues.push("Escolha o truque bônus do Círculo da Terra.");
      }
    }

    if (classId === "barbarian" && subclassId === "totem-warrior") {
      if (level >= 3 && !choiceValues(data.featureChoices, BARBARIAN_TOTEM_SPIRIT_KEY)[0]) {
        issues.push("Escolha o espírito totêmico (Urso, Águia ou Lobo).");
      }
      if (level >= 6 && !choiceValues(data.featureChoices, BARBARIAN_TOTEM_ASPECT_KEY)[0]) {
        issues.push("Escolha o aspecto da besta.");
      }
      if (level >= 14 && !choiceValues(data.featureChoices, BARBARIAN_TOTEM_ATTUNEMENT_KEY)[0]) {
        issues.push("Escolha a sintonia totêmica.");
      }
    }

    if (classId === "ranger") {
      const enemyLimit = favoredEnemyLimit(level);
      const enemies = choiceValues(data.featureChoices, RANGER_FAVORED_ENEMIES_KEY);
      if (enemies.length < enemyLimit) {
        issues.push(
          `Escolha ${enemyLimit} tipo(s) de inimigo favorito (${enemies.length}/${enemyLimit}).`
        );
      }
      const terrainLimit = favoredTerrainLimit(level);
      const terrains = choiceValues(data.featureChoices, RANGER_FAVORED_TERRAINS_KEY);
      if (terrains.length < terrainLimit) {
        issues.push(
          `Escolha ${terrainLimit} terreno(s) favorito(s) (${terrains.length}/${terrainLimit}).`
        );
      }
    }

    if (classId === "ranger" && subclassId === "hunter") {
      if (level >= 3 && !choiceValues(data.featureChoices, RANGER_HUNTER_PREY_KEY)[0]) {
        issues.push("Escolha a Presa do Caçador.");
      }
      if (level >= 7 && !choiceValues(data.featureChoices, RANGER_HUNTER_DEFENSE_KEY)[0]) {
        issues.push("Escolha a Tática Defensiva do Caçador.");
      }
      if (level >= 11 && !choiceValues(data.featureChoices, RANGER_HUNTER_MULTIATTACK_KEY)[0]) {
        issues.push("Escolha o Multiataque do Caçador.");
      }
      if (level >= 15 && !choiceValues(data.featureChoices, RANGER_HUNTER_SUPERIOR_KEY)[0]) {
        issues.push("Escolha a Defesa Superior do Caçador.");
      }
    }

    if (classId === "ranger" && subclassId === "beast-master" && level >= 3) {
      if (!choiceValues(data.featureChoices, RANGER_BEAST_COMPANION_KEY)[0]?.trim()) {
        issues.push("Informe a besta companheira (Mestre das Feras).");
      }
    }

    if (classId === "bard" && subclassId === "college-of-lore" && level >= 3) {
      if (!filledUnique(choiceValues(data.featureChoices, BARD_LORE_SKILLS_KEY), 3)) {
        issues.push("Escolha 3 perícias bônus do Colégio do Conhecimento.");
      }
    }

    const expKey = expertiseKey(classId);
    if (expKey) {
      const limit = getExpertiseLimit(classId, level);
      const picked = choiceValues(data.featureChoices, expKey);
      if (limit > 0 && picked.length < limit) {
        issues.push(
          `Escolha ${limit} perícia(s) com expertise de ${className} (${picked.length}/${limit}).`
        );
      }
    }

    if (subclassId === "knowledge-domain" && level >= 1) {
      if (!filledUnique(choiceValues(data.featureChoices, CLERIC_KNOWLEDGE_SKILLS_KEY), 2)) {
        issues.push("Domínio do Conhecimento: escolha 2 perícias.");
      }
      if (!filledUnique(choiceValues(data.featureChoices, CLERIC_KNOWLEDGE_LANGUAGES_KEY), 2)) {
        issues.push("Domínio do Conhecimento: escolha 2 idiomas.");
      }
    }

    if (subclassId === "nature-domain" && level >= 1) {
      if (!choiceValues(data.featureChoices, CLERIC_NATURE_SKILL_KEY)[0]) {
        issues.push("Domínio da Natureza: escolha 1 perícia.");
      }
      if (!choiceValues(data.featureChoices, CLERIC_NATURE_CANTRIP_KEY)[0]) {
        issues.push("Domínio da Natureza: escolha 1 truque de druida.");
      }
    }

    if (classId === "warlock" && level >= 3) {
      const pact = choiceValues(data.featureChoices, WARLOCK_PACT_BOON_KEY)[0];
      if (pact === "pact-of-the-chain" && !choiceValues(data.featureChoices, WARLOCK_CHAIN_FAMILIAR_KEY)[0]) {
        issues.push("Escolha a forma do familiar (Pacto da Corrente).");
      }
    }

    issues.push(...getMagicalSecretsIssues(data, selection));
  }

  if (hasSelectedFeat(data, "martial-adept")) {
    const maneuvers = getMartialAdeptManeuverIds(data);
    if (maneuvers.length < 2) {
      issues.push("Adepto Marcial: escolha 2 manobras.");
    }
  }

  return issues;
}

export function getClassFeatureSummaryLines(
  data: CharacterFormData
): string[] {
  const lines: string[] = [];
  const fc = data.featureChoices;

  const style = choiceValues(fc, FIGHTING_STYLE_KEY)[0];
  if (style) {
    lines.push(`Estilo de luta: ${style}`);
  }
  const style2 = choiceValues(fc, FIGHTING_STYLE_2_KEY)[0];
  if (style2) lines.push(`2º estilo: ${style2}`);

  const ancestry = choiceValues(fc, DRACONIC_ANCESTRY_KEY)[0];
  if (ancestry) {
    const entry = DRACONIC_ANCESTRIES.find((item) => item.id === ancestry);
    if (entry) lines.push(`Ancestral: ${entry.name} (${entry.damageType})`);
  }

  const terrain = getLandTerrainId(fc);
  if (terrain) {
    const name = LAND_TERRAINS.find((item) => item.id === terrain)?.name;
    if (name) lines.push(`Círculo da Terra: ${name}`);
  }

  const metamagic = getSelectedMetamagic(fc);
  if (metamagic.length > 0) {
    lines.push(
      `Metamagia: ${metamagic
        .map((id) => METAMAGIC_OPTIONS.find((item) => item.id === id)?.name ?? id)
        .join(", ")}`
    );
  }

  const battleMaster = getSelectedManeuvers(fc);
  if (battleMaster.length > 0) {
    lines.push(`Manobras (Mestre de Batalha): ${battleMaster.length} selecionada(s)`);
  }

  const martialAdept = getMartialAdeptManeuverIds(data);
  if (martialAdept.length > 0) {
    lines.push(
      `Adepto Marcial: ${martialAdept
        .map((id) => getBattleManeuver(id)?.name ?? id)
        .join(", ")}`
    );
  }

  return lines;
}

/** Magias de segredos mágicos escolhidas (ids). */
export function getClassFeatureBonusSkills(data: CharacterFormData): Skill[] {
  const skills: Skill[] = [];
  for (const selection of data.classes) {
    if (
      selection.classId === "bard" &&
      selection.subclassId === "college-of-lore" &&
      selection.level >= 3
    ) {
      skills.push(
        ...(choiceValues(data.featureChoices, BARD_LORE_SKILLS_KEY) as Skill[])
      );
    }
    if (selection.subclassId === "knowledge-domain" && selection.level >= 1) {
      skills.push(
        ...(choiceValues(
          data.featureChoices,
          CLERIC_KNOWLEDGE_SKILLS_KEY
        ) as Skill[])
      );
    }
    if (selection.subclassId === "nature-domain" && selection.level >= 1) {
      const skill = choiceValues(data.featureChoices, CLERIC_NATURE_SKILL_KEY)[0];
      if (skill) skills.push(skill as Skill);
    }
  }
  return skills.filter(Boolean);
}

export function getAllMagicalSecretSpellIds(data: CharacterFormData): string[] {
  return [
    ...choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_6_KEY),
    ...choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_10_KEY),
    ...choiceValues(data.featureChoices, BARD_MAGICAL_SECRETS_14_KEY),
  ].filter((id) => Boolean(getSpell(id)));
}
