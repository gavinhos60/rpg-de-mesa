import type { MonsterSize } from "../data/dnd/monsters";
import type { Ability } from "./character";

export type CustomMonsterAbilityScores = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type CustomMonsterActionForm = {
  id: string;
  name: string;
  description: string;
  attackBonus?: string;
  damage?: string;
  saveDc?: string;
  /** Atributo da salvaguarda (5e). */
  saveAbility?: Ability | "";
};

/** Perícia marcada na ficha — bônus total = mod do atributo + prof (se marcada) + extra. */
export type MonsterSkillEntry = {
  proficient?: boolean;
  advantage?: boolean;
  extraBonus?: number;
};

export type CustomMonsterSheet = {
  creatureType?: string;
  size?: MonsterSize;
  alignment?: string;
  ac: string;
  hp: string;
  hpFormula?: string;
  speedWalk?: string;
  speedFly?: string;
  speedOther?: string;
  abilities: CustomMonsterAbilityScores;
  savingThrows?: string;
  /** Legado: string livre; preferir listas. */
  damageResistances?: string | string[];
  damageImmunities?: string | string[];
  conditionImmunities?: string | string[];
  senses?: string;
  languages?: string | string[];
  /** @deprecated use skillProficiencies */
  skillBonuses?: Record<string, number>;
  skillProficiencies?: Record<string, MonsterSkillEntry>;
  cr?: string;
  traits: CustomMonsterActionForm[];
  actions: CustomMonsterActionForm[];
  reactions?: CustomMonsterActionForm[];
  legendaryActions?: CustomMonsterActionForm[];
};

export function normalizeMonsterOptionList(
  value: string | string[] | undefined | null
): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (!value?.trim()) return [];
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatMonsterOptionList(items: string[]): string {
  return items.filter(Boolean).join(", ") || "—";
}

export function emptyCustomMonsterSheet(): CustomMonsterSheet {
  return {
    ac: "",
    hp: "",
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    traits: [],
    actions: [],
    reactions: [],
    legendaryActions: [],
    skillProficiencies: {},
    size: "Medium",
    creatureType: "monstro",
  };
}

export function emptyCustomMonsterAction(): CustomMonsterActionForm {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    description: "",
  };
}
