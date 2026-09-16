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

export interface RaceTrait {
    id: string;
    name: string;
    description: string;
}

export interface CharacterSubrace {
    id: string;
    name: string;
    description?: string;
    abilityScoreIncrease?: Partial<Record<Ability, number>>;
    abilityScoreChoices?: {
        amount: number;
        count: number;
        abilities: Ability[];
    };
    /** Deslocamento em pés (sobrescreve o da raça base, se definido). */
    speed?: number;
    skillProficiencies?: Skill[];
    skillChoices?: {
        count: number;
        skills: Skill[];
    };
    traits?: RaceTrait[];
}

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

    skillProficiencies?: Skill[];

    skillChoices?: {
        count: number;
        skills: Skill[];
    };

    traits?: RaceTrait[];

    subraces?: CharacterSubrace[];
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

    startingEquipment?: StartingEquipment;

    subclasses: {
        id: string;
        name: string;
        level: number;
    }[];
}

export interface CharacterBackground {
    id: string;
    name: string;
    variantOf?: string;
    skillProficiencies: Skill[];
    toolProficiencies?: string[];
    toolChoice?: {
        count: number;
        options: string[];
    };
    languageChoices?: number;
    startingEquipment: EquipmentStack[];
    equipmentFromToolChoice?: boolean;
    startingGoldGp: number;
    feature: {
        name: string;
        description: string;
    };
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

export type AsiSelection =
    | {
        kind: "ability";
        mode: "single" | "split";
        abilities: Ability[];
    }
    | {
        kind: "feat";
        featId: string;
        featChoices: Record<string, string[]>;
    };

export type EquipmentCategory =
    | "weapon"
    | "armor"
    | "shield"
    | "ammunition"
    | "pack"
    | "tool"
    | "focus"
    | "gear";

export interface EquipmentItem {
    id: string;
    name: string;
    category: EquipmentCategory;
    weight: number;
}

export interface EquipmentStack {
    itemId: string;
    quantity: number;
}

export interface EquipmentAlternative {
    id: string;
    label: string;
    items: EquipmentStack[];
}

export interface EquipmentChoice {
    id: string;
    label: string;
    alternatives: EquipmentAlternative[];
}

export interface StartingEquipment {
    fixed: EquipmentStack[];
    choices: EquipmentChoice[];
}

export interface CharacterWallet {
    /** Peças de platina (1 PL = 10 PO) */
    pl: number;
    /** Peças de ouro */
    po: number;
    /** Peças de prata (10 PP = 1 PO) */
    pp: number;
}

export interface CharacterEquipmentData {
    classId: string;
    choiceSelections: Record<string, string>;
    manualItems: EquipmentStack[];
    /** Itens customizados (ex.: dados pelo mestre). */
    customItems?: CustomInventoryItem[];
    /**
     * Quantidades removidas do equipamento inicial (classe/antecedente).
     * Usado para descarte/transferência na mesa.
     */
    removedItems?: EquipmentStack[];
}

export interface CustomInventoryItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    weight?: number;
    category?: EquipmentCategory;
    /** Quem concedeu o item (opcional). */
    grantedByName?: string;
}

export type SpellSchool =
    | "abjuration"
    | "conjuration"
    | "divination"
    | "enchantment"
    | "evocation"
    | "illusion"
    | "necromancy"
    | "transmutation";

export type SpellcasterClassId =
    | "bard"
    | "cleric"
    | "druid"
    | "paladin"
    | "ranger"
    | "sorcerer"
    | "warlock"
    | "wizard";

export interface Spell {
    id: string;
    name: string;
    level: number;
    school: SpellSchool;
    classes: SpellcasterClassId[];
    ritual?: boolean;
    attack?: boolean;
    description?: string;
}

export interface ClassSpellSelection {
    cantrips: string[];
    known: string[];
    prepared: string[];
}

export interface CharacterSpellData {
    byClass: Record<string, ClassSpellSelection>;
    talent: {
        cantrips: string[];
        spells: string[];
    };
    byFeat: Record<string, {
        cantrips: string[];
        spells: string[];
    }>;
}

export interface CharacterLoreDetails {
    appearance: string;
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
}

export interface CharacterFormData {
    name: string;
    /** Foto do personagem (data URL ou URL). */
    avatar?: string | null;
    raceId: string;
    subraceId: string;
    raceChoices: Record<string, string[]>;
    classes: CharacterClassSelection[];
    talentId: string;
    talentChoices: Record<string, string | string[]>;
    backgroundId: string;
    backgroundChoices: {
        skills: Skill[];
        tools: string[];
        languages: string[];
    };
    alignment: Alignment | "";
    abilities: Record<Ability, number>;
    skills: Record<Skill, CharacterSkillData>;
    equipment: CharacterEquipmentData;
    /** Carteira de moedas do personagem. */
    wallet?: CharacterWallet;
    spells: CharacterSpellData;
    lore: string;
    quests: string;
    loreDetails: CharacterLoreDetails;
    hitPoints: number | null;
    asiSelections: Record<string, AsiSelection>;
    featureChoices: Record<string, string[]>;

    skillProficiencies?: {
        class?: Skill[];
        race?: Skill[];
        background?: Skill[];
        talent?: Skill[];
    };
}

export interface Character {
    id: number;
    name: string;
    className: string;
    race: string;
    level: number;
    avatar?: string | null;
    playerId: number;
    campaignId: number;
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