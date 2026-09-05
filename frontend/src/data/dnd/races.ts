import type { CharacterRace } from "../../types/character";

export const DND_RACES: CharacterRace[] = [
    {
        id: "human",
        name: "Humano",
        abilityScoreIncrease: {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 1,
        },
        speed: 30,
        languages: ["Comum", "Um idioma adicional"],
        traits: [
            {
                id: "human-versatility",
                name: "Versatilidade",
                description:
                    "Seus atributos são equilibrados, recebendo +1 em cada atributo.",
            },
        ],
    },

    {
        id: "dwarf",
        name: "Anão",
        abilityScoreIncrease: {
            constitution: 2,
        },
        speed: 25,
        languages: ["Comum", "Anão"],
        traits: [
            {
                id: "dwarven-resilience",
                name: "Resiliência Anã",
                description:
                    "Você possui resistência natural contra venenos.",
            },
        ],
    },

    {
        id: "elf",
        name: "Elfo",
        abilityScoreIncrease: {
            dexterity: 2,
        },
        speed: 30,
        languages: ["Comum", "Élfico"],
        traits: [
            {
                id: "darkvision",
                name: "Visão no Escuro",
                description:
                    "Você consegue enxergar no escuro dentro de determinados limites.",
            },
            {
                id: "fey-ancestry",
                name: "Ancestralidade Feérica",
                description:
                    "Você possui vantagens contra determinados efeitos mágicos.",
            },
        ],
    },

    {
        id: "halfling",
        name: "Halfling",
        abilityScoreIncrease: {
            dexterity: 2,
        },
        speed: 25,
        languages: ["Comum", "Halfling"],
        traits: [
            {
                id: "lucky",
                name: "Sortudo",
                description:
                    "Sua sorte permite melhorar determinados resultados de suas jogadas.",
            },
        ],
    },

    {
        id: "dragonborn",
        name: "Draconato",
        abilityScoreIncrease: {
            strength: 2,
            charisma: 1,
        },
        speed: 30,
        languages: ["Comum", "Dracônico"],
        traits: [
            {
                id: "draconic-ancestry",
                name: "Ancestralidade Dracônica",
                description:
                    "Você possui uma ancestralidade ligada a um tipo de dragão.",
            },
        ],
    },

    {
        id: "gnome",
        name: "Gnomo",
        abilityScoreIncrease: {
            intelligence: 2,
        },
        speed: 25,
        languages: ["Comum", "Gnômico"],
        traits: [
            {
                id: "gnome-cunning",
                name: "Esperteza Gnômica",
                description:
                    "Você possui grande resistência mental contra determinados efeitos mágicos.",
            },
        ],
    },

    {
        id: "half-elf",
        name: "Meio-Elfo",

        abilityScoreIncrease: {
            charisma: 2,
        },

        abilityScoreChoices: {
            amount: 1,
            count: 2,
            abilities: [
                "strength",
                "dexterity",
                "constitution",
                "intelligence",
                "wisdom",
            ],
        },

        speed: 30,

        languages: [
            "Comum",
            "Élfico",
            "Um idioma adicional",
        ],

        traits: [
            {
                id: "darkvision",
                name: "Visão no Escuro",
                description:
                    "Você consegue enxergar na escuridão dentro de determinados limites.",
            },
            {
                id: "fey-ancestry",
                name: "Ancestralidade Feérica",
                description:
                    "Você possui vantagens contra determinados efeitos mágicos.",
            },
            {
                id: "skill-versatility",
                name: "Versatilidade em Perícias",
                description:
                    "Você recebe proficiência em duas perícias à sua escolha.",
            },
        ],
    },

    {
        id: "half-orc",
        name: "Meio-Orc",
        abilityScoreIncrease: {
            strength: 2,
            constitution: 1,
        },
        speed: 30,
        languages: ["Comum", "Orc"],
        traits: [
            {
                id: "relentless-endurance",
                name: "Resistência Incansável",
                description:
                    "Sua determinação permite continuar lutando mesmo após sofrer um golpe devastador.",
            },
        ],
    },

    {
        id: "tiefling",
        name: "Tiefling",
        abilityScoreIncrease: {
            charisma: 2,
            intelligence: 1,
        },
        speed: 30,
        languages: ["Comum", "Infernal"],
        traits: [
            {
                id: "hellish-resistance",
                name: "Resistência Infernal",
                description:
                    "Você possui resistência contra dano de fogo.",
            },
        ],
    },

    {
        id: "kenku",
        name: "Kenku",

        abilityScoreIncrease: {
            dexterity: 2,
            wisdom: 1,
        },

        speed: 30,

        languages: [
            "Comum",
            "Auran",
        ],

        skillChoices: {
            count: 2,
            skills: [
                "acrobatics",
                "deception",
                "sleight-of-hand",
                "stealth",
            ],
        },

        traits: [
            {
                id: "expert-forger",
                name: "Especialista em Falsificação",
                description:
                    "Você possui talento excepcional para reproduzir documentos e objetos escritos.",
            },
            {
                id: "mimicry",
                name: "Mimetismo",
                description:
                    "Você consegue imitar sons e vozes que tenha ouvido.",
            },
            {
                id: "kenku-training",
                name: "Treinamento Kenku",
                description:
                    "Você é proficiente em sua escolha de duas das seguintes perícias: Acrobacia, Enganação, Furtividade e Prestidigitação.",
            },
        ],
    },
];