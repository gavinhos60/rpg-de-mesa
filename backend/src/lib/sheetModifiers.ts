import type { Ability, Skill } from "./gameTypes";
import {
  applyEquipmentToAbilityScores,
  type EquipmentSheetSlice,
} from "./equipmentBonuses";

export type { Ability, Skill };

const SKILL_ABILITY: Record<Skill, Ability> = {
  acrobatics: "dexterity",
  "animal-handling": "wisdom",
  arcana: "intelligence",
  athletics: "strength",
  deception: "charisma",
  history: "intelligence",
  insight: "wisdom",
  intimidation: "charisma",
  investigation: "intelligence",
  medicine: "wisdom",
  nature: "intelligence",
  perception: "wisdom",
  performance: "charisma",
  persuasion: "charisma",
  religion: "intelligence",
  "sleight-of-hand": "dexterity",
  stealth: "dexterity",
  survival: "wisdom",
};

const SKILL_LABELS: Record<Skill, string> = {
  acrobatics: "Acrobacia",
  "animal-handling": "Adestrar Animais",
  arcana: "Arcanismo",
  athletics: "Atletismo",
  deception: "Enganação",
  history: "História",
  insight: "Intuição",
  intimidation: "Intimidação",
  investigation: "Investigação",
  medicine: "Medicina",
  nature: "Natureza",
  perception: "Percepção",
  performance: "Atuação",
  persuasion: "Persuasão",
  religion: "Religião",
  "sleight-of-hand": "Prestidigitação",
  stealth: "Furtividade",
  survival: "Sobrevivência",
};

const ABILITY_LABELS: Record<Ability, string> = {
  strength: "Força",
  dexterity: "Destreza",
  constitution: "Constituição",
  intelligence: "Inteligência",
  wisdom: "Sabedoria",
  charisma: "Carisma",
};

type AsiSelection =
  | {
      kind: "ability";
      mode: "single" | "split";
      abilities: Ability[];
    }
  | {
      kind: "feat";
      featId: string;
      featChoices: {
        skills?: Skill[];
        ability?: string[];
      };
    };

type SheetLike = {
  abilities?: Partial<Record<Ability, number>>;
  skills?: Partial<Record<Skill, { proficient?: boolean; expertise?: boolean }>>;
  skillProficiencies?: {
    class?: Skill[];
    race?: Skill[];
    background?: Skill[];
    talent?: Skill[];
  };
  classes?: Array<{ level?: number; classId?: string; subclassId?: string }>;
  raceId?: string;
  subraceId?: string;
  raceChoices?: {
    abilityScoreIncrease?: string[];
  };
  talentId?: string;
  talentChoices?: Record<string, string | string[]>;
  asiSelections?: Record<string, AsiSelection>;
  featureChoices?: Record<string, string[]>;
  equipment?: EquipmentSheetSlice;
};

const STANDARD_ASI_LEVELS = [4, 8, 12, 16, 19] as const;

const CLASS_ASI_LEVELS: Record<string, readonly number[]> = {
  barbarian: STANDARD_ASI_LEVELS,
  bard: STANDARD_ASI_LEVELS,
  cleric: STANDARD_ASI_LEVELS,
  druid: STANDARD_ASI_LEVELS,
  fighter: [4, 6, 8, 12, 14, 16, 19],
  monk: STANDARD_ASI_LEVELS,
  paladin: STANDARD_ASI_LEVELS,
  ranger: STANDARD_ASI_LEVELS,
  rogue: [4, 8, 10, 12, 16, 19],
  sorcerer: STANDARD_ASI_LEVELS,
  warlock: STANDARD_ASI_LEVELS,
  wizard: STANDARD_ASI_LEVELS,
};

const BARD_LORE_SKILLS_KEY = "bard:lore-bonus-skills";
const CLERIC_KNOWLEDGE_SKILLS_KEY = "cleric:knowledge-skills";
const CLERIC_NATURE_SKILL_KEY = "cleric:nature-skill";

const MAX_ABILITY_SCORE = 20;

const RACE_ASI: Record<string, Partial<Record<Ability, number>>> = {
  human: {
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  },
  dwarf: { constitution: 2 },
  vampir: { constitution: 2, intelligence: 1 },
  elf: { dexterity: 2 },
  halfling: { dexterity: 2 },
  dragonborn: { strength: 2, charisma: 1 },
  gnome: { intelligence: 2 },
  "half-elf": { charisma: 2 },
  "half-orc": { strength: 2, constitution: 1 },
  tiefling: { charisma: 2 },
  kenku: { dexterity: 2, wisdom: 1 },
};

