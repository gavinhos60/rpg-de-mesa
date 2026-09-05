import type {
    Ability,
    CharacterClass,
} from "../../types/character";

export const DND_CLASSES: CharacterClass[] = [
    {
        id: "barbarian",
        name: "Bárbaro",

        hitDie: 12,

        multiclassAbilities: [
            "strength",
            "constitution",
        ],

        savingThrowProficiencies: [
            "strength",
            "constitution",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "animal-handling",
                "athletics",
                "intimidation",
                "nature",
                "perception",
                "survival",
            ],
        },

        subclasses: [
            {
                id: "berserker",
                name: "Caminho do Berserker",
                level: 3,
            },
            {
                id: "totem-warrior",
                name: "Caminho do Guerreiro Totêmico",
                level: 3,
            },
        ],
    },

    {
        id: "bard",
        name: "Bardo",

        hitDie: 8,

        multiclassAbilities: [
            "charisma",
        ],

        savingThrowProficiencies: [
            "dexterity",
            "charisma",
        ],

        skillProficiencies: {
            choose: 3,
            from: [
                "acrobatics",
                "animal-handling",
                "arcana",
                "athletics",
                "deception",
                "history",
                "insight",
                "intimidation",
                "investigation",
                "medicine",
                "nature",
                "perception",
                "performance",
                "persuasion",
                "religion",
                "sleight-of-hand",
                "stealth",
                "survival",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "acrobatics",
                "animal-handling",
                "arcana",
                "athletics",
                "deception",
                "history",
                "insight",
                "intimidation",
                "investigation",
                "medicine",
                "nature",
                "perception",
                "performance",
                "persuasion",
                "religion",
                "sleight-of-hand",
                "stealth",
                "survival",
            ],
        },

        subclasses: [
            {
                id: "college-of-lore",
                name: "Colégio do Conhecimento",
                level: 3,
            },
            {
                id: "college-of-valor",
                name: "Colégio do Valor",
                level: 3,
            },
        ],
    },

    {
        id: "cleric",
        name: "Clérigo",

        hitDie: 8,

        multiclassAbilities: [
            "wisdom",
        ],

        savingThrowProficiencies: [
            "wisdom",
            "charisma",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "history",
                "insight",
                "medicine",
                "persuasion",
                "religion",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "history",
                "insight",
                "medicine",
                "persuasion",
                "religion",
            ],
        },

        subclasses: [
            {
                id: "knowledge-domain",
                name: "Domínio do Conhecimento",
                level: 1,
            },
            {
                id: "life-domain",
                name: "Domínio da Vida",
                level: 1,
            },
            {
                id: "light-domain",
                name: "Domínio da Luz",
                level: 1,
            },
            {
                id: "nature-domain",
                name: "Domínio da Natureza",
                level: 1,
            },
            {
                id: "tempest-domain",
                name: "Domínio da Tempestade",
                level: 1,
            },
            {
                id: "trickery-domain",
                name: "Domínio da Enganação",
                level: 1,
            },
            {
                id: "war-domain",
                name: "Domínio da Guerra",
                level: 1,
            },
        ],
    },

    {
        id: "druid",
        name: "Druida",

        hitDie: 8,

        multiclassAbilities: [
            "wisdom",
        ],

        savingThrowProficiencies: [
            "intelligence",
            "wisdom",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "animal-handling",
                "arcana",
                "insight",
                "medicine",
                "nature",
                "perception",
                "religion",
                "survival",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "animal-handling",
                "arcana",
                "insight",
                "medicine",
                "nature",
                "perception",
                "religion",
                "survival",
            ],
        },

        subclasses: [
            {
                id: "circle-of-the-land",
                name: "Círculo da Terra",
                level: 2,
            },
            {
                id: "circle-of-the-moon",
                name: "Círculo da Lua",
                level: 2,
            },
        ],
    },

    {
        id: "fighter",
        name: "Guerreiro",

        hitDie: 10,

        multiclassAbilities: [
            "strength",
            "dexterity",
        ],

        savingThrowProficiencies: [
            "strength",
            "constitution",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "acrobatics",
                "animal-handling",
                "athletics",
                "history",
                "insight",
                "intimidation",
                "perception",
                "survival",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "acrobatics",
                "animal-handling",
                "athletics",
                "history",
                "insight",
                "intimidation",
                "perception",
                "survival",
            ],
        },

        subclasses: [
            {
                id: "champion",
                name: "Campeão",
                level: 3,
            },
            {
                id: "battle-master",
                name: "Mestre de Batalha",
                level: 3,
            },
            {
                id: "eldritch-knight",
                name: "Cavaleiro Arcano",
                level: 3,
            },
        ],
    },

    {
        id: "monk",
        name: "Monge",

        hitDie: 8,

        multiclassAbilities: [
            "dexterity",
            "wisdom",
        ],

        savingThrowProficiencies: [
            "strength",
            "dexterity",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "acrobatics",
                "athletics",
                "history",
                "insight",
                "religion",
                "stealth",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "acrobatics",
                "athletics",
                "history",
                "insight",
                "religion",
                "stealth",
            ],
        },

        subclasses: [
            {
                id: "way-of-the-open-hand",
                name: "Caminho da Mão Aberta",
                level: 3,
            },
            {
                id: "way-of-shadow",
                name: "Caminho da Sombra",
                level: 3,
            },
            {
                id: "way-of-four-elements",
                name: "Caminho dos Quatro Elementos",
                level: 3,
            },
        ],
    },

    {
        id: "paladin",
        name: "Paladino",

        hitDie: 10,

        multiclassAbilities: [
            "strength",
            "charisma",
        ],

        savingThrowProficiencies: [
            "wisdom",
            "charisma",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "athletics",
                "insight",
                "intimidation",
                "medicine",
                "persuasion",
                "religion",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "athletics",
                "insight",
                "intimidation",
                "medicine",
                "persuasion",
                "religion",
            ],
        },

        subclasses: [
            {
                id: "oath-of-devotion",
                name: "Juramento de Devoção",
                level: 3,
            },
            {
                id: "oath-of-ancients",
                name: "Juramento dos Anciões",
                level: 3,
            },
            {
                id: "oath-of-vengeance",
                name: "Juramento de Vingança",
                level: 3,
            },
        ],
    },

    {
        id: "ranger",
        name: "Patrulheiro",

        hitDie: 10,

        multiclassAbilities: [
            "dexterity",
            "wisdom",
        ],

        savingThrowProficiencies: [
            "strength",
            "dexterity",
        ],

        skillProficiencies: {
            choose: 3,
            from: [
                "animal-handling",
                "athletics",
                "insight",
                "investigation",
                "nature",
                "perception",
                "stealth",
                "survival",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "animal-handling",
                "athletics",
                "insight",
                "investigation",
                "nature",
                "perception",
                "stealth",
                "survival",
            ],
        },

        subclasses: [
            {
                id: "hunter",
                name: "Caçador",
                level: 3,
            },
            {
                id: "beast-master",
                name: "Mestre das Feras",
                level: 3,
            },
        ],
    },

    {
        id: "rogue",
        name: "Ladino",

        hitDie: 8,

        multiclassAbilities: [
            "dexterity",
        ],

        savingThrowProficiencies: [
            "dexterity",
            "intelligence",
        ],

        skillProficiencies: {
            choose: 4,
            from: [
                "acrobatics",
                "athletics",
                "deception",
                "insight",
                "intimidation",
                "investigation",
                "perception",
                "performance",
                "sleight-of-hand",
                "stealth",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "acrobatics",
                "athletics",
                "deception",
                "insight",
                "intimidation",
                "investigation",
                "perception",
                "performance",
                "sleight-of-hand",
                "stealth",
            ],
        },

        subclasses: [
            {
                id: "thief",
                name: "Ladrão",
                level: 3,
            },
            {
                id: "assassin",
                name: "Assassino",
                level: 3,
            },
            {
                id: "arcane-trickster",
                name: "Trapaceiro Arcano",
                level: 3,
            },
        ],
    },

    {
        id: "sorcerer",
        name: "Feiticeiro",

        hitDie: 6,

        multiclassAbilities: [
            "charisma",
        ],

        savingThrowProficiencies: [
            "constitution",
            "charisma",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "arcana",
                "deception",
                "insight",
                "intimidation",
                "persuasion",
                "religion",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "arcana",
                "deception",
                "insight",
                "intimidation",
                "persuasion",
                "religion",
            ],
        },

        subclasses: [
            {
                id: "draconic-bloodline",
                name: "Linhagem Dracônica",
                level: 1,
            },
            {
                id: "wild-magic",
                name: "Magia Selvagem",
                level: 1,
            },
        ],
    },

    {
        id: "warlock",
        name: "Bruxo",

        hitDie: 8,

        multiclassAbilities: [
            "charisma",
        ],

        savingThrowProficiencies: [
            "wisdom",
            "charisma",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "arcana",
                "deception",
                "history",
                "intimidation",
                "investigation",
                "nature",
                "religion",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "arcana",
                "deception",
                "history",
                "intimidation",
                "investigation",
                "nature",
                "religion",
            ],
        },

        subclasses: [
            {
                id: "archfey",
                name: "O Arquifada",
                level: 1,
            },
            {
                id: "fiend",
                name: "O Ínfero",
                level: 1,
            },
            {
                id: "great-old-one",
                name: "O Grande Antigo",
                level: 1,
            },
        ],
    },

    {
        id: "wizard",
        name: "Mago",

        hitDie: 6,

        multiclassAbilities: [
            "intelligence",
        ],

        savingThrowProficiencies: [
            "intelligence",
            "wisdom",
        ],

        skillProficiencies: {
            choose: 2,
            from: [
                "arcana",
                "history",
                "insight",
                "investigation",
                "medicine",
                "religion",
            ],
        },

        multiclassSkillProficiencies: {
            choose: 1,
            from: [
                "arcana",
                "history",
                "insight",
                "investigation",
                "medicine",
                "religion",
            ],
        },

        subclasses: [
            {
                id: "school-of-abjuration",
                name: "Escola de Abjuração",
                level: 2,
            },
            {
                id: "school-of-conjuration",
                name: "Escola de Conjuração",
                level: 2,
            },
            {
                id: "school-of-divination",
                name: "Escola de Adivinhação",
                level: 2,
            },
            {
                id: "school-of-enchantment",
                name: "Escola de Encantamento",
                level: 2,
            },
            {
                id: "school-of-evocation",
                name: "Escola de Evocação",
                level: 2,
            },
            {
                id: "school-of-illusion",
                name: "Escola de Ilusão",
                level: 2,
            },
            {
                id: "school-of-necromancy",
                name: "Escola de Necromancia",
                level: 2,
            },
            {
                id: "school-of-transmutation",
                name: "Escola de Transmutação",
                level: 2,
            },
        ],
    },
];