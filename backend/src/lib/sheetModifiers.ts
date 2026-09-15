import type { Ability, Skill } from "./gameTypes";

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
};

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
  // half-elf style: +1 to two chosen abilities
  if (data.raceId === "half-elf") {
    for (const ability of choices) {
      if (isAbility(ability)) scores[ability] += 1;
    }
  }

  return scores;
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

  const flagged = Boolean(data.skills?.[skillId]?.proficient);
  const listed = [
    ...(data.skillProficiencies?.class ?? []),
    ...(data.skillProficiencies?.race ?? []),
    ...(data.skillProficiencies?.background ?? []),
    ...(data.skillProficiencies?.talent ?? []),
  ].includes(skillId);

  const proficient = flagged || listed;
  const expertise = Boolean(data.skills?.[skillId]?.expertise);
  const totalLevel =
    data.classes?.reduce((sum, item) => sum + (item.level ?? 0), 0) || 1;
  const bonus = proficiencyBonus(totalLevel);

  let modifier = base;
  if (proficient) modifier += bonus;
  if (expertise) modifier += bonus;

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
