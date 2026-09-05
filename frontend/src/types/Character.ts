export type Ability =
    | "strength"
    | "dexterity"
    | "constitution"
    | "intelligence"
    | "wisdom"
    | "charisma";

export type Alignment =
    | "lawful-good"
    | "neutral-good"
    | "chaotic-good"
    | "lawful-neutral"
    | "true-neutral"
    | "chaotic-neutral"
    | "lawful-evil"
    | "neutral-evil"
    | "chaotic-evil";

export interface CharacterRace {
    id: string;
    name: string;

    abilityScoreIncrease?: Partial<Record<Ability, number>>;

    abilityScoreChoices?: {
        amount: number;
        count: number;
        abilities: Ability[];
    };

    speed?: number;

    languages?: string[];

    skillChoices?: {
        count: number;
        skills: Skill[];
    };

    traits?: {
        id: string;
        name: string;
        description: string;
    }[];
}


export interface CharacterSubclass {
    id: string;
    name: string;
    level: number;
}

export interface CharacterClass {
    id: string;
    name: string;

    hitDie: 6 | 8 | 10 | 12;

    multiclassAbilities: Ability[];

    savingThrowProficiencies: Ability[];

    skillProficiencies: {
        choose: number;
        from: Skill[];
    };

    multiclassSkillProficiencies?: {
        choose: number;
        from: Skill[];
    };

    subclasses: {
        id: string;
        name: string;
        level: number;
    }[];
}

export interface CharacterBackground {
    id: string;
    name: string;
}

export interface CharacterTalent {
    id: string;
    name: string;
    source: string;

    prerequisites?: {
        abilities?: Partial<Record<Ability, number>>;
        race?: string[];
        class?: string[];
        proficiency?: string[];
    };

    abilityScoreIncrease?: {
        amount: number;
        choices?: Ability[];
    };

    effects?: {
        hitPoints?: number;
        armorClass?: number;
        speed?: number;
        proficiencies?: string[];
        languages?: string[];
    };

    choices?: CharacterTalentChoice[];

    description: string;
}

export interface CharacterTalentChoice {
    id: string;

    type:
    | "ability"
    | "skill"
    | "tool"
    | "language"
    | "spell"
    | "class"
    | "custom";

    name: string;
    description: string;

    count: number;

    options?: string[];

    excludeProficient?: boolean;
}

export interface CharacterClassSelection {
    classId: string;
    level: number;
    subclassId: string;
}

export interface CharacterFormData {
    name: string;
    raceId: string;
    raceChoices: Record<string, string[]>;
    classes: CharacterClassSelection[];
    talentId: string;
    talentChoices: Record<string, string[]>;
    backgroundId: string;
    alignment: Alignment | "";
    abilities: Record<Ability, number>;
    skills: Record<Skill, CharacterSkillData>;

    skillProficiencies?: {
        class: Skill[];
        race: Skill[];
        background: Skill[];
    };
}

export type Skill =
    | "acrobatics"
    | "animal-handling"
    | "arcana"
    | "athletics"
    | "deception"
    | "history"
    | "insight"
    | "intimidation"
    | "investigation"
    | "medicine"
    | "nature"
    | "perception"
    | "performance"
    | "persuasion"
    | "religion"
    | "sleight-of-hand"
    | "stealth"
    | "survival";

export interface CharacterSkillData {
    proficient: boolean;
    expertise: boolean;
}

export interface CharacterClass {
    id: string;
    name: string;

    multiclassAbilities: Ability[];

    skillProficiencies?: {
        class: Skill[];
        race: Skill[];
        background: Skill[];
        talent: Skill[];
    };

    multiclassSkillProficiencies?: {
        choose: number;
        from: Skill[];
    };

    subclasses: {
        id: string;
        name: string;
        level: number;
    }[];
}