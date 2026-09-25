import type { CharacterTalent } from "../../types/character";

export const DND_TALENTS: CharacterTalent[] = [
    {
        id: "actor",
        name: "Ator",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["charisma"],
        },

        description:
            "Você é habilidoso em mimetismo e dramatização. Você ganha +1 em Carisma. Você tem vantagem em testes de Carisma (Enganação) e Carisma (Atuação) quando tenta se passar por outra pessoa. Você pode imitar a fala de outra pessoa ou os sons feitos por outras criaturas.",
    },

    {
        id: "alert",
        name: "Alerta",
        source: "Livro do Jogador 2014",

        effects: {
            // +5 iniciativa é tratado posteriormente
            // pelo sistema de efeitos do talento.
        },

        description:
            "Você está sempre atento ao perigo. Você ganha +5 de bônus na iniciativa. Você não pode ser surpreendido enquanto estiver consciente. Outras criaturas não ganham vantagem nas jogadas de ataque contra você por estarem escondidas de você.",
    },

    {
        id: "athlete",
        name: "Atleta",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength", "dexterity"],
        },

        description:
            "Você passou por extenso treinamento físico. Você ganha +1 em Força ou Destreza. Quando estiver caído, levantar-se usa apenas 1,5 metro do seu deslocamento. Escalar não custa movimento extra. Você pode realizar um salto em distância após correr apenas 1,5 metro.",
    },

    {
        id: "charger",
        name: "Investida",
        source: "Livro do Jogador 2014",

        description:
            "Quando você usa sua ação para Correr, pode usar uma ação bônus para realizar um ataque corpo a corpo com arma ou empurrar uma criatura. Você ganha +5 de bônus na jogada de dano do ataque ou pode empurrar o alvo até 3 metros.",
    },

    {
        id: "crossbow-expert",
        name: "Especialista em Bestas",
        source: "Livro do Jogador 2014",

        description:
            "Você ignora a propriedade de recarga das bestas nas quais é proficiente. Estar a até 1,5 metro de uma criatura hostil não impõe desvantagem nas suas jogadas de ataque à distância. Quando usa a ação de Ataque e ataca com uma arma de uma mão, pode usar uma ação bônus para atacar com uma besta de mão carregada que esteja segurando.",
    },

    {
        id: "defensive-duelist",
        name: "Duelista Defensivo",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                dexterity: 13,
            },
        },

        description:
            "Quando estiver empunhando uma arma de acuidade com a qual seja proficiente e outra criatura acertá-lo com um ataque corpo a corpo, você pode usar sua reação para adicionar seu bônus de proficiência à sua CA contra esse ataque, potencialmente fazendo o ataque errar.",
    },

    {
        id: "dual-wielder",
        name: "Combatente com Duas Armas",
        source: "Livro do Jogador 2014",

        description:
            "Você ganha +1 de bônus na CA enquanto estiver empunhando uma arma corpo a corpo diferente em cada mão. Você pode usar duas armas de uma mão mesmo quando não forem leves. Você pode sacar ou guardar duas armas de uma mão quando normalmente poderia sacar ou guardar apenas uma.",
    },

    {
        id: "durable",
        name: "Robusto",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["constitution"],
        },

        description:
            "Seu máximo de pontos de vida aumenta em uma quantidade igual ao seu nível quando você ganha este talento. Sempre que você gastar um Dado de Vida para recuperar pontos de vida, o mínimo de pontos de vida recuperados é o dobro do seu modificador de Constituição.",
    },

    {
        id: "elemental-adept",
        name: "Adepto Elemental",
        source: "Livro do Jogador 2014",

        prerequisites: {
            class: [
                "sorcerer",
                "wizard",
                "warlock",
                "cleric",
                "druid",
            ],
        },

        choices: [
            {
                id: "damage-type",
                type: "custom",
                name: "Tipo de dano",
                description:
                    "Escolha um dos tipos de dano disponíveis.",
                count: 1,
                options: [
                    "acid",
                    "cold",
                    "fire",
                    "lightning",
                    "thunder",
                ],
            },
        ],

        description:
            "Escolha um dos tipos de dano: ácido, frio, fogo, elétrico ou trovão. Seus feitiços ignoram resistência ao tipo de dano escolhido. Além disso, quando rolar dano de um feitiço que cause esse tipo de dano, qualquer resultado 1 em um dado de dano é tratado como 2.",
    },

    {
        id: "grappler",
        name: "Agarrador",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                strength: 13,
            },
        },

        description:
            "Você desenvolveu as habilidades necessárias para se manter firme em combate corpo a corpo. Você tem vantagem nas jogadas de ataque contra uma criatura que esteja agarrando. Você pode usar sua ação para tentar imobilizar uma criatura agarrada por você.",
    },

    {
        id: "great-weapon-master",
        name: "Mestre de Armas Pesadas",
        source: "Livro do Jogador 2014",

        description:
            "Quando você obtém um acerto crítico ou reduz uma criatura a 0 pontos de vida com uma arma corpo a corpo, pode realizar outro ataque corpo a corpo como ação bônus. Antes de realizar um ataque com uma arma pesada na qual seja proficiente, você pode escolher sofrer -5 na jogada de ataque para receber +10 no dano se acertar.",
    },

    {
        id: "healer",
        name: "Curandeiro",
        source: "Livro do Jogador 2014",

        description:
            "Você é um médico capaz. Quando usa um kit de curandeiro para estabilizar uma criatura, ela recupera 1 ponto de vida. Como ação, você pode gastar um uso do kit de curandeiro para restaurar uma quantidade de pontos de vida igual a 1d6 + 4 + o número máximo de Dados de Vida da criatura.",
    },

    {
        id: "heavily-armored",
        name: "Fortemente Blindado",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                strength: 13,
            },
        },

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength"],
        },

        description:
            "Você ganha proficiência com armaduras pesadas e aumenta sua Força em 1.",
    },

    {
        id: "heavy-armor-master",
        name: "Mestre de Armaduras Pesadas",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                strength: 15,
            },
        },

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength"],
        },

        description:
            "Você aumenta sua Força em 1. Enquanto estiver usando armadura pesada, o dano de ataques não mágicos de concussão, perfuração e corte que você sofrer é reduzido em 3.",
    },

    {
        id: "inspiring-leader",
        name: "Líder Inspirador",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                charisma: 13,
            },
        },

        description:
            "Você pode gastar 10 minutos inspirando seus companheiros. Até seis criaturas amigáveis que possam ouvir e entender você recebem pontos de vida temporários iguais ao seu nível + seu modificador de Carisma.",
    },

    {
        id: "keen-mind",
        name: "Mente Aguçada",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["intelligence"],
        },

        description:
            "Você aumenta sua Inteligência em 1. Você sempre sabe qual é o norte. Você sempre sabe quantas horas faltam para o próximo nascer ou pôr do sol. Você consegue lembrar com precisão qualquer coisa que tenha visto ou ouvido durante o último mês.",
    },

    {
        id: "lightly-armored",
        name: "Levemente Blindado",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength", "dexterity"],
        },

        description:
            "Você ganha proficiência com armaduras leves e aumenta Força ou Destreza em 1.",
    },

    {
        id: "linguist",
        name: "Linguista",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["intelligence"],
        },

        choices: [
            {
                id: "languages",
                type: "language",
                name: "Idiomas",
                description:
                    "Escolha três idiomas.",
                count: 3,
            },
        ],

        description:
            "Você aumenta sua Inteligência em 1. Você aprende três idiomas à sua escolha. Você pode criar mensagens escritas secretas.",
    },

    {
        id: "lucky",
        name: "Sortudo",
        source: "Livro do Jogador 2014",

        description:
            "Você possui uma sorte inexplicável. Você possui 3 pontos de sorte. Sempre que realizar uma jogada de ataque, teste de habilidade ou teste de resistência, pode gastar um ponto para rolar um d20 adicional e escolher qual dado usar. Também pode gastar um ponto quando uma jogada de ataque for feita contra você.",
    },

    {
        id: "mage-slayer",
        name: "Matador de Magos",
        source: "Livro do Jogador 2014",

        description:
            "Quando uma criatura a até 1,5 metro de você conjura uma magia, você pode usar sua reação para realizar um ataque corpo a corpo contra ela. Quando causa dano a uma criatura que está se concentrando em uma magia, ela tem desvantagem no teste de resistência de Constituição para manter a concentração. Você tem vantagem nos testes de resistência contra magias lançadas por criaturas a até 1,5 metro de você.",
    },

    {
        id: "magic-initiate",
        name: "Iniciado em Magia",
        source: "Livro do Jogador 2014",

        choices: [
            {
                id: "spellcasting-class",
                type: "class",
                name: "Classe de conjuração",
                description:
                    "Escolha uma classe para determinar sua lista de magias.",
                count: 1,
                options: [
                    "bard",
                    "cleric",
                    "druid",
                    "sorcerer",
                    "warlock",
                    "wizard",
                ],
            },
        ],

        description:
            "Escolha uma classe: bardo, clérigo, druida, feiticeiro, bruxo ou mago. Você aprende dois truques da lista dessa classe e uma magia de 1º nível dessa mesma lista.",
    },

    {
        id: "martial-adept",
        name: "Adepto Marcial",
        source: "Livro do Jogador 2014",

        description:
            "Você aprende duas manobras da lista do arquétipo Mestre de Batalha. Você ganha um dado de superioridade, que é um d6, e pode usá-lo para executar suas manobras.",
    },

    {
        id: "medium-armor-master",
        name: "Mestre de Armaduras Médias",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                dexterity: 13,
            },
        },

        description:
            "Vestindo armadura média, você pode adicionar até +3 do seu modificador de Destreza à CA, em vez do máximo normal de +2. Além disso, você não sofre desvantagem em testes de Furtividade por usar armadura média.",
    },

    {
        id: "mobile",
        name: "Móvel",
        source: "Livro do Jogador 2014",

        description:
            "Seu deslocamento aumenta em 3 metros. Quando usa a ação de Correr, terreno difícil não custa movimento extra. Quando realiza um ataque corpo a corpo contra uma criatura, você não provoca ataques de oportunidade dela pelo restante do turno, independentemente de acertar ou errar.",
    },

    {
        id: "moderately-armored",
        name: "Moderadamente Blindado",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                strength: 13,
                dexterity: 13,
            },
        },

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength", "dexterity"],
        },

        description:
            "Você ganha proficiência com armaduras médias e escudos. Você aumenta Força ou Destreza em 1.",
    },

    {
        id: "mounted-combatant",
        name: "Combatente Montado",
        source: "Livro do Jogador 2014",

        description:
            "Você tem vantagem nos ataques corpo a corpo contra criaturas menores que sua montaria. Pode forçar ataques contra você a atingirem você em vez da montaria. Se sua montaria realizar um teste de resistência de Destreza para sofrer metade do dano, ela não sofre dano se for bem-sucedida e metade se falhar.",
    },

    {
        id: "observant",
        name: "Observador",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["intelligence", "wisdom"],
        },

        description:
            "Você aumenta sua Inteligência ou Sabedoria em 1. Se puder ver a boca de uma criatura enquanto ela fala um idioma que você conhece, pode interpretar o que ela está dizendo. Você recebe +5 em seus valores passivos de Sabedoria (Percepção) e Inteligência (Investigação).",
    },

    {
        id: "polearm-master",
        name: "Mestre de Armas de Haste",
        source: "Livro do Jogador 2014",

        description:
            "Quando realiza a ação de Ataque e usa apenas uma alabarda, bordão ou glaive, pode usar uma ação bônus para realizar um ataque com a extremidade da arma. Enquanto estiver empunhando uma dessas armas, outras criaturas provocam um ataque de oportunidade quando entram no seu alcance.",
    },

    {
        id: "resilient",
        name: "Resiliente",
        source: "Livro do Jogador 2014",

        choices: [
            {
                id: "ability",
                type: "ability",
                name: "Atributo",
                description:
                    "Escolha um atributo para aumentar.",
                count: 1,
                options: [
                    "strength",
                    "dexterity",
                    "constitution",
                    "intelligence",
                    "wisdom",
                    "charisma",
                ],
            },
        ],

        abilityScoreIncrease: {
            amount: 1,
        },

        description:
            "Escolha um atributo. Você aumenta esse atributo em 1 e ganha proficiência nos testes de resistência desse atributo.",
    },

    {
        id: "ritual-caster",
        name: "Conjurador de Rituais",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                intelligence: 13,
                wisdom: 13,
            },
        },

        choices: [
            {
                id: "spellcasting-class",
                type: "class",
                name: "Classe",
                description:
                    "Escolha uma classe para determinar sua lista de magias de ritual.",
                count: 1,
                options: [
                    "cleric",
                    "wizard",
                ],
            },
        ],

        description:
            "Você aprende duas magias de 1º nível com a propriedade ritual da lista da classe escolhida e pode conjurá-las como rituais.",
    },

    {
        id: "savage-attacker",
        name: "Atacante Selvagem",
        source: "Livro do Jogador 2014",

        description:
            "Uma vez por turno, quando rolar dano para um ataque corpo a corpo com arma, você pode rolar novamente os dados de dano e usar qualquer um dos resultados.",
    },

    {
        id: "sentinel",
        name: "Sentinela",
        source: "Livro do Jogador 2014",

        description:
            "Quando acerta uma criatura com um ataque de oportunidade, o deslocamento dela se torna 0 pelo restante do turno. Criaturas provocam ataques de oportunidade mesmo que usem a ação de Desengajar. Quando uma criatura a até 1,5 metro de você atacar outra criatura que não seja você, você pode usar sua reação para realizar um ataque corpo a corpo contra o atacante.",
    },

    {
        id: "sharpshooter",
        name: "Atirador Exímio",
        source: "Livro do Jogador 2014",

        description:
            "Atacar a longa distância não impõe desvantagem nas suas jogadas de ataque com armas à distância. Seus ataques à distância ignoram meia cobertura e cobertura de três quartos. Antes de realizar um ataque com uma arma à distância na qual seja proficiente, você pode sofrer -5 na jogada de ataque para receber +10 no dano se acertar.",
    },

    {
        id: "shield-master",
        name: "Mestre de Escudo",
        source: "Livro do Jogador 2014",

        description:
            "Você usa escudos não apenas para proteção, mas também para atacar. Pode usar uma ação bônus para tentar empurrar uma criatura a até 1,5 metro de você com seu escudo. Se não estiver incapacitado, pode adicionar o bônus de CA do escudo a testes de resistência de Destreza contra efeitos que tenham você como único alvo. Se for bem-sucedido, pode usar sua reação para não sofrer dano.",
    },

    {
        id: "skilled",
        name: "Habilidoso",
        source: "Livro do Jogador 2014",

        choices: [
            {
                id: "skills",
                type: "skill",
                name: "Perícias",
                description:
                    "Escolha três perícias nas quais você não seja proficiente.",
                count: 3,
                excludeProficient: true,
            },
        ],

        description:
            "Você ganha proficiência em três perícias ou ferramentas à sua escolha.",
    },

    {
        id: "skulker",
        name: "Furtivo",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                dexterity: 13,
            },
        },

        description:
            "Você pode tentar se esconder quando estiver apenas levemente obscurecido. Quando errar um ataque à distância enquanto estiver escondido, o ataque não revela sua posição. Penumbra não impõe desvantagem nos seus testes de Sabedoria (Percepção) que dependam de visão.",
    },

    {
        id: "spell-sniper",
        name: "Atirador de Magia",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                intelligence: 13,
                wisdom: 13,
                charisma: 13,
            },
        },

        description:
            "Quando você conjura uma magia que exige uma jogada de ataque, o alcance da magia é dobrado. Seus ataques com magias à distância ignoram meia cobertura e cobertura de três quartos. Você aprende um truque que exige uma jogada de ataque da lista de bardo, clérigo, druida, feiticeiro, bruxo ou mago.",
    },

    {
        id: "tavern-brawler",
        name: "Brigão de Taverna",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength", "constitution"],
        },

        description:
            "Você ganha proficiência com armas improvisadas. Seus ataques desarmados causam 1d4 de dano. Quando acerta uma criatura com um ataque desarmado ou arma improvisada no seu turno, pode usar uma ação bônus para tentar agarrá-la.",
    },

    {
        id: "tough",
        name: "Robusto",
        source: "Livro do Jogador 2014",

        description:
            "Seu máximo de pontos de vida aumenta em uma quantidade igual ao dobro do seu nível quando você ganha este talento. Sempre que subir de nível, seu máximo de pontos de vida aumenta em 2 pontos adicionais.",
    },

    {
        id: "war-caster",
        name: "Conjurador de Guerra",
        source: "Livro do Jogador 2014",

        prerequisites: {
            abilities: {
                intelligence: 13,
                wisdom: 13,
                charisma: 13,
            },
        },

        description:
            "Você tem vantagem nos testes de resistência de Constituição para manter concentração em uma magia quando sofrer dano. Pode realizar os componentes somáticos de magias mesmo quando estiver segurando armas ou escudo. Quando o movimento de uma criatura provoca um ataque de oportunidade, você pode usar sua reação para conjurar uma magia contra ela em vez de realizar um ataque de oportunidade.",
    },

    {
        id: "weapon-master",
        name: "Mestre de Armas",
        source: "Livro do Jogador 2014",

        abilityScoreIncrease: {
            amount: 1,
            choices: ["strength", "dexterity"],
        },

        description:
            "Você aumenta Força ou Destreza em 1 e ganha proficiência com quatro armas simples ou marciais à sua escolha.",
    },
];

export function sortTalentsByName(
    talents: CharacterTalent[]
): CharacterTalent[] {
    return [...talents].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
    );
}