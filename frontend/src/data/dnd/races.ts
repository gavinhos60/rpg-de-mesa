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
        id: "vampir",
        name: "Vampiro",
        abilityScoreIncrease: {
            constitution: 2,
            intelligence: 1,
        },
        speed: 30,
        languages: ["Comum", "Vampiro"],
        traits: [
            {
                id: "Mordida",
                name: "Mordida",
                description:
                    "Mordida (Forma de Morcego ou Vampiro Apenas). Ataque Corpo-a-Corpo com Arma: +9 para atingir, alcance 1,5 m, uma criatura voluntária ou uma criatura agarrada pelo vampiro, perfurante mais 10 (3d6) de dano necrótico. O máximo depontos de vida do alvo é reduzido numa quantidade igual ao dano necrótico sofrido e o vampiro recupera uma quantidade de pontos de vida igual. A redução dura até o alvo terminar um descanso longo. O alvo morre se esse efeito reduzir seu máximo  de pontos de vida a 0. Um humanoide morto dessa forma e depois enterrado no solo, ergue-se na noite seguinte como uma cria vampírica sob controle do vampiro. ",
            },
            {
                id: "Enfeitiçar",
                name: "Enfeitiçar",
                description:
                    "Enfeitiçar: Humanoide a até 9 m que veja o vampiro faz resistência de Sabedoria CD 17 ou fica enfeitiçado por 24h, considerando-o amigo confiável, atendendo seus pedidos e sendo alvo voluntário da Mordida; ao sofrer dano do vampiro ou aliados, pode repetir o teste, encerrando o efeito com sucesso, que também termina se o vampiro for destruído, mudar de plano ou usar uma ação bônus para encerrá-lo."
            },
            {
                id: "Filhos-da-Noite",
                name: "Filhos da Noite",
                description:
                    "Filhos da Noite (1/Dia): Se não houver sol, o vampiro convoca 2d4 enxames de morcegos ou ratos, ou, ao ar livre, 3d6 lobos; chegam em 1d4 rodadas, são aliados e obedecem seus comandos, permanecendo por 1 hora, até o vampiro morrer ou ele dispensá-los com uma ação bônus."
            },
            {
                id: "Regeneracao",
                name: "Regeneração",
                description:
                    "Regeneração: O vampiro recupera 20 PV no início de cada turno se tiver ao menos 1 PV e não estiver sob luz solar ou água corrente; se sofrer dano radiante ou de água benta, não pode regenerar até o início do próximo turno."
            },
            {
                id: "Metamorfo",
                name: "Metamorfo",
                description:
                    "Metamorfo: Sem luz solar ou água corrente, o vampiro usa uma ação para assumir a forma de morcego Miúdo, nuvem de neblina Média ou voltar à forma verdadeira. Como morcego, não fala, tem deslocamento de caminhada 1,5 m e voo 9 m, mantendo as demais estatísticas; como neblina, não age, fala ou manipula objetos, não tem peso, voa 6 m, plana, pode ocupar espaços hostis e atravessar qualquer abertura por onde o ar passe, mas não atravessa água, tem vantagem em testes de Força, Destreza e Constituição e é imune a danos não mágicos, exceto luz solar."
            },
            {
                id: "Neblina-de-Escapada",
                name: "Neblina de Escapada",
                description:
                    "Neblina de Escapada: Ao chegar a 0 PV fora de seu local de descanso, o vampiro vira uma nuvem de neblina em vez de ficar inconsciente, se não estiver sob luz solar ou água corrente; se não puder se transformar, é destruído. Com 0 PV em neblina, não pode voltar à forma de vampiro e deve chegar ao local de descanso em até 2 horas ou será destruído; lá, retorna à forma de vampiro e fica paralisado até recuperar pelo menos 1 PV."
            },
            {
                id: "Escalada Aracnídea",
                name: "Escalada Aracnídea",
                description:
                    "Escalada Aracnídea: O vampiro pode escalar superfícies difíceis, inclusive andar de cabeça para baixo em tetos, sem precisar realizar testes de habilidade."
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
        skillProficiencies: ["perception"],
        traits: [
            {
                id: "darkvision",
                name: "Visão no Escuro",
                description:
                    "Você consegue enxergar no escuro dentro de determinados limites.",
            },
            {
                id: "keen-senses",
                name: "Sentidos Aguçados",
                description:
                    "Você tem proficiência na perícia Percepção.",
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
        skillProficiencies: ["intimidation"],
        traits: [
            {
                id: "menacing",
                name: "Ameaçador",
                description:
                    "Você tem proficiência na perícia Intimidação.",
            },
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
        },
        speed: 30,
        languages: ["Comum", "Infernal"],
        traits: [
            {
                id: "tiefling-darkvision",
                name: "Visão no Escuro",
                description:
                    "Graças à sua herança infernal, você tem visão no escuro superior. Você enxerga na penumbra a até 18 m como se fosse luz plena, e no escuro como se fosse penumbra. Você não consegue distinguir cores no escuro, apenas tons de cinza.",
            },
            {
                id: "hellish-resistance",
                name: "Resistência Infernal",
                description:
                    "Você possui resistência a dano de fogo.",
            },
        ],
        subraces: [
            {
                id: "asmodeus",
                name: "Linhagem de Asmodeus",
                description:
                    "A linhagem clássica do Nove Infernos: intelecto afiado e magia infernal tradicional.",
                abilityScoreIncrease: { intelligence: 1 },
                traits: [
                    {
                        id: "infernal-legacy-asmodeus",
                        name: "Legado Infernal",
                        description:
                            "Você conhece o truque Taumaturgia. No 3º nível, pode conjurar Represália Infernal uma vez por descanso longo como magia de 2º círculo. No 5º nível, pode conjurar Escuridão uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "baalzebul",
                name: "Linhagem de Baalzebul",
                description:
                    "Herdeiros da corrupção de Maladomini, mestres em espalhar doença e loucura.",
                abilityScoreIncrease: { intelligence: 1 },
                traits: [
                    {
                        id: "legacy-of-maladomini",
                        name: "Legado de Maladomini",
                        description:
                            "Você conhece o truque Taumaturgia. No 3º nível, pode conjurar Raio Adoecente uma vez por descanso longo. No 5º nível, pode conjurar Coroa da Loucura uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "dispater",
                name: "Linhagem de Dispater",
                description:
                    "Descendentes da Cidade de Ferro: ágeis, cautelosos e hábeis em enganar.",
                abilityScoreIncrease: { dexterity: 1 },
                traits: [
                    {
                        id: "legacy-of-dis",
                        name: "Legado de Dis",
                        description:
                            "Você conhece o truque Taumaturgia. No 3º nível, pode conjurar Disfarçar-se uma vez por descanso longo. No 5º nível, pode conjurar Detectar Pensamentos uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "fierna",
                name: "Linhagem de Fierna",
                description:
                    "Herdeiros de Phlegethos, com dom natural para manipulação social.",
                abilityScoreIncrease: { wisdom: 1 },
                traits: [
                    {
                        id: "legacy-of-phlegethos",
                        name: "Legado de Phlegethos",
                        description:
                            "Você conhece o truque Amigos. No 3º nível, pode conjurar Enfeitiçar Pessoa uma vez por descanso longo. No 5º nível, pode conjurar Sugestão uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "glasya",
                name: "Linhagem de Glasya",
                description:
                    "Filhos de Malbolge: furtivos, ilusionistas e mestres do engodo.",
                abilityScoreIncrease: { dexterity: 1 },
                traits: [
                    {
                        id: "legacy-of-malbolge",
                        name: "Legado de Malbolge",
                        description:
                            "Você conhece o truque Ilusão Menor. No 3º nível, pode conjurar Disfarçar-se uma vez por descanso longo. No 5º nível, pode conjurar Invisibilidade uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "levistus",
                name: "Linhagem de Levistus",
                description:
                    "Presos no gelo de Stygia: resistentes e armados com magia gélida.",
                abilityScoreIncrease: { constitution: 1 },
                traits: [
                    {
                        id: "legacy-of-stygia",
                        name: "Legado de Stygia",
                        description:
                            "Você conhece o truque Raio de Gelo. No 3º nível, pode conjurar Armadura de Agathys uma vez por descanso longo. No 5º nível, pode conjurar Escuridão uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "mammon",
                name: "Linhagem de Mammon",
                description:
                    "Herdeiros de Minauros, atraídos por riqueza e barganhas.",
                abilityScoreIncrease: { intelligence: 1 },
                traits: [
                    {
                        id: "legacy-of-minauros",
                        name: "Legado de Minauros",
                        description:
                            "Você conhece o truque Mãos Mágicas. No 3º nível, pode conjurar Disco Flutuante uma vez por descanso longo. No 5º nível, pode conjurar Tranca Arcana uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "mephistopheles",
                name: "Linhagem de Mephistopheles",
                description:
                    "Descendentes de Cania: intelecto afiado e afinidade com fogo arcano.",
                abilityScoreIncrease: { intelligence: 1 },
                traits: [
                    {
                        id: "legacy-of-cania",
                        name: "Legado de Cania",
                        description:
                            "Você conhece o truque Mãos Mágicas. No 3º nível, pode conjurar Mãos Flamejantes uma vez por descanso longo. No 5º nível, pode conjurar Lâmina Flamejante uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
            },
            {
                id: "zariel",
                name: "Linhagem de Zariel",
                description:
                    "Herdeiros de Avernus: guerreiro-infernais com magia de combate.",
                abilityScoreIncrease: { strength: 1 },
                traits: [
                    {
                        id: "legacy-of-avernus",
                        name: "Legado de Avernus",
                        description:
                            "Você conhece o truque Taumaturgia. No 3º nível, pode conjurar Golpe Abrasador uma vez por descanso longo. No 5º nível, pode conjurar Golpe Marcante uma vez por descanso longo. Carisma é sua habilidade de conjuração para essas magias.",
                    },
                ],
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