const SUBRACE_ASI: Record<string, Partial<Record<Ability, number>>> = {
  asmodeus: { intelligence: 1 },
  baalzebul: { intelligence: 1 },
  dispater: { dexterity: 1 },
  fierna: { wisdom: 1 },
  glasya: { dexterity: 1 },
  levistus: { constitution: 1 },
  mammon: { intelligence: 1 },
  mephistopheles: { intelligence: 1 },
  zariel: { strength: 1 },
};

function capScore(value: number): number {
  return Math.min(MAX_ABILITY_SCORE, value);
}

function getAsiMilestoneKeys(data: SheetLike): Set<string> {
  const keys = new Set<string>();
  for (const selection of data.classes ?? []) {
    const classId = selection.classId ?? "";
    const levels = CLASS_ASI_LEVELS[classId] ?? [];
    for (const level of levels) {
      if ((selection.level ?? 0) >= level) {
        keys.add(`${classId}:${level}`);
      }
    }
  }
  return keys;
}

function applyClassAsiBonuses(
  scores: Record<Ability, number>,
  data: SheetLike
) {
  const validKeys = getAsiMilestoneKeys(data);
  for (const [key, selection] of Object.entries(data.asiSelections ?? {})) {
    if (!validKeys.has(key) || selection.kind !== "ability") continue;

    if (selection.mode === "single") {
      const ability = selection.abilities[0];
      if (ability && isAbility(ability)) {
        scores[ability] = capScore(scores[ability] + 2);
      }
      continue;
    }

    for (const ability of [...new Set(selection.abilities)].slice(0, 2)) {
      if (isAbility(ability)) {
        scores[ability] = capScore(scores[ability] + 1);
      }
    }
  }
}

function applyInitialTalentBonus(
  scores: Record<Ability, number>,
  data: SheetLike
) {
  if (!data.talentId) return;
  const raw =
    data.talentChoices?.abilityScoreIncrease ?? data.talentChoices?.ability;
  const selected = Array.isArray(raw) ? raw[0] : raw;
  if (typeof selected === "string" && isAbility(selected)) {
    scores[selected] = capScore(scores[selected] + 1);
  }
}

function applyAsiFeatAbilityBonuses(
  scores: Record<Ability, number>,
  data: SheetLike
) {
  const validKeys = getAsiMilestoneKeys(data);
  for (const [key, selection] of Object.entries(data.asiSelections ?? {})) {
    if (!validKeys.has(key) || selection.kind !== "feat") continue;

    const raw = selection.featChoices.ability?.[0];
    if (typeof raw === "string" && isAbility(raw)) {
      scores[raw] = capScore(scores[raw] + 1);
    }
  }
}

function finalAbilityScores(data: SheetLike): Record<Ability, number> {
  const scores: Record<Ability, number> = {
    strength: data.abilities?.strength ?? 10,
    dexterity: data.abilities?.dexterity ?? 10,
    constitution: data.abilities?.constitution ?? 10,
    intelligence: data.abilities?.intelligence ?? 10,
    wisdom: data.abilities?.wisdom ?? 10,
    charisma: data.abilities?.charisma ?? 10,
  };

  const raceBonus = RACE_ASI[data.raceId ?? ""] ?? {};
  const subraceBonus = SUBRACE_ASI[data.subraceId ?? ""] ?? {};

  for (const ability of Object.keys(scores) as Ability[]) {
    scores[ability] += raceBonus[ability] ?? 0;
    scores[ability] += subraceBonus[ability] ?? 0;
  }

  const choices = data.raceChoices?.abilityScoreIncrease ?? [];
  for (const ability of choices) {
    if (isAbility(ability)) {
      scores[ability] = capScore(scores[ability] + 1);
    }
  }

  applyInitialTalentBonus(scores, data);
  applyClassAsiBonuses(scores, data);
  applyAsiFeatAbilityBonuses(scores, data);
  applyEquipmentToAbilityScores(scores, data.equipment, capScore);

  return scores;
}

function choiceValues(
  featureChoices: Record<string, string[]> | undefined,
  key: string
): string[] {
  return (featureChoices?.[key] ?? []).filter(Boolean);
}

function hasMonkeyPath(data: SheetLike): boolean {
  return (data.classes ?? []).some(
    (selection) =>
      selection.classId === "monk" &&
      selection.subclassId === "way-of-the-monkey" &&
      (selection.level ?? 0) >= 3
  );
}

