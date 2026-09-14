import type {
    CharacterClass,
    EquipmentAlternative,
} from "../../types/character";
import {
    alternatives,
    getEquipmentItem,
    MARTIAL_MELEE_WEAPON_IDS,
    MARTIAL_WEAPON_IDS,
    SIMPLE_MELEE_WEAPON_IDS,
    SIMPLE_WEAPON_IDS,
    stack,
} from "./equipment";

const option = (
    id: string,
    label: string,
    ...items: ReturnType<typeof stack>[]
): EquipmentAlternative => ({ id, label, items });

const equipmentName = (itemId: string) =>
    getEquipmentItem(itemId)?.name ?? itemId;

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

        startingEquipment: {
            fixed: [stack("explorer-pack"), stack("javelin", 4)],
            choices: [
                {
                    id: "barbarian-primary-weapon",
                    label: "Arma principal",
                    alternatives: [
                        option("greataxe", "Machado grande", stack("greataxe")),
                        ...alternatives(MARTIAL_MELEE_WEAPON_IDS).filter(
                            (entry) => entry.id !== "greataxe"
                        ),
                    ],
                },
                {
                    id: "barbarian-secondary-weapon",
                    label: "Armas secundárias",
                    alternatives: [
                        option("two-handaxes", "Duas machadinhas", stack("handaxe", 2)),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
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

        startingEquipment: {
            fixed: [stack("leather-armor"), stack("dagger")],
            choices: [
                {
                    id: "bard-weapon",
                    label: "Arma",
                    alternatives: [
                        option("rapier", "Rapieira", stack("rapier")),
                        option("longsword", "Espada longa", stack("longsword")),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "bard-pack",
                    label: "Pacote",
                    alternatives: [
                        option("diplomat-pack", "Pacote de diplomata", stack("diplomat-pack")),
                        option("entertainer-pack", "Pacote de artista", stack("entertainer-pack")),
                    ],
                },
                {
                    id: "bard-instrument",
                    label: "Instrumento musical",
                    alternatives: alternatives(["lute", "flute", "drum", "lyre", "horn"]),
                },
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

        startingEquipment: {
            fixed: [stack("shield"), stack("holy-symbol")],
            choices: [
                {
                    id: "cleric-weapon",
                    label: "Arma principal",
                    alternatives: [
                        option("mace", "Maça", stack("mace")),
                        option("warhammer", "Martelo de guerra (se proficiente)", stack("warhammer")),
                    ],
                },
                {
                    id: "cleric-armor",
                    label: "Armadura",
                    alternatives: [
                        option("scale-mail", "Brunea", stack("scale-mail")),
                        option("leather-armor", "Armadura de couro", stack("leather-armor")),
                        option("chain-mail", "Cota de malha (se proficiente)", stack("chain-mail")),
                    ],
                },
                {
                    id: "cleric-ranged",
                    label: "Arma adicional",
                    alternatives: [
                        option("light-crossbow-kit", "Besta leve e 20 virotes", stack("light-crossbow"), stack("crossbow-bolts", 20)),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "cleric-pack",
                    label: "Pacote",
                    alternatives: alternatives(["priest-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("leather-armor"), stack("explorer-pack"), stack("druidic-focus")],
            choices: [
                {
                    id: "druid-shield",
                    label: "Defesa ou arma",
                    alternatives: [
                        option("wooden-shield", "Escudo de madeira", stack("wooden-shield")),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "druid-weapon",
                    label: "Arma",
                    alternatives: [
                        option("scimitar", "Cimitarra", stack("scimitar")),
                        ...alternatives(SIMPLE_MELEE_WEAPON_IDS),
                    ],
                },
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

        startingEquipment: {
            fixed: [],
            choices: [
                {
                    id: "fighter-armor",
                    label: "Armadura",
                    alternatives: [
                        option("chain-mail", "Cota de malha", stack("chain-mail")),
                        option("leather-longbow", "Couro, arco longo e 20 flechas", stack("leather-armor"), stack("longbow"), stack("arrows", 20)),
                    ],
                },
                {
                    id: "fighter-weapons",
                    label: "Armas principais",
                    alternatives: [
                        ...MARTIAL_WEAPON_IDS.map((itemId) =>
                            option(`${itemId}-shield`, `${equipmentName(itemId)} e escudo`, stack(itemId), stack("shield"))
                        ),
                        ...MARTIAL_WEAPON_IDS.map((itemId) =>
                            option(`two-${itemId}`, `Duas: ${equipmentName(itemId)}`, stack(itemId, 2))
                        ),
                    ],
                },
                {
                    id: "fighter-secondary",
                    label: "Arma secundária",
                    alternatives: [
                        option("light-crossbow-kit", "Besta leve e 20 virotes", stack("light-crossbow"), stack("crossbow-bolts", 20)),
                        option("two-handaxes", "Duas machadinhas", stack("handaxe", 2)),
                    ],
                },
                {
                    id: "fighter-pack",
                    label: "Pacote",
                    alternatives: alternatives(["dungeoneer-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("dart", 10)],
            choices: [
                {
                    id: "monk-weapon",
                    label: "Arma",
                    alternatives: [
                        option("shortsword", "Espada curta", stack("shortsword")),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "monk-pack",
                    label: "Pacote",
                    alternatives: alternatives(["dungeoneer-pack", "explorer-pack"]),
                },
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
            {
                id: "way-of-the-monkey",
                name: "Caminho do Macaco",
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

        startingEquipment: {
            fixed: [stack("chain-mail"), stack("holy-symbol")],
            choices: [
                {
                    id: "paladin-weapons",
                    label: "Armas principais",
                    alternatives: [
                        ...MARTIAL_WEAPON_IDS.map((itemId) =>
                            option(`${itemId}-shield`, `${equipmentName(itemId)} e escudo`, stack(itemId), stack("shield"))
                        ),
                        ...MARTIAL_WEAPON_IDS.map((itemId) =>
                            option(`two-${itemId}`, `Duas: ${equipmentName(itemId)}`, stack(itemId, 2))
                        ),
                    ],
                },
                {
                    id: "paladin-secondary",
                    label: "Arma adicional",
                    alternatives: [
                        option("five-javelins", "Cinco azagaias", stack("javelin", 5)),
                        ...alternatives(SIMPLE_MELEE_WEAPON_IDS),
                    ],
                },
                {
                    id: "paladin-pack",
                    label: "Pacote",
                    alternatives: alternatives(["priest-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("longbow"), stack("arrows", 20)],
            choices: [
                {
                    id: "ranger-armor",
                    label: "Armadura",
                    alternatives: alternatives(["scale-mail", "leather-armor"]),
                },
                {
                    id: "ranger-weapons",
                    label: "Armas corpo a corpo",
                    alternatives: [
                        option("two-shortswords", "Duas espadas curtas", stack("shortsword", 2)),
                        ...SIMPLE_MELEE_WEAPON_IDS.map((itemId) =>
                            option(`two-${itemId}`, `Duas: ${equipmentName(itemId)}`, stack(itemId, 2))
                        ),
                    ],
                },
                {
                    id: "ranger-pack",
                    label: "Pacote",
                    alternatives: alternatives(["dungeoneer-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("leather-armor"), stack("dagger", 2), stack("thieves-tools")],
            choices: [
                {
                    id: "rogue-primary",
                    label: "Arma principal",
                    alternatives: alternatives(["rapier", "shortsword"]),
                },
                {
                    id: "rogue-secondary",
                    label: "Arma secundária",
                    alternatives: [
                        option("shortbow", "Arco curto e 20 flechas", stack("shortbow"), stack("arrows", 20)),
                        option("shortsword", "Espada curta", stack("shortsword")),
                    ],
                },
                {
                    id: "rogue-pack",
                    label: "Pacote",
                    alternatives: alternatives(["burglar-pack", "dungeoneer-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("dagger", 2)],
            choices: [
                {
                    id: "sorcerer-weapon",
                    label: "Arma",
                    alternatives: [
                        option("light-crossbow-kit", "Besta leve e 20 virotes", stack("light-crossbow"), stack("crossbow-bolts", 20)),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "sorcerer-focus",
                    label: "Foco de conjuração",
                    alternatives: alternatives(["component-pouch", "arcane-focus"]),
                },
                {
                    id: "sorcerer-pack",
                    label: "Pacote",
                    alternatives: alternatives(["dungeoneer-pack", "explorer-pack"]),
                },
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

        startingEquipment: {
            fixed: [stack("leather-armor"), stack("dagger", 2)],
            choices: [
                {
                    id: "warlock-ranged",
                    label: "Arma à distância",
                    alternatives: [
                        option("light-crossbow-kit", "Besta leve e 20 virotes", stack("light-crossbow"), stack("crossbow-bolts", 20)),
                        ...alternatives(SIMPLE_WEAPON_IDS),
                    ],
                },
                {
                    id: "warlock-focus",
                    label: "Foco de conjuração",
                    alternatives: alternatives(["component-pouch", "arcane-focus"]),
                },
                {
                    id: "warlock-pack",
                    label: "Pacote",
                    alternatives: alternatives(["scholar-pack", "dungeoneer-pack"]),
                },
                {
                    id: "warlock-weapon",
                    label: "Arma corpo a corpo",
                    alternatives: alternatives(SIMPLE_WEAPON_IDS),
                },
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

        startingEquipment: {
            fixed: [stack("spellbook")],
            choices: [
                {
                    id: "wizard-weapon",
                    label: "Arma",
                    alternatives: alternatives(["quarterstaff", "dagger"]),
                },
                {
                    id: "wizard-focus",
                    label: "Foco de conjuração",
                    alternatives: alternatives(["component-pouch", "arcane-focus"]),
                },
                {
                    id: "wizard-pack",
                    label: "Pacote",
                    alternatives: alternatives(["scholar-pack", "explorer-pack"]),
                },
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