function getAsiFeatSkills(data: SheetLike): Skill[] {
  const validKeys = getAsiMilestoneKeys(data);
  return Object.entries(data.asiSelections ?? {}).flatMap(([key, selection]) => {
    if (
      !validKeys.has(key) ||
      selection.kind !== "feat" ||
      selection.featId !== "skilled"
    ) {
      return [];
    }
    return (selection.featChoices.skills ?? []).filter(isSkill);
  });
}

function getClassFeatureBonusSkills(data: SheetLike): Skill[] {
  const skills: Skill[] = [];
  for (const selection of data.classes ?? []) {
    if (
      selection.classId === "bard" &&
      selection.subclassId === "college-of-lore" &&
      (selection.level ?? 0) >= 3
    ) {
      skills.push(
        ...choiceValues(data.featureChoices, BARD_LORE_SKILLS_KEY).filter(
          isSkill
        )
      );
    }
    if (
      selection.subclassId === "knowledge-domain" &&
      (selection.level ?? 0) >= 1
    ) {
      skills.push(
        ...choiceValues(data.featureChoices, CLERIC_KNOWLEDGE_SKILLS_KEY).filter(
          isSkill
        )
      );
    }
    if (selection.subclassId === "nature-domain" && (selection.level ?? 0) >= 1) {
      const skill = choiceValues(data.featureChoices, CLERIC_NATURE_SKILL_KEY)[0];
      if (skill && isSkill(skill)) skills.push(skill);
    }
  }
  return skills;
}

function getProficientSkills(data: SheetLike): Set<Skill> {
  const flagged = Object.entries(data.skills ?? {})
    .filter(([, value]) => value?.proficient)
    .map(([id]) => id as Skill)
    .filter(isSkill);

  return new Set<Skill>([
    ...(data.skillProficiencies?.class ?? []),
    ...(data.skillProficiencies?.race ?? []),
    ...(data.skillProficiencies?.background ?? []),
    ...(data.skillProficiencies?.talent ?? []),
    ...getAsiFeatSkills(data),
    ...getClassFeatureBonusSkills(data),
    ...(hasMonkeyPath(data) ? (["deception"] as Skill[]) : []),
    ...flagged,
  ]);
}

function getSkillExtraBonus(
  data: SheetLike,
  skill: Skill,
  scores: Record<Ability, number>
): number {
  if (hasMonkeyPath(data) && skill === "deception") {
    return abilityModifier(scores.wisdom);
  }
  return 0;
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function proficiencyBonus(totalLevel: number): number {
  return Math.floor((Math.max(1, totalLevel) - 1) / 4) + 2;
}

function isSkill(value: string): value is Skill {
  return value in SKILL_ABILITY;
}

function isAbility(value: string): value is Ability {
  return value in ABILITY_LABELS;
}

export function getSkillLabel(skill: string): string {
  return isSkill(skill) ? SKILL_LABELS[skill] : skill;
}

export function getAbilityLabel(ability: string): string {
  return isAbility(ability) ? ABILITY_LABELS[ability] : ability;
}

export function resolveSkillModifier(
  sheet: unknown,
  skillId: string
): { modifier: number; label: string; proficient: boolean } | null {
  if (!isSkill(skillId)) return null;
  const data = (sheet ?? {}) as SheetLike;
  const ability = SKILL_ABILITY[skillId];
  const scores = finalAbilityScores(data);
  const base = abilityModifier(scores[ability]);
  const proficient = getProficientSkills(data).has(skillId);
  const expertise = Boolean(data.skills?.[skillId]?.expertise);
  const totalLevel =
    data.classes?.reduce((sum, item) => sum + (item.level ?? 0), 0) || 1;
  const bonus = proficiencyBonus(totalLevel);
  const extra = getSkillExtraBonus(data, skillId, scores);

  let modifier = base;
  if (proficient) modifier += bonus;
  if (expertise) modifier += bonus;
  modifier += extra;

  return {
    modifier,
    label: SKILL_LABELS[skillId],
    proficient,
  };
}

export function resolveAbilityModifier(
  sheet: unknown,
  abilityId: string
): { modifier: number; label: string } | null {
  if (!isAbility(abilityId)) return null;
  const data = (sheet ?? {}) as SheetLike;
  const scores = finalAbilityScores(data);
  return {
    modifier: abilityModifier(scores[abilityId]),
    label: ABILITY_LABELS[abilityId],
  };
}
