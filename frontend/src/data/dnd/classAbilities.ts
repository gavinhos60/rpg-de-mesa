export interface ClassAbility {
  id: string;
  name: string;
  level: number;
  description: string;
  subclassId?: string;
  category?: "class" | "subclass";
  source?: string;
}

export interface ClassResourceSummary {
  classId: string;
  name: string;
  getValue: (level: number) => string;
  detail?: (level: number) => string;
}

const PHB = "Player's Handbook (2014)";
const HOMEBREW = "Iccarion / Homebrew";

const ASI_DESCRIPTION =
  "Aumente um valor de habilidade em 2 pontos, ou dois valores de habilidade em 1 ponto cada (máximo 20). Alternativamente, escolha um talento.";

const asi = (classId: string, level: number): ClassAbility => ({
  id: `${classId}-asi-${level}`,
  name: "Aumento no Valor de Habilidade",
  level,
  description: ASI_DESCRIPTION,
  category: "class",
  source: PHB,
});

const BARBARIAN_ABILITIES: ClassAbility[] = [
  {
    id: "barbarian-rage",
    name: "Fúria",
    level: 1,
    description:
      "Como ação bônus, entre em fúria por 1 minuto: vantagem em testes e salvaguardas de Força, bônus de dano corpo a corpo com Força e resistência a dano cortante, perfurante e concussivo. Não é possível conjurar ou se concentrar em magias durante a fúria.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-unarmored-defense",
    name: "Defesa sem Armadura",
    level: 1,
    description:
      "Sem usar armadura, sua CA é igual a 10 + modificador de Destreza + modificador de Constituição. Escudos ainda podem ser usados normalmente.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-reckless-attack",
    name: "Ataque Descuidado",
    level: 2,
    description:
      "No primeiro ataque do seu turno você pode atacar com abandono: ganha vantagem em ataques corpo a corpo com Força neste turno, mas ataques contra você também têm vantagem até seu próximo turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-danger-sense",
    name: "Sentido de Perigo",
    level: 2,
    description:
      "Você tem vantagem em salvaguardas de Destreza contra efeitos que consiga enxergar, como armadilhas e magias, desde que não esteja cego, surdo ou incapacitado.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-primal-path",
    name: "Caminho Primitivo",
    level: 3,
    description:
      "Escolha um caminho primitivo que molde a natureza da sua fúria, concedendo recursos adicionais neste nível e nos níveis 6, 10 e 14.",
    category: "class",
    source: PHB,
  },
  asi("barbarian", 4),
  {
    id: "barbarian-extra-attack",
    name: "Ataque Extra",
    level: 5,
    description:
      "Você pode atacar duas vezes, em vez de uma, sempre que usar a ação de Ataque no seu turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-fast-movement",
    name: "Movimento Rápido",
    level: 5,
    description:
      "Seu deslocamento aumenta em 3 metros enquanto você não estiver usando armadura pesada.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-feral-instinct",
    name: "Instinto Selvagem",
    level: 7,
    description:
      "Você tem vantagem em testes de iniciativa e, mesmo surpreso, pode agir normalmente no primeiro turno se entrar em fúria antes de qualquer outra ação.",
    category: "class",
    source: PHB,
  },
  asi("barbarian", 8),
  {
    id: "barbarian-brutal-critical-1",
    name: "Crítico Brutal (1 dado)",
    level: 9,
    description:
      "Ao obter um acerto crítico com um ataque corpo a corpo, role um dado adicional de dano da arma e some ao dano extra do crítico.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-relentless-rage",
    name: "Fúria Implacável",
    level: 11,
    description:
      "Se cair a 0 pontos de vida durante a fúria sem morrer instantaneamente, faça uma salvaguarda de Constituição CD 10 para ficar com 1 ponto de vida. A CD aumenta em 5 a cada uso até um descanso.",
    category: "class",
    source: PHB,
  },
  asi("barbarian", 12),
  {
    id: "barbarian-brutal-critical-2",
    name: "Crítico Brutal (2 dados)",
    level: 13,
    description:
      "Seus acertos críticos corpo a corpo somam dois dados adicionais de dano da arma.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-persistent-rage",
    name: "Fúria Persistente",
    level: 15,
    description:
      "Sua fúria só termina antes do tempo se você ficar inconsciente ou escolher encerrá-la voluntariamente.",
    category: "class",
    source: PHB,
  },
  asi("barbarian", 16),
  {
    id: "barbarian-brutal-critical-3",
    name: "Crítico Brutal (3 dados)",
    level: 17,
    description:
      "Seus acertos críticos corpo a corpo somam três dados adicionais de dano da arma.",
    category: "class",
    source: PHB,
  },
  {
    id: "barbarian-indomitable-might",
    name: "Força Indomável",
    level: 18,
    description:
      "Se o total de um teste de Força for menor que seu valor de Força, você pode usar o valor de Força no lugar do resultado.",
    category: "class",
    source: PHB,
  },
  asi("barbarian", 19),
  {
    id: "barbarian-primal-champion",
    name: "Campeão Primitivo",
    level: 20,
    description:
      "Sua Força e Constituição aumentam em 4 pontos, e o máximo desses valores passa a ser 24.",
    category: "class",
    source: PHB,
  },
  // Caminho do Berserker
  {
    id: "barbarian-berserker-frenzy",
    name: "Frenesi",
    level: 3,
    description:
      "Ao entrar em fúria você pode entrar em frenesi, fazendo um ataque corpo a corpo como ação bônus em cada turno. Ao terminar a fúria você ganha um nível de exaustão.",
    subclassId: "berserker",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-berserker-mindless-rage",
    name: "Fúria Insensata",
    level: 6,
    description:
      "Você não pode ser enfeitiçado nem amedrontado enquanto estiver em fúria, e efeitos desse tipo ficam suspensos durante ela.",
    subclassId: "berserker",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-berserker-intimidating-presence",
    name: "Presença Intimidadora",
    level: 10,
    description:
      "Com uma ação, force uma criatura a até 9 metros a fazer uma salvaguarda de Sabedoria contra sua CD ou ficar amedrontada por 1 minuto enquanto você mantiver a pressão a cada turno.",
    subclassId: "berserker",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-berserker-retaliation",
    name: "Retaliação",
    level: 14,
    description:
      "Quando sofrer dano de uma criatura a até 1,5 metro, você pode usar sua reação para fazer um ataque corpo a corpo contra ela.",
    subclassId: "berserker",
    category: "subclass",
    source: PHB,
  },
  // Caminho do Guerreiro Totêmico
  {
    id: "barbarian-totem-spirit-seeker",
    name: "Buscador de Espíritos",
    level: 3,
    description:
      "Você pode conjurar os rituais de sentido bestial e falar com animais sem gastar espaços de magia.",
    subclassId: "totem-warrior",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-totem-spirit",
    name: "Espírito Totêmico",
    level: 3,
    description:
      "Escolha um totem: Urso concede resistência a quase todo dano em fúria, Águia impõe desvantagem a ataques de oportunidade e permite Disparada como ação bônus, Lobo dá vantagem aos aliados contra inimigos próximos.",
    subclassId: "totem-warrior",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-totem-aspect-of-the-beast",
    name: "Aspecto da Besta",
    level: 6,
    description:
      "Escolha um aspecto: Urso dobra sua capacidade de carga e dá vantagem em testes de Força para mover objetos, Águia concede visão aguçada a distância, Lobo permite rastrear em ritmo acelerado e mover-se furtivamente em ritmo normal.",
    subclassId: "totem-warrior",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-totem-spirit-walker",
    name: "Andarilho Espiritual",
    level: 10,
    description:
      "Você pode conjurar comunhão com a natureza como ritual, e um espírito bestial se manifesta para entregar a resposta.",
    subclassId: "totem-warrior",
    category: "subclass",
    source: PHB,
  },
  {
    id: "barbarian-totem-totemic-attunement",
    name: "Sintonia Totêmica",
    level: 14,
    description:
      "Escolha um benefício em fúria: Urso força inimigos próximos a atacar você, Águia concede voo temporário, Lobo derruba um inimigo Grande ou menor após um acerto corpo a corpo.",
    subclassId: "totem-warrior",
    category: "subclass",
    source: PHB,
  },
];

const BARD_ABILITIES: ClassAbility[] = [
  {
    id: "bard-spellcasting",
    name: "Conjuração",
    level: 1,
    description:
      "Você conjura magias de bardo usando Carisma, conhecendo um número crescente de magias e truques e recuperando espaços de magia em um descanso longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-bardic-inspiration",
    name: "Inspiração Bárdica",
    level: 1,
    description:
      "Como ação bônus, conceda um dado de inspiração a uma criatura a até 18 metros. Ela pode somá-lo a um teste, ataque ou salvaguarda em até 10 minutos. Usos iguais ao modificador de Carisma.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-jack-of-all-trades",
    name: "Pau para Toda Obra",
    level: 2,
    description:
      "Some metade do seu bônus de proficiência, arredondado para baixo, a qualquer teste de habilidade que já não inclua o bônus.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-song-of-rest",
    name: "Canção do Descanso (d6)",
    level: 2,
    description:
      "Aliados que gastem Dados de Vida em um descanso curto com você recuperam 1d6 pontos de vida adicionais.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-college",
    name: "Colégio de Bardo",
    level: 3,
    description:
      "Escolha um colégio que define seu estilo de performance, concedendo recursos nos níveis 3, 6 e 14.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-expertise-1",
    name: "Especialização",
    level: 3,
    description:
      "Escolha duas perícias em que seja proficiente: seu bônus de proficiência é dobrado para testes com elas.",
    category: "class",
    source: PHB,
  },
  asi("bard", 4),
  {
    id: "bard-font-of-inspiration",
    name: "Fonte de Inspiração",
    level: 5,
    description:
      "Você recupera todos os usos de Inspiração Bárdica ao terminar um descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-inspiration-d8",
    name: "Inspiração Bárdica (d8)",
    level: 5,
    description: "Seu dado de Inspiração Bárdica passa a ser d8.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-countercharm",
    name: "Contra-encanto",
    level: 6,
    description:
      "Com uma ação, comece uma performance que dá vantagem em salvaguardas contra ficar amedrontado ou enfeitiçado a você e aliados a até 9 metros.",
    category: "class",
    source: PHB,
  },
  asi("bard", 8),
  {
    id: "bard-song-of-rest-d8",
    name: "Canção do Descanso (d8)",
    level: 9,
    description: "A cura extra da Canção do Descanso passa a ser 1d8.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-inspiration-d10",
    name: "Inspiração Bárdica (d10)",
    level: 10,
    description: "Seu dado de Inspiração Bárdica passa a ser d10.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-expertise-2",
    name: "Especialização (2)",
    level: 10,
    description:
      "Escolha mais duas perícias proficientes para dobrar o bônus de proficiência.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-magical-secrets-10",
    name: "Segredos Mágicos",
    level: 10,
    description:
      "Aprenda duas magias de qualquer classe, que contam como magias de bardo para você.",
    category: "class",
    source: PHB,
  },
  asi("bard", 12),
  {
    id: "bard-song-of-rest-d10",
    name: "Canção do Descanso (d10)",
    level: 13,
    description: "A cura extra da Canção do Descanso passa a ser 1d10.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-magical-secrets-14",
    name: "Segredos Mágicos (2)",
    level: 14,
    description: "Aprenda mais duas magias de qualquer classe.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-inspiration-d12",
    name: "Inspiração Bárdica (d12)",
    level: 15,
    description: "Seu dado de Inspiração Bárdica passa a ser d12.",
    category: "class",
    source: PHB,
  },
  asi("bard", 16),
  {
    id: "bard-song-of-rest-d12",
    name: "Canção do Descanso (d12)",
    level: 17,
    description: "A cura extra da Canção do Descanso passa a ser 1d12.",
    category: "class",
    source: PHB,
  },
  {
    id: "bard-magical-secrets-18",
    name: "Segredos Mágicos (3)",
    level: 18,
    description: "Aprenda mais duas magias de qualquer classe.",
    category: "class",
    source: PHB,
  },
  asi("bard", 19),
  {
    id: "bard-superior-inspiration",
    name: "Inspiração Superior",
    level: 20,
    description:
      "Ao rolar iniciativa sem usos restantes de Inspiração Bárdica, você recupera um uso.",
    category: "class",
    source: PHB,
  },
  // Colégio do Conhecimento
  {
    id: "bard-lore-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 3,
    description: "Ganhe proficiência em três perícias à sua escolha.",
    subclassId: "college-of-lore",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-lore-cutting-words",
    name: "Palavras Cortantes",
    level: 3,
    description:
      "Como reação, gaste um dado de Inspiração Bárdica para subtrair o resultado de um ataque, teste de habilidade ou rolagem de dano de uma criatura a até 18 metros.",
    subclassId: "college-of-lore",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-lore-additional-magical-secrets",
    name: "Segredos Mágicos Adicionais",
    level: 6,
    description:
      "Aprenda duas magias de qualquer classe; elas não contam no total de magias conhecidas de bardo.",
    subclassId: "college-of-lore",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-lore-peerless-skill",
    name: "Habilidade Incomparável",
    level: 14,
    description:
      "Ao fazer um teste de habilidade, gaste um dado de Inspiração Bárdica para somá-lo ao resultado antes de saber se teve sucesso.",
    subclassId: "college-of-lore",
    category: "subclass",
    source: PHB,
  },
  // Colégio da Bravura
  {
    id: "bard-valor-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 3,
    description:
      "Ganhe proficiência com armaduras médias, escudos e armas marciais.",
    subclassId: "college-of-valor",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-valor-combat-inspiration",
    name: "Inspiração de Combate",
    level: 3,
    description:
      "Aliados podem gastar o dado de Inspiração Bárdica para somar dano a um acerto ou somar à CA contra um ataque recebido.",
    subclassId: "college-of-valor",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-valor-extra-attack",
    name: "Ataque Extra",
    level: 6,
    description:
      "Você pode atacar duas vezes sempre que usar a ação de Ataque no seu turno.",
    subclassId: "college-of-valor",
    category: "subclass",
    source: PHB,
  },
  {
    id: "bard-valor-battle-magic",
    name: "Magia de Batalha",
    level: 14,
    description:
      "Ao conjurar uma magia com a ação, você pode fazer um ataque com arma como ação bônus.",
    subclassId: "college-of-valor",
    category: "subclass",
    source: PHB,
  },
];

const CLERIC_ABILITIES: ClassAbility[] = [
  {
    id: "cleric-spellcasting",
    name: "Conjuração",
    level: 1,
    description:
      "Você conjura magias divinas usando Sabedoria, preparando diariamente uma lista de magias igual ao nível de clérigo mais o modificador de Sabedoria.",
    category: "class",
    source: PHB,
  },
  {
    id: "cleric-divine-domain",
    name: "Domínio Divino",
    level: 1,
    description:
      "Escolha um domínio ligado à sua divindade, que concede magias sempre preparadas e recursos nos níveis 1, 2, 6, 8 e 17.",
    category: "class",
    source: PHB,
  },
  {
    id: "cleric-channel-divinity",
    name: "Canalizar Divindade",
    level: 2,
    description:
      "Você canaliza energia divina para alimentar efeitos mágicos, recuperando os usos em um descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "cleric-turn-undead",
    name: "Canalizar Divindade: Expulsar Mortos-Vivos",
    level: 2,
    description:
      "Com uma ação, mortos-vivos a até 9 metros que falhem em uma salvaguarda de Sabedoria ficam expulsos por 1 minuto, fugindo de você.",
    category: "class",
    source: PHB,
  },
  asi("cleric", 4),
  {
    id: "cleric-destroy-undead",
    name: "Destruir Mortos-Vivos",
    level: 5,
    description:
      "Mortos-vivos de ND 1/2 ou menor são destruídos instantaneamente ao falharem contra sua expulsão. O limite de ND aumenta nos níveis 8, 11, 14 e 17.",
    category: "class",
    source: PHB,
  },
  {
    id: "cleric-channel-divinity-2",
    name: "Canalizar Divindade (2 usos)",
    level: 6,
    description:
      "Você pode usar Canalizar Divindade duas vezes entre descansos.",
    category: "class",
    source: PHB,
  },
  asi("cleric", 8),
  {
    id: "cleric-divine-intervention",
    name: "Intervenção Divina",
    level: 10,
    description:
      "Com uma ação, implore ajuda divina: role d100 e obtenha sucesso se o resultado for igual ou menor que seu nível de clérigo. Em caso de sucesso, só pode usar novamente após 7 dias.",
    category: "class",
    source: PHB,
  },
  asi("cleric", 12),
  asi("cleric", 16),
  {
    id: "cleric-channel-divinity-3",
    name: "Canalizar Divindade (3 usos)",
    level: 18,
    description:
      "Você pode usar Canalizar Divindade três vezes entre descansos.",
    category: "class",
    source: PHB,
  },
  asi("cleric", 19),
  {
    id: "cleric-divine-intervention-improvement",
    name: "Intervenção Divina Aprimorada",
    level: 20,
    description: "Sua Intervenção Divina funciona automaticamente, sem rolagem.",
    category: "class",
    source: PHB,
  },
  // Domínio do Conhecimento
  {
    id: "cleric-knowledge-blessings",
    name: "Bênçãos do Conhecimento",
    level: 1,
    description:
      "Aprenda dois idiomas e ganhe proficiência com especialização em duas perícias entre Arcanismo, História, Natureza e Religião.",
    subclassId: "knowledge-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-knowledge-ages",
    name: "Canalizar Divindade: Conhecimento das Eras",
    level: 2,
    description:
      "Com uma ação, ganhe proficiência em uma perícia ou ferramenta à sua escolha por 10 minutos.",
    subclassId: "knowledge-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-knowledge-read-thoughts",
    name: "Ler Pensamentos",
    level: 6,
    description:
      "Gaste Canalizar Divindade para ler os pensamentos superficiais de uma criatura por 1 minuto e, opcionalmente, conjurar sugestão nela sem gastar espaço.",
    subclassId: "knowledge-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-knowledge-potent-spellcasting",
    name: "Conjuração Potente",
    level: 8,
    description:
      "Some seu modificador de Sabedoria ao dano causado por truques de clérigo.",
    subclassId: "knowledge-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-knowledge-visions-of-the-past",
    name: "Visões do Passado",
    level: 17,
    description:
      "Após 1 minuto de meditação, receba visões sobre a história recente de um objeto ou do local ao seu redor.",
    subclassId: "knowledge-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Vida
  {
    id: "cleric-life-bonus-proficiency",
    name: "Proficiência Bônus",
    level: 1,
    description: "Ganhe proficiência com armaduras pesadas.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-life-disciple-of-life",
    name: "Discípulo da Vida",
    level: 1,
    description:
      "Magias de cura de 1º nível ou superior recuperam 2 pontos de vida adicionais mais o nível do espaço usado.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-life-preserve-life",
    name: "Canalizar Divindade: Preservar a Vida",
    level: 2,
    description:
      "Distribua pontos de cura iguais a cinco vezes seu nível de clérigo entre criaturas a até 9 metros, sem exceder metade dos pontos de vida máximos de cada uma.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-life-blessed-healer",
    name: "Curandeiro Abençoado",
    level: 6,
    description:
      "Ao curar outra criatura com uma magia de 1º nível ou superior, você também recupera 2 pontos de vida mais o nível do espaço.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-life-divine-strike",
    name: "Golpe Divino",
    level: 8,
    description:
      "Uma vez por turno, seus ataques com arma causam 1d8 de dano radiante adicional, aumentando para 2d8 no nível 14.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-life-supreme-healing",
    name: "Cura Suprema",
    level: 17,
    description:
      "Sempre que uma magia sua curaria rolando dados, use o valor máximo possível de cada dado.",
    subclassId: "life-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Luz
  {
    id: "cleric-light-bonus-cantrip",
    name: "Truque Bônus",
    level: 1,
    description: "Você conhece o truque luz, que não conta no total conhecido.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-light-warding-flare",
    name: "Clarão Protetor",
    level: 1,
    description:
      "Como reação, imponha desvantagem a um atacante que você consiga ver. Usos iguais ao modificador de Sabedoria por descanso longo.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-light-radiance-of-the-dawn",
    name: "Canalizar Divindade: Fulgor do Amanhecer",
    level: 2,
    description:
      "Dissipa escuridão mágica e causa 2d10 mais seu nível de clérigo de dano radiante a inimigos a até 9 metros, metade com salvaguarda de Constituição bem-sucedida.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-light-improved-flare",
    name: "Clarão Protetor Aprimorado",
    level: 6,
    description:
      "Você pode usar Clarão Protetor para proteger outra criatura a até 9 metros, além de si mesmo.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-light-potent-spellcasting",
    name: "Conjuração Potente",
    level: 8,
    description:
      "Some seu modificador de Sabedoria ao dano causado por truques de clérigo.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-light-corona-of-light",
    name: "Coroa de Luz",
    level: 17,
    description:
      "Com uma ação, emita luz por 1 minuto: inimigos na área têm desvantagem em salvaguardas contra magias que causem dano radiante ou de fogo.",
    subclassId: "light-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Natureza
  {
    id: "cleric-nature-acolyte-of-nature",
    name: "Acólito da Natureza",
    level: 1,
    description:
      "Aprenda um truque de druida e ganhe proficiência em uma perícia entre Adestrar Animais, Natureza e Sobrevivência.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-nature-bonus-proficiency",
    name: "Proficiência Bônus",
    level: 1,
    description: "Ganhe proficiência com armaduras pesadas.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-nature-charm-animals-and-plants",
    name: "Canalizar Divindade: Encantar Animais e Plantas",
    level: 2,
    description:
      "Bestas e vegetais a até 9 metros que falhem em uma salvaguarda de Sabedoria ficam enfeitiçados por você por 1 minuto.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-nature-dampen-elements",
    name: "Suavizar Elementos",
    level: 6,
    description:
      "Como reação, conceda resistência a dano ácido, gélido, de fogo, elétrico ou trovejante a si ou a um aliado a até 9 metros.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-nature-divine-strike",
    name: "Golpe Divino",
    level: 8,
    description:
      "Uma vez por turno, seus ataques com arma causam 1d8 de dano gélido, de fogo ou elétrico adicional, aumentando para 2d8 no nível 14.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-nature-master-of-nature",
    name: "Mestre da Natureza",
    level: 17,
    description:
      "Você pode comandar, com uma ação bônus, as criaturas enfeitiçadas pelo seu Canalizar Divindade.",
    subclassId: "nature-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Tempestade
  {
    id: "cleric-tempest-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 1,
    description:
      "Ganhe proficiência com armaduras pesadas e armas marciais.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-tempest-wrath-of-the-storm",
    name: "Ira da Tempestade",
    level: 1,
    description:
      "Como reação a um ataque corpo a corpo recebido, cause 2d8 de dano elétrico ou trovejante ao atacante, metade com salvaguarda de Destreza bem-sucedida.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-tempest-destructive-wrath",
    name: "Canalizar Divindade: Ira Destrutiva",
    level: 2,
    description:
      "Ao causar dano elétrico ou trovejante, use o dano máximo possível em vez de rolar os dados.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-tempest-thunderbolt-strike",
    name: "Golpe de Raio",
    level: 6,
    description:
      "Ao causar dano elétrico a uma criatura Grande ou menor, você pode empurrá-la até 3 metros para longe.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-tempest-divine-strike",
    name: "Golpe Divino",
    level: 8,
    description:
      "Uma vez por turno, seus ataques com arma causam 1d8 de dano trovejante adicional, aumentando para 2d8 no nível 14.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-tempest-stormborn",
    name: "Nascido da Tempestade",
    level: 17,
    description:
      "Ao ar livre, você ganha deslocamento de voo igual ao seu deslocamento terrestre.",
    subclassId: "tempest-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Trapaça
  {
    id: "cleric-trickery-blessing-of-the-trickster",
    name: "Bênção do Trapaceiro",
    level: 1,
    description:
      "Com uma ação, conceda vantagem em testes de Furtividade a uma criatura tocada por 1 hora.",
    subclassId: "trickery-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-trickery-invoke-duplicity",
    name: "Canalizar Divindade: Invocar Duplicidade",
    level: 2,
    description:
      "Crie uma ilusão idêntica a você por até 1 minuto. Você pode conjurar magias a partir dela e ganha vantagem em ataques contra alvos próximos aos dois.",
    subclassId: "trickery-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-trickery-cloak-of-shadows",
    name: "Canalizar Divindade: Manto de Sombras",
    level: 6,
    description:
      "Com uma ação, torne-se invisível até o fim do seu próximo turno ou até atacar ou conjurar uma magia.",
    subclassId: "trickery-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-trickery-divine-strike",
    name: "Golpe Divino",
    level: 8,
    description:
      "Uma vez por turno, seus ataques com arma causam 1d8 de dano venenoso adicional, aumentando para 2d8 no nível 14.",
    subclassId: "trickery-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-trickery-improved-duplicity",
    name: "Duplicidade Aprimorada",
    level: 17,
    description:
      "Invocar Duplicidade cria até quatro cópias suas, que podem se mover independentemente.",
    subclassId: "trickery-domain",
    category: "subclass",
    source: PHB,
  },
  // Domínio da Guerra
  {
    id: "cleric-war-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 1,
    description:
      "Ganhe proficiência com armaduras pesadas e armas marciais.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-war-priest",
    name: "Sacerdote de Guerra",
    level: 1,
    description:
      "Ao usar a ação de Ataque, faça um ataque com arma adicional como ação bônus. Usos iguais ao modificador de Sabedoria por descanso.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-war-guided-strike",
    name: "Canalizar Divindade: Golpe Guiado",
    level: 2,
    description:
      "Some +10 a uma rolagem de ataque depois de ver o resultado do dado, mas antes de saber se acertou.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-war-gods-blessing",
    name: "Canalizar Divindade: Bênção do Deus da Guerra",
    level: 6,
    description:
      "Como reação, conceda +10 à rolagem de ataque de um aliado a até 9 metros.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-war-divine-strike",
    name: "Golpe Divino",
    level: 8,
    description:
      "Uma vez por turno, seus ataques com arma causam 1d8 de dano adicional do tipo da arma, aumentando para 2d8 no nível 14.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
  {
    id: "cleric-war-avatar-of-battle",
    name: "Avatar da Batalha",
    level: 17,
    description:
      "Você ganha resistência a dano cortante, perfurante e concussivo de ataques não mágicos.",
    subclassId: "war-domain",
    category: "subclass",
    source: PHB,
  },
];

const DRUID_ABILITIES: ClassAbility[] = [
  {
    id: "druid-druidic",
    name: "Druídico",
    level: 1,
    description:
      "Você conhece o idioma secreto dos druidas e pode deixar mensagens ocultas que só outros iniciados percebem automaticamente.",
    category: "class",
    source: PHB,
  },
  {
    id: "druid-spellcasting",
    name: "Conjuração",
    level: 1,
    description:
      "Você conjura magias de druida usando Sabedoria, preparando diariamente uma lista igual ao nível de druida mais o modificador de Sabedoria.",
    category: "class",
    source: PHB,
  },
  {
    id: "druid-wild-shape",
    name: "Forma Selvagem",
    level: 2,
    description:
      "Com uma ação, assuma a forma de uma besta já vista por até metade do seu nível em horas, duas vezes por descanso. As limitações de ND, natação e voo variam com o nível.",
    category: "class",
    source: PHB,
  },
  {
    id: "druid-circle",
    name: "Círculo Druídico",
    level: 2,
    description:
      "Escolha um círculo druídico, que concede recursos nos níveis 2, 6, 10 e 14.",
    category: "class",
    source: PHB,
  },
  asi("druid", 4),
  {
    id: "druid-wild-shape-4",
    name: "Forma Selvagem Aprimorada (ND 1/2)",
    level: 4,
    description:
      "Você pode assumir formas de besta de até ND 1/2, incluindo criaturas com deslocamento de natação.",
    category: "class",
    source: PHB,
  },
  {
    id: "druid-wild-shape-8",
    name: "Forma Selvagem Aprimorada (ND 1)",
    level: 8,
    description:
      "Você pode assumir formas de besta de até ND 1, incluindo criaturas voadoras.",
    category: "class",
    source: PHB,
  },
  asi("druid", 8),
  asi("druid", 12),
  asi("druid", 16),
  {
    id: "druid-timeless-body",
    name: "Corpo Atemporal",
    level: 18,
    description:
      "Seu corpo envelhece muito mais devagar: a cada 10 anos transcorridos você envelhece apenas 1 ano.",
    category: "class",
    source: PHB,
  },
  {
    id: "druid-beast-spells",
    name: "Magias Bestiais",
    level: 18,
    description:
      "Você pode conjurar magias de druida em forma selvagem, dispensando componentes somáticos e verbais.",
    category: "class",
    source: PHB,
  },
  asi("druid", 19),
  {
    id: "druid-archdruid",
    name: "Arquidruida",
    level: 20,
    description:
      "Você usa Forma Selvagem um número ilimitado de vezes e ignora componentes verbais e somáticos das magias de druida.",
    category: "class",
    source: PHB,
  },
  // Círculo da Terra
  {
    id: "druid-land-bonus-cantrip",
    name: "Truque Bônus",
    level: 2,
    description: "Aprenda um truque de druida adicional à sua escolha.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-land-natural-recovery",
    name: "Recuperação Natural",
    level: 2,
    description:
      "Em um descanso curto, recupere espaços de magia com total de níveis igual a metade do seu nível de druida, arredondado para cima, uma vez por dia.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-land-circle-spells",
    name: "Magias do Círculo",
    level: 3,
    description:
      "Escolha um tipo de terreno (ártico, costa, deserto, floresta, pântano, montanha ou subterrâneo) que concede magias sempre preparadas conforme você sobe de nível.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-land-lands-stride",
    name: "Passo Rústico",
    level: 6,
    description:
      "Terreno difícil natural não reduz seu deslocamento e você tem vantagem em salvaguardas contra plantas criadas magicamente.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-land-natures-ward",
    name: "Proteção da Natureza",
    level: 10,
    description:
      "Você é imune a veneno e doenças e não pode ser enfeitiçado nem amedrontado por elementais ou fadas.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-land-natures-sanctuary",
    name: "Santuário da Natureza",
    level: 14,
    description:
      "Bestas e vegetais devem passar em uma salvaguarda de Sabedoria para atacar você; falhando, escolhem outro alvo ou perdem o ataque.",
    subclassId: "circle-of-the-land",
    category: "subclass",
    source: PHB,
  },
  // Círculo da Lua
  {
    id: "druid-moon-combat-wild-shape",
    name: "Forma Selvagem de Combate",
    level: 2,
    description:
      "Você pode usar Forma Selvagem como ação bônus e gastar um espaço de magia para curar 1d8 por nível do espaço enquanto transformado.",
    subclassId: "circle-of-the-moon",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-moon-circle-forms",
    name: "Formas do Círculo",
    level: 2,
    description:
      "Você pode assumir formas de besta de até ND 1; a partir do nível 6 o limite passa a ser um terço do seu nível de druida, arredondado para baixo.",
    subclassId: "circle-of-the-moon",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-moon-primal-strike",
    name: "Golpe Primitivo",
    level: 6,
    description:
      "Seus ataques em forma de besta contam como mágicos para superar resistências e imunidades.",
    subclassId: "circle-of-the-moon",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-moon-elemental-wild-shape",
    name: "Forma Selvagem Elemental",
    level: 10,
    description:
      "Gaste dois usos de Forma Selvagem simultaneamente para assumir a forma de um elemental do ar, terra, fogo ou água.",
    subclassId: "circle-of-the-moon",
    category: "subclass",
    source: PHB,
  },
  {
    id: "druid-moon-thousand-forms",
    name: "Mil Formas",
    level: 14,
    description:
      "Você pode conjurar alterar-se à vontade, sem gastar espaços de magia.",
    subclassId: "circle-of-the-moon",
    category: "subclass",
    source: PHB,
  },
];

const FIGHTER_ABILITIES: ClassAbility[] = [
  {
    id: "fighter-fighting-style",
    name: "Estilo de Luta",
    level: 1,
    description:
      "Escolha uma especialidade de combate, como Arquearia, Defesa, Duelismo, Combate com Armas Grandes, Proteção ou Combate com Duas Armas.",
    category: "class",
    source: PHB,
  },
  {
    id: "fighter-second-wind",
    name: "Retomar o Fôlego",
    level: 1,
    description:
      "Como ação bônus, recupere 1d10 mais seu nível de guerreiro em pontos de vida, uma vez por descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "fighter-action-surge",
    name: "Surto de Ação",
    level: 2,
    description:
      "No seu turno, realize uma ação adicional além da sua ação normal. Recupera-se com um descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "fighter-martial-archetype",
    name: "Arquétipo Marcial",
    level: 3,
    description:
      "Escolha um arquétipo marcial que concede recursos nos níveis 3, 7, 10, 15 e 18.",
    category: "class",
    source: PHB,
  },
  asi("fighter", 4),
  {
    id: "fighter-extra-attack",
    name: "Ataque Extra",
    level: 5,
    description:
      "Você pode atacar duas vezes sempre que usar a ação de Ataque no seu turno.",
    category: "class",
    source: PHB,
  },
  asi("fighter", 6),
  asi("fighter", 8),
  {
    id: "fighter-indomitable",
    name: "Indomável",
    level: 9,
    description:
      "Você pode rerrolar uma salvaguarda que tenha falhado, usando o novo resultado. Recupera-se com um descanso longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "fighter-extra-attack-2",
    name: "Ataque Extra (2)",
    level: 11,
    description: "Você ataca três vezes ao usar a ação de Ataque.",
    category: "class",
    source: PHB,
  },
  asi("fighter", 12),
  {
    id: "fighter-indomitable-2",
    name: "Indomável (2 usos)",
    level: 13,
    description: "Você pode usar Indomável duas vezes entre descansos longos.",
    category: "class",
    source: PHB,
  },
  asi("fighter", 14),
  asi("fighter", 16),
  {
    id: "fighter-action-surge-2",
    name: "Surto de Ação (2 usos)",
    level: 17,
    description: "Você pode usar Surto de Ação duas vezes entre descansos.",
    category: "class",
    source: PHB,
  },
  {
    id: "fighter-indomitable-3",
    name: "Indomável (3 usos)",
    level: 17,
    description: "Você pode usar Indomável três vezes entre descansos longos.",
    category: "class",
    source: PHB,
  },
  asi("fighter", 19),
  {
    id: "fighter-extra-attack-3",
    name: "Ataque Extra (3)",
    level: 20,
    description: "Você ataca quatro vezes ao usar a ação de Ataque.",
    category: "class",
    source: PHB,
  },
  // Campeão
  {
    id: "fighter-champion-improved-critical",
    name: "Crítico Aprimorado",
    level: 3,
    description:
      "Seus ataques com arma causam acerto crítico com resultado 19 ou 20 no dado.",
    subclassId: "champion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-champion-remarkable-athlete",
    name: "Atleta Notável",
    level: 7,
    description:
      "Some metade do bônus de proficiência, arredondado para cima, a testes de Força, Destreza e Constituição que já não o incluam, e seus saltos com impulso são mais longos.",
    subclassId: "champion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-champion-additional-fighting-style",
    name: "Estilo de Luta Adicional",
    level: 10,
    description: "Escolha um segundo Estilo de Luta.",
    subclassId: "champion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-champion-superior-critical",
    name: "Crítico Superior",
    level: 15,
    description:
      "Seus ataques com arma causam acerto crítico com resultado 18 a 20 no dado.",
    subclassId: "champion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-champion-survivor",
    name: "Sobrevivente",
    level: 18,
    description:
      "No início de cada turno, se estiver com metade ou menos dos pontos de vida e acima de 0, recupere 5 mais seu modificador de Constituição.",
    subclassId: "champion",
    category: "subclass",
    source: PHB,
  },
  // Mestre de Batalha
  {
    id: "fighter-battlemaster-combat-superiority",
    name: "Superioridade em Combate",
    level: 3,
    description:
      "Você aprende manobras alimentadas por dados de superioridade d8, recuperados em descanso curto ou longo, usados para efeitos táticos em combate.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-battlemaster-student-of-war",
    name: "Estudante da Guerra",
    level: 3,
    description:
      "Ganhe proficiência com um tipo de ferramenta de artesão à sua escolha.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-battlemaster-know-your-enemy",
    name: "Conheça seu Inimigo",
    level: 7,
    description:
      "Após 1 minuto observando uma criatura, aprenda como ela se compara a você em atributos físicos, CA, nível e níveis de classe.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-battlemaster-improved-superiority-d10",
    name: "Superioridade Aprimorada (d10)",
    level: 10,
    description: "Seus dados de superioridade passam a ser d10.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-battlemaster-relentless",
    name: "Implacável",
    level: 15,
    description:
      "Ao rolar iniciativa sem dados de superioridade restantes, você recupera um dado.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-battlemaster-improved-superiority-d12",
    name: "Superioridade Aprimorada (d12)",
    level: 18,
    description: "Seus dados de superioridade passam a ser d12.",
    subclassId: "battle-master",
    category: "subclass",
    source: PHB,
  },
  // Cavaleiro Arcano
  {
    id: "fighter-eldritch-knight-spellcasting",
    name: "Conjuração",
    level: 3,
    description:
      "Você aprende magias de mago usando Inteligência, focadas nas escolas de Abjuração e Evocação, com progressão de um terço de conjurador.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-eldritch-knight-weapon-bond",
    name: "Vínculo com a Arma",
    level: 3,
    description:
      "Vincule até duas armas: você pode invocá-las para sua mão como ação bônus e não pode ser desarmado delas enquanto estiver consciente.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-eldritch-knight-war-magic",
    name: "Magia de Guerra",
    level: 7,
    description:
      "Ao conjurar um truque com a ação, você pode fazer um ataque com arma como ação bônus.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-eldritch-knight-eldritch-strike",
    name: "Golpe Arcano",
    level: 10,
    description:
      "Ao acertar um ataque com arma, o alvo tem desvantagem na próxima salvaguarda contra uma magia sua até o fim do seu próximo turno.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-eldritch-knight-arcane-charge",
    name: "Carga Arcana",
    level: 15,
    description:
      "Ao usar Surto de Ação, você pode se teleportar até 9 metros para um espaço desocupado visível.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
  {
    id: "fighter-eldritch-knight-improved-war-magic",
    name: "Magia de Guerra Aprimorada",
    level: 18,
    description:
      "Ao conjurar qualquer magia com a ação, você pode fazer um ataque com arma como ação bônus.",
    subclassId: "eldritch-knight",
    category: "subclass",
    source: PHB,
  },
];

const MONK_ABILITIES: ClassAbility[] = [
  {
    id: "monk-unarmored-defense",
    name: "Defesa sem Armadura",
    level: 1,
    description:
      "Sem armadura e sem escudo, sua CA é igual a 10 + modificador de Destreza + modificador de Sabedoria.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-martial-arts",
    name: "Artes Marciais",
    level: 1,
    description:
      "Com ataques desarmados e armas de monge você usa Destreza, causa dano com o dado de artes marciais e pode fazer um ataque desarmado como ação bônus após atacar.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-ki",
    name: "Ki",
    level: 2,
    description:
      "Você acumula pontos de ki iguais ao seu nível de monge, recuperados em um descanso curto ou longo, usados para alimentar técnicas especiais.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-flurry-of-blows",
    name: "Rajada de Golpes",
    level: 2,
    description:
      "Gaste 1 ponto de ki após a ação de Ataque para fazer dois ataques desarmados como ação bônus.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-patient-defense",
    name: "Defesa Paciente",
    level: 2,
    description:
      "Gaste 1 ponto de ki para realizar a ação de Esquiva como ação bônus.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-step-of-the-wind",
    name: "Passo do Vento",
    level: 2,
    description:
      "Gaste 1 ponto de ki para Disparar ou Desengajar como ação bônus, dobrando também sua distância de salto no turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-unarmored-movement",
    name: "Movimento sem Armadura",
    level: 2,
    description:
      "Sem armadura e sem escudo, seu deslocamento aumenta em 3 metros no level 2, em 4.5 no level 6, em 6 no level 10, em 7.5 no level 14, e chegando a 9 metros adicionais no nível 18.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-monastic-tradition",
    name: "Tradição Monástica",
    level: 3,
    description:
      "Escolha uma tradição monástica, que concede recursos nos níveis 3, 6, 11 e 17.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-deflect-missiles",
    name: "Defletir Projéteis",
    level: 3,
    description:
      "Como reação, reduza o dano de um ataque à distância em 1d10 mais seu nível e modificador de Destreza. Se reduzir a zero, gaste 1 ki para arremessar o projétil de volta.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-slow-fall",
    name: "Queda Lenta",
    level: 4,
    description:
      "Como reação ao cair, reduza o dano da queda em cinco vezes seu nível de monge.",
    category: "class",
    source: PHB,
  },
  asi("monk", 4),
  {
    id: "monk-extra-attack",
    name: "Ataque Extra",
    level: 5,
    description:
      "Você pode atacar duas vezes sempre que usar a ação de Ataque no seu turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-stunning-strike",
    name: "Golpe Atordoante",
    level: 5,
    description:
      "Ao acertar um ataque corpo a corpo, gaste 1 ponto de ki para forçar uma salvaguarda de Constituição; falhando, o alvo fica atordoado até o fim do seu próximo turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-ki-empowered-strikes",
    name: "Golpes Fortalecidos por Ki",
    level: 6,
    description:
      "Seus ataques desarmados contam como mágicos para superar resistências e imunidades.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-evasion",
    name: "Evasão",
    level: 7,
    description:
      "Em efeitos de área com salvaguarda de Destreza, você não sofre dano ao ter sucesso e sofre metade ao falhar.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-stillness-of-mind",
    name: "Tranquilidade Mental",
    level: 7,
    description:
      "Com uma ação, encerre um efeito que esteja deixando você enfeitiçado ou amedrontado.",
    category: "class",
    source: PHB,
  },
  asi("monk", 8),
  {
    id: "monk-purity-of-body",
    name: "Pureza do Corpo",
    level: 10,
    description: "Você fica imune a doenças e venenos.",
    category: "class",
    source: PHB,
  },
  asi("monk", 12),
  {
    id: "monk-tongue-of-the-sun-and-moon",
    name: "Língua do Sol e da Lua",
    level: 13,
    description:
      "Você compreende qualquer idioma falado e qualquer criatura capaz de entender um idioma compreende o que você diz.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-diamond-soul",
    name: "Alma de Diamante",
    level: 14,
    description:
      "Você é proficiente em todas as salvaguardas e pode gastar 1 ponto de ki para rerrolar uma que tenha falhado.",
    category: "class",
    source: PHB,
  },
  {
    id: "monk-timeless-body",
    name: "Corpo Atemporal",
    level: 15,
    description:
      "Você não sofre os efeitos da idade avançada e não precisa mais de comida ou água.",
    category: "class",
    source: PHB,
  },
  asi("monk", 16),
  {
    id: "monk-empty-body",
    name: "Corpo Vazio",
    level: 18,
    description:
      "Gaste 4 pontos de ki para ficar invisível por 1 minuto com resistência a todo dano exceto de força, ou 8 pontos para conjurar projeção astral.",
    category: "class",
    source: PHB,
  },
  asi("monk", 19),
  {
    id: "monk-perfect-self",
    name: "Ser Perfeito",
    level: 20,
    description:
      "Ao rolar iniciativa sem pontos de ki restantes, você recupera 4 pontos de ki.",
    category: "class",
    source: PHB,
  },
  // Caminho da Mão Aberta
  {
    id: "monk-open-hand-technique",
    name: "Técnica da Mão Aberta",
    level: 3,
    description:
      "Ao acertar com Rajada de Golpes, imponha um efeito ao alvo: derrubá-lo, empurrá-lo 4,5 metros ou impedir reações até o fim do seu próximo turno.",
    subclassId: "way-of-the-open-hand",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-open-hand-wholeness-of-body",
    name: "Totalidade do Corpo",
    level: 6,
    description:
      "Com uma ação, cure a si mesmo em três vezes seu nível de monge, uma vez por descanso longo.",
    subclassId: "way-of-the-open-hand",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-open-hand-tranquility",
    name: "Tranquilidade",
    level: 11,
    description:
      "Ao terminar um descanso longo, você fica sob um efeito de santuário até o início do próximo descanso longo ou até atacar.",
    subclassId: "way-of-the-open-hand",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-open-hand-quivering-palm",
    name: "Palma Trêmula",
    level: 17,
    description:
      "Gaste 3 pontos de ki ao acertar um ataque desarmado para instaurar vibrações letais; depois, com uma ação, force uma salvaguarda de Constituição que reduz o alvo a 0 pontos de vida ao falhar.",
    subclassId: "way-of-the-open-hand",
    category: "subclass",
    source: PHB,
  },
  // Caminho das Sombras
  {
    id: "monk-shadow-arts",
    name: "Artes das Sombras",
    level: 3,
    description:
      "Gaste 2 pontos de ki para conjurar escuridão, passos sem pegadas, silêncio ou visão no escuro, e você aprende o truque ilusão menor.",
    subclassId: "way-of-shadow",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-shadow-step",
    name: "Passo Sombrio",
    level: 6,
    description:
      "Como ação bônus na penumbra ou escuridão, teleporte-se até 18 metros para outro espaço com pouca luz e ganhe vantagem no próximo ataque corpo a corpo.",
    subclassId: "way-of-shadow",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-shadow-cloak-of-shadows",
    name: "Manto de Sombras",
    level: 11,
    description:
      "Com uma ação na penumbra ou escuridão, fique invisível até atacar, conjurar uma magia ou entrar em área bem iluminada.",
    subclassId: "way-of-shadow",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-shadow-opportunist",
    name: "Oportunista",
    level: 17,
    description:
      "Como reação, ataque uma criatura a até 1,5 metro logo após ela sofrer dano de outra criatura.",
    subclassId: "way-of-shadow",
    category: "subclass",
    source: PHB,
  },
  // Caminho dos Quatro Elementos
  {
    id: "monk-four-elements-disciple",
    name: "Discípulo dos Elementos",
    level: 3,
    description:
      "Você conhece Sintonização Elemental e aprende disciplinas que convertem Ki em efeitos de ar, terra, fogo e água. Escolha uma disciplina adicional neste nível; novas escolhas surgem nos níveis 6, 11 e 17.",
    subclassId: "way-of-four-elements",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-four-elements-discipline-6",
    name: "Disciplina Elemental Adicional",
    level: 6,
    description:
      "Aprenda mais uma disciplina elemental; você pode gastar até 3 pontos de ki em uma única disciplina.",
    subclassId: "way-of-four-elements",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-four-elements-discipline-11",
    name: "Disciplina Elemental Adicional (2)",
    level: 11,
    description:
      "Aprenda mais uma disciplina elemental; você pode gastar até 4 pontos de ki em uma única disciplina.",
    subclassId: "way-of-four-elements",
    category: "subclass",
    source: PHB,
  },
  {
    id: "monk-four-elements-discipline-17",
    name: "Disciplina Elemental Adicional (3)",
    level: 17,
    description:
      "Aprenda mais uma disciplina elemental; você pode gastar até 5 pontos de ki em uma única disciplina.",
    subclassId: "way-of-four-elements",
    category: "subclass",
    source: PHB,
  },
  // Caminho do Macaco (homebrew)
  {
    id: "monk-monkey-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 3,
    description:
      "Você recebe proficiência em Enganação. Além disso, testes de Carisma (Enganação) recebem um bônus igual ao seu modificador de Sabedoria.",
    subclassId: "way-of-the-monkey",
    category: "subclass",
    source: HOMEBREW,
  },
  {
    id: "monk-monkey-celestial-journey",
    name: "Jornada Celeste",
    level: 3,
    description:
      "Bastão de Ferro: cajados e bordões ganham a propriedade Alcance. Gêmeo Celestial: ação bônus e 2 Ki criam uma cópia a até 9 m por 1 minuto (PV = 2 × nível de monge + mod. de Sabedoria, CA igual à sua); enquanto você estiver a 1,5 m da cópia, ataques contra qualquer um dos dois têm desvantagem, e no início de cada turno você pode mover a cópia até 9 m. 72 Transformações Terrenas: gaste 1 Ki para conjurar disfarçar-se. Guiando as Nuvens: gaste 1 Ki para conjurar passo nebuloso.",
    subclassId: "way-of-the-monkey",
    category: "subclass",
    source: HOMEBREW,
  },
  {
    id: "monk-monkey-defy-the-heavens",
    name: "Desafiar os Céus",
    level: 6,
    description:
      "Quando você é reduzido a 0 pontos de vida sem morrer, recupera uma quantidade de pontos de vida igual a três vezes o seu nível de monge. Só pode usar essa característica novamente após um descanso longo.",
    subclassId: "way-of-the-monkey",
    category: "subclass",
    source: HOMEBREW,
  },
  {
    id: "monk-monkey-primal-strength",
    name: "Força Primitiva",
    level: 11,
    description:
      "Enquanto seu Gêmeo Celestial estiver ativo, sempre que você usar Rajada de Golpes pode fazer um ataque desarmado adicional originado do gêmeo.",
    subclassId: "way-of-the-monkey",
    category: "subclass",
    source: HOMEBREW,
  },
  {
    id: "monk-monkey-five-levels-of-immortality",
    name: "Cinco Níveis de Imortalidade",
    level: 17,
    description:
      "Sempre que fizer um teste de resistência contra a morte e ainda tiver pontos de Ki, pode gastar 4 Ki para tratar a rolagem como um 20 natural. Além disso, você deixa de envelhecer.",
    subclassId: "way-of-the-monkey",
    category: "subclass",
    source: HOMEBREW,
  },
];

const PALADIN_ABILITIES: ClassAbility[] = [
  {
    id: "paladin-divine-sense",
    name: "Sentido Divino",
    level: 1,
    description:
      "Com uma ação, detecte celestiais, corruptores e mortos-vivos a até 18 metros, bem como locais e objetos consagrados ou profanados. Usos iguais a 1 mais o modificador de Carisma.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-lay-on-hands",
    name: "Cura pelas Mãos",
    level: 1,
    description:
      "Você tem uma reserva de cura igual a cinco vezes seu nível de paladino, distribuída ao toque. Gaste 5 pontos para curar uma doença ou neutralizar um veneno.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-fighting-style",
    name: "Estilo de Luta",
    level: 2,
    description:
      "Escolha uma especialidade de combate entre Defesa, Duelismo, Combate com Armas Grandes e Proteção.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-spellcasting",
    name: "Conjuração",
    level: 2,
    description:
      "Você conjura magias de paladino usando Carisma, preparando uma lista igual a metade do seu nível mais o modificador de Carisma.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-divine-smite",
    name: "Castigo Divino",
    level: 2,
    description:
      "Ao acertar um ataque corpo a corpo, gaste um espaço de magia para causar 2d8 de dano radiante adicional, mais 1d8 por nível de espaço acima do 1º, com 1d8 extra contra mortos-vivos e corruptores.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-divine-health",
    name: "Saúde Divina",
    level: 3,
    description: "A magia divina em suas veias torna você imune a doenças.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-sacred-oath",
    name: "Juramento Sagrado",
    level: 3,
    description:
      "Escolha um juramento que concede magias sempre preparadas, opções de Canalizar Divindade e recursos nos níveis 3, 7, 15 e 20.",
    category: "class",
    source: PHB,
  },
  asi("paladin", 4),
  {
    id: "paladin-extra-attack",
    name: "Ataque Extra",
    level: 5,
    description:
      "Você pode atacar duas vezes sempre que usar a ação de Ataque no seu turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-aura-of-protection",
    name: "Aura de Proteção",
    level: 6,
    description:
      "Você e aliados a até 3 metros somam seu modificador de Carisma (mínimo +1) a todas as salvaguardas. O alcance aumenta para 9 metros no nível 18.",
    category: "class",
    source: PHB,
  },
  asi("paladin", 8),
  {
    id: "paladin-aura-of-courage",
    name: "Aura de Coragem",
    level: 10,
    description:
      "Você e aliados a até 3 metros não podem ser amedrontados enquanto você estiver consciente. O alcance aumenta para 9 metros no nível 18.",
    category: "class",
    source: PHB,
  },
  {
    id: "paladin-improved-divine-smite",
    name: "Castigo Divino Aprimorado",
    level: 11,
    description:
      "Todos os seus ataques corpo a corpo com arma causam 1d8 de dano radiante adicional.",
    category: "class",
    source: PHB,
  },
  asi("paladin", 12),
  {
    id: "paladin-cleansing-touch",
    name: "Toque Purificador",
    level: 14,
    description:
      "Com uma ação, encerre uma magia ativa em si ou em uma criatura tocada. Usos iguais ao modificador de Carisma por descanso longo.",
    category: "class",
    source: PHB,
  },
  asi("paladin", 16),
  {
    id: "paladin-aura-improvements",
    name: "Auras Aprimoradas",
    level: 18,
    description:
      "O alcance das suas auras de paladino aumenta de 3 para 9 metros.",
    category: "class",
    source: PHB,
  },
  asi("paladin", 19),
  // Juramento da Devoção
  {
    id: "paladin-devotion-sacred-weapon",
    name: "Canalizar Divindade: Arma Sagrada",
    level: 3,
    description:
      "Por 1 minuto, some seu modificador de Carisma aos ataques com uma arma, que passa a ser mágica e emite luz.",
    subclassId: "oath-of-devotion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-devotion-turn-the-unholy",
    name: "Canalizar Divindade: Expulsar os Profanos",
    level: 3,
    description:
      "Corruptores e mortos-vivos a até 9 metros que falhem em uma salvaguarda de Sabedoria ficam expulsos por 1 minuto.",
    subclassId: "oath-of-devotion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-devotion-aura-of-devotion",
    name: "Aura de Devoção",
    level: 7,
    description:
      "Você e aliados na sua aura não podem ser enfeitiçados enquanto você estiver consciente.",
    subclassId: "oath-of-devotion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-devotion-purity-of-spirit",
    name: "Pureza de Espírito",
    level: 15,
    description:
      "Você está permanentemente sob o efeito de proteção contra o bem e o mal.",
    subclassId: "oath-of-devotion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-devotion-holy-nimbus",
    name: "Auréola Sagrada",
    level: 20,
    description:
      "Por 1 minuto, emane luz solar que causa 10 de dano radiante a inimigos próximos e dá vantagem em salvaguardas contra magias de corruptores e mortos-vivos.",
    subclassId: "oath-of-devotion",
    category: "subclass",
    source: PHB,
  },
  // Juramento dos Anciões
  {
    id: "paladin-ancients-natures-wrath",
    name: "Canalizar Divindade: Ira da Natureza",
    level: 3,
    description:
      "Vinhas espectrais prendem uma criatura próxima que falhe em uma salvaguarda de Força ou Destreza, deixando-a agarrada.",
    subclassId: "oath-of-ancients",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-ancients-turn-the-faithless",
    name: "Canalizar Divindade: Expulsar os Infiéis",
    level: 3,
    description:
      "Fadas e corruptores a até 9 metros que falhem em uma salvaguarda de Sabedoria ficam expulsos por 1 minuto e têm disfarces mágicos revelados.",
    subclassId: "oath-of-ancients",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-ancients-aura-of-warding",
    name: "Aura de Proteção Ancestral",
    level: 7,
    description:
      "Você e aliados na sua aura têm resistência a dano causado por magias.",
    subclassId: "oath-of-ancients",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-ancients-undying-sentinel",
    name: "Sentinela Imortal",
    level: 15,
    description:
      "Ao cair a 0 pontos de vida sem morrer instantaneamente, fique com 1 ponto de vida, uma vez por descanso longo. Você também não sofre penalidades por envelhecimento.",
    subclassId: "oath-of-ancients",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-ancients-elder-champion",
    name: "Campeão Ancião",
    level: 20,
    description:
      "Por 1 minuto, regenere 10 pontos de vida por turno, conjure magias de paladino como ação bônus e imponha desvantagem em salvaguardas contra suas magias e Canalizar Divindade.",
    subclassId: "oath-of-ancients",
    category: "subclass",
    source: PHB,
  },
  // Juramento da Vingança
  {
    id: "paladin-vengeance-abjure-enemy",
    name: "Canalizar Divindade: Repudiar Inimigo",
    level: 3,
    description:
      "Uma criatura a até 18 metros que falhe em uma salvaguarda de Sabedoria fica amedrontada e paralisada por até 1 minuto.",
    subclassId: "oath-of-vengeance",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-vengeance-vow-of-enmity",
    name: "Canalizar Divindade: Voto de Inimizade",
    level: 3,
    description:
      "Como ação bônus, ganhe vantagem em ataques contra uma criatura escolhida por 1 minuto ou até ela cair.",
    subclassId: "oath-of-vengeance",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-vengeance-relentless-avenger",
    name: "Vingador Implacável",
    level: 7,
    description:
      "Ao acertar um ataque de oportunidade, você pode se mover até metade do seu deslocamento imediatamente, sem provocar ataques.",
    subclassId: "oath-of-vengeance",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-vengeance-soul-of-vengeance",
    name: "Alma da Vingança",
    level: 15,
    description:
      "Como reação, faça um ataque corpo a corpo contra a criatura sob seu Voto de Inimizade quando ela atacar.",
    subclassId: "oath-of-vengeance",
    category: "subclass",
    source: PHB,
  },
  {
    id: "paladin-vengeance-avenging-angel",
    name: "Anjo Vingador",
    level: 20,
    description:
      "Por 1 hora, ganhe deslocamento de voo de 18 metros e uma aura amedrontadora que impõe desvantagem a inimigos próximos.",
    subclassId: "oath-of-vengeance",
    category: "subclass",
    source: PHB,
  },
];

const RANGER_ABILITIES: ClassAbility[] = [
  {
    id: "ranger-favored-enemy",
    name: "Inimigo Favorito",
    level: 1,
    description:
      "Escolha um tipo de criatura: você tem vantagem em testes de Sobrevivência para rastreá-la e de Inteligência para lembrar informações sobre ela, além de aprender um idioma associado.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-natural-explorer",
    name: "Explorador Natural",
    level: 1,
    description:
      "Escolha um tipo de terreno favorito: viagens ali são mais rápidas e seguras, terreno difícil não atrapalha o grupo e você recebe o dobro do bônus de proficiência em testes de Inteligência e Sabedoria relacionados.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-fighting-style",
    name: "Estilo de Luta",
    level: 2,
    description:
      "Escolha uma especialidade entre Arquearia, Defesa, Duelismo e Combate com Duas Armas.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-spellcasting",
    name: "Conjuração",
    level: 2,
    description:
      "Você conjura magias de patrulheiro usando Sabedoria, com progressão de meio conjurador e um número fixo de magias conhecidas.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-archetype",
    name: "Arquétipo de Patrulheiro",
    level: 3,
    description:
      "Escolha um arquétipo que concede recursos nos níveis 3, 7, 11 e 15.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-primeval-awareness",
    name: "Percepção Primitiva",
    level: 3,
    description:
      "Gaste um espaço de magia para sentir, por 1 minuto por nível do espaço, se há aberrações, celestiais, dragões, elementais, fadas, corruptores ou mortos-vivos a até 1,5 quilômetro.",
    category: "class",
    source: PHB,
  },
  asi("ranger", 4),
  {
    id: "ranger-extra-attack",
    name: "Ataque Extra",
    level: 5,
    description:
      "Você pode atacar duas vezes sempre que usar a ação de Ataque no seu turno.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-favored-enemy-6",
    name: "Inimigo Favorito Aprimorado",
    level: 6,
    description: "Escolha um tipo adicional de inimigo favorito e mais um idioma.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-natural-explorer-6",
    name: "Explorador Natural Aprimorado",
    level: 6,
    description: "Escolha um tipo adicional de terreno favorito.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-lands-stride",
    name: "Passo Rústico",
    level: 8,
    description:
      "Terreno difícil não mágico não reduz seu deslocamento e você tem vantagem em salvaguardas contra plantas criadas magicamente.",
    category: "class",
    source: PHB,
  },
  asi("ranger", 8),
  {
    id: "ranger-hide-in-plain-sight",
    name: "Esconder-se à Vista",
    level: 10,
    description:
      "Após 1 minuto de camuflagem, ganhe +10 em testes de Furtividade enquanto permanecer imóvel contra uma superfície.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-natural-explorer-10",
    name: "Explorador Natural (3)",
    level: 10,
    description: "Escolha um terceiro tipo de terreno favorito.",
    category: "class",
    source: PHB,
  },
  asi("ranger", 12),
  {
    id: "ranger-favored-enemy-14",
    name: "Inimigo Favorito (3)",
    level: 14,
    description: "Escolha um terceiro tipo de inimigo favorito e mais um idioma.",
    category: "class",
    source: PHB,
  },
  {
    id: "ranger-vanish",
    name: "Desaparecer",
    level: 14,
    description:
      "Você pode se Esconder como ação bônus e não pode ser rastreado por meios não mágicos, a menos que escolha deixar rastros.",
    category: "class",
    source: PHB,
  },
  asi("ranger", 16),
  {
    id: "ranger-feral-senses",
    name: "Sentidos Selvagens",
    level: 18,
    description:
      "Você não tem desvantagem ao atacar criaturas invisíveis que consiga ouvir ou sentir e percebe a localização de criaturas ocultas a até 9 metros.",
    category: "class",
    source: PHB,
  },
  asi("ranger", 19),
  {
    id: "ranger-foe-slayer",
    name: "Matador de Inimigos",
    level: 20,
    description:
      "Uma vez por turno, some seu modificador de Sabedoria ao ataque ou ao dano contra um inimigo favorito.",
    category: "class",
    source: PHB,
  },
  // Caçador
  {
    id: "ranger-hunter-hunters-prey",
    name: "Presa do Caçador",
    level: 3,
    description:
      "Escolha uma técnica: Assassino de Colossos, Destruidor de Hordas ou Matador de Gigantes.",
    subclassId: "hunter",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-hunter-defensive-tactics",
    name: "Táticas Defensivas",
    level: 7,
    description:
      "Escolha uma defesa: Escapar da Horda, Defesa Multiataque ou Firmeza contra Imensos.",
    subclassId: "hunter",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-hunter-multiattack",
    name: "Multiataque",
    level: 11,
    description:
      "Escolha Salva de Flechas, que atinge vários alvos a distância, ou Ataque Giratório, que atinge inimigos adjacentes.",
    subclassId: "hunter",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-hunter-superior-defense",
    name: "Defesa Superior do Caçador",
    level: 15,
    description:
      "Escolha Esquiva, Fuga do Hábil ou Resistir Mesmo Ferido como defesa aprimorada.",
    subclassId: "hunter",
    category: "subclass",
    source: PHB,
  },
  // Mestre de Feras
  {
    id: "ranger-beastmaster-companion",
    name: "Companheiro do Patrulheiro",
    level: 3,
    description:
      "Ganhe uma besta companheira de tamanho Médio ou menor e ND 1/4 ou menor, que age conforme seus comandos e usa seu bônus de proficiência.",
    subclassId: "beast-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-beastmaster-exceptional-training",
    name: "Treinamento Excepcional",
    level: 7,
    description:
      "Nos turnos em que o companheiro não ataca, ele pode Disparar, Desengajar, Esquivar ou Ajudar como ação bônus, e seus ataques contam como mágicos.",
    subclassId: "beast-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-beastmaster-bestial-fury",
    name: "Fúria Bestial",
    level: 11,
    description:
      "Seu companheiro faz dois ataques sempre que você o manda atacar.",
    subclassId: "beast-master",
    category: "subclass",
    source: PHB,
  },
  {
    id: "ranger-beastmaster-share-spells",
    name: "Compartilhar Magias",
    level: 15,
    description:
      "Ao conjurar uma magia em si mesmo, você pode estendê-la ao companheiro se ele estiver a até 9 metros.",
    subclassId: "beast-master",
    category: "subclass",
    source: PHB,
  },
];

const ROGUE_ABILITIES: ClassAbility[] = [
  {
    id: "rogue-expertise-1",
    name: "Especialização",
    level: 1,
    description:
      "Escolha duas perícias proficientes, ou uma perícia e ferramentas de ladrão, para dobrar o bônus de proficiência.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-sneak-attack",
    name: "Ataque Furtivo",
    level: 1,
    description:
      "Uma vez por turno, cause dano extra a um alvo atacado com vantagem ou com um aliado adjacente a ele, usando arma sutil ou à distância.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-thieves-cant",
    name: "Gíria de Ladrão",
    level: 1,
    description:
      "Você conhece o dialeto secreto e os sinais usados por ladrões para trocar mensagens ocultas em conversas comuns.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-cunning-action",
    name: "Ação Ardilosa",
    level: 2,
    description:
      "Você pode usar a ação bônus para Disparar, Desengajar ou se Esconder em cada um dos seus turnos.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-archetype",
    name: "Arquétipo de Ladino",
    level: 3,
    description:
      "Escolha um arquétipo que concede recursos nos níveis 3, 9, 13 e 17.",
    category: "class",
    source: PHB,
  },
  asi("rogue", 4),
  {
    id: "rogue-uncanny-dodge",
    name: "Esquiva Sobrenatural",
    level: 5,
    description:
      "Como reação a um atacante visível, reduza pela metade o dano do ataque.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-expertise-2",
    name: "Especialização (2)",
    level: 6,
    description:
      "Escolha mais duas perícias proficientes ou ferramentas de ladrão para dobrar o bônus de proficiência.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-evasion",
    name: "Evasão",
    level: 7,
    description:
      "Em efeitos de área com salvaguarda de Destreza, você não sofre dano ao ter sucesso e sofre metade ao falhar.",
    category: "class",
    source: PHB,
  },
  asi("rogue", 8),
  asi("rogue", 10),
  {
    id: "rogue-reliable-talent",
    name: "Talento Confiável",
    level: 11,
    description:
      "Em testes de habilidade com perícias proficientes, trate qualquer resultado de d20 menor que 10 como 10.",
    category: "class",
    source: PHB,
  },
  asi("rogue", 12),
  {
    id: "rogue-blindsense",
    name: "Sentido Cego",
    level: 14,
    description:
      "Enquanto puder ouvir, você percebe a localização de criaturas ocultas ou invisíveis a até 3 metros.",
    category: "class",
    source: PHB,
  },
  {
    id: "rogue-slippery-mind",
    name: "Mente Escorregadia",
    level: 15,
    description: "Você ganha proficiência em salvaguardas de Sabedoria.",
    category: "class",
    source: PHB,
  },
  asi("rogue", 16),
  {
    id: "rogue-elusive",
    name: "Evasivo",
    level: 18,
    description:
      "Nenhum ataque tem vantagem contra você enquanto você não estiver incapacitado.",
    category: "class",
    source: PHB,
  },
  asi("rogue", 19),
  {
    id: "rogue-stroke-of-luck",
    name: "Golpe de Sorte",
    level: 20,
    description:
      "Transforme um ataque que errou em acerto ou trate um teste de habilidade como se tivesse rolado 20, uma vez por descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  // Ladrão
  {
    id: "rogue-thief-fast-hands",
    name: "Mãos Rápidas",
    level: 3,
    description:
      "Use a Ação Ardilosa para fazer testes de Prestidigitação, usar ferramentas de ladrão ou aplicar a ação de Usar um Objeto.",
    subclassId: "thief",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-thief-second-story-work",
    name: "Trabalho no Segundo Andar",
    level: 3,
    description:
      "Escalar não custa movimento extra e seus saltos com impulso ganham distância conforme sua Destreza.",
    subclassId: "thief",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-thief-supreme-sneak",
    name: "Furtividade Suprema",
    level: 9,
    description:
      "Você tem vantagem em testes de Furtividade nos turnos em que se move no máximo metade do deslocamento.",
    subclassId: "thief",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-thief-use-magic-device",
    name: "Usar Dispositivo Mágico",
    level: 13,
    description:
      "Você ignora todos os requisitos de classe, raça e nível para usar itens mágicos.",
    subclassId: "thief",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-thief-thiefs-reflexes",
    name: "Reflexos do Ladrão",
    level: 17,
    description:
      "No primeiro round de combate você age duas vezes: na sua iniciativa e novamente na iniciativa menos 10.",
    subclassId: "thief",
    category: "subclass",
    source: PHB,
  },
  // Assassino
  {
    id: "rogue-assassin-bonus-proficiencies",
    name: "Proficiências Bônus",
    level: 3,
    description:
      "Ganhe proficiência com kit de disfarces e kit de envenenamento.",
    subclassId: "assassin",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-assassin-assassinate",
    name: "Assassinar",
    level: 3,
    description:
      "Você tem vantagem contra criaturas que ainda não agiram no combate, e qualquer acerto contra uma criatura surpresa é crítico.",
    subclassId: "assassin",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-assassin-infiltration-expertise",
    name: "Especialista em Infiltração",
    level: 9,
    description:
      "Com tempo e recursos, crie identidades falsas convincentes e sustente-as indefinidamente.",
    subclassId: "assassin",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-assassin-impostor",
    name: "Impostor",
    level: 13,
    description:
      "Após estudar uma criatura, imite sua fala, escrita e maneirismos de forma quase indistinguível.",
    subclassId: "assassin",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-assassin-death-strike",
    name: "Golpe Mortal",
    level: 17,
    description:
      "Ao acertar uma criatura surpresa, ela faz uma salvaguarda de Constituição contra sua CD ou sofre o dobro do dano.",
    subclassId: "assassin",
    category: "subclass",
    source: PHB,
  },
  // Trapaceiro Arcano
  {
    id: "rogue-arcane-trickster-spellcasting",
    name: "Conjuração",
    level: 3,
    description:
      "Você aprende magias de mago usando Inteligência, focadas em Encantamento e Ilusão, com progressão de um terço de conjurador.",
    subclassId: "arcane-trickster",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-arcane-trickster-mage-hand-legerdemain",
    name: "Prestidigitação com Mãos Mágicas",
    level: 3,
    description:
      "Sua mão mágica fica invisível e pode furtar objetos, abrir fechaduras e manipular itens usando seus testes de Prestidigitação.",
    subclassId: "arcane-trickster",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-arcane-trickster-magical-ambush",
    name: "Emboscada Mágica",
    level: 9,
    description:
      "Criaturas que não conseguem ver você têm desvantagem em salvaguardas contra magias que você conjura.",
    subclassId: "arcane-trickster",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-arcane-trickster-versatile-trickster",
    name: "Trapaceiro Versátil",
    level: 13,
    description:
      "Use a mão mágica como ação bônus para distrair uma criatura, ganhando vantagem em ataques contra ela neste turno.",
    subclassId: "arcane-trickster",
    category: "subclass",
    source: PHB,
  },
  {
    id: "rogue-arcane-trickster-spell-thief",
    name: "Ladrão de Magias",
    level: 17,
    description:
      "Como reação a uma magia lançada contra você, roube-a: o conjurador falha e você pode usá-la por 8 horas, uma vez por descanso longo.",
    subclassId: "arcane-trickster",
    category: "subclass",
    source: PHB,
  },
];

const SORCERER_ABILITIES: ClassAbility[] = [
  {
    id: "sorcerer-spellcasting",
    name: "Conjuração",
    level: 1,
    description:
      "Você conjura magias arcanas inatas usando Carisma, conhecendo um número limitado de truques e magias que não podem ser trocados livremente.",
    category: "class",
    source: PHB,
  },
  {
    id: "sorcerer-origin",
    name: "Origem Feiticeira",
    level: 1,
    description:
      "Escolha a fonte do seu poder mágico, que concede recursos nos níveis 1, 6, 14 e 18.",
    category: "class",
    source: PHB,
  },
  {
    id: "sorcerer-font-of-magic",
    name: "Fonte de Magia",
    level: 2,
    description:
      "Você ganha pontos de feitiçaria iguais ao seu nível, podendo convertê-los em espaços de magia e vice-versa. Recuperam-se em descanso longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "sorcerer-metamagic-1",
    name: "Metamagia",
    level: 3,
    description:
      "Escolha duas opções de metamagia, como Magia Sutil, Magia Gêmea ou Magia Acelerada, gastando pontos de feitiçaria para alterar suas magias.",
    category: "class",
    source: PHB,
  },
  asi("sorcerer", 4),
  asi("sorcerer", 8),
  {
    id: "sorcerer-metamagic-2",
    name: "Metamagia (3ª opção)",
    level: 10,
    description: "Escolha mais uma opção de metamagia.",
    category: "class",
    source: PHB,
  },
  asi("sorcerer", 12),
  asi("sorcerer", 16),
  {
    id: "sorcerer-metamagic-3",
    name: "Metamagia (4ª opção)",
    level: 17,
    description: "Escolha mais uma opção de metamagia.",
    category: "class",
    source: PHB,
  },
  asi("sorcerer", 19),
  {
    id: "sorcerer-sorcerous-restoration",
    name: "Restauração Feiticeira",
    level: 20,
    description:
      "Ao terminar um descanso curto, recupere 4 pontos de feitiçaria gastos.",
    category: "class",
    source: PHB,
  },
  // Linhagem Dracônica
  {
    id: "sorcerer-draconic-ancestor",
    name: "Ancestral Dragão",
    level: 1,
    description:
      "Escolha um tipo de dragão: você fala Dracônico, tem vantagem em interações sociais com dragões e ganha afinidade com o dano do seu ancestral.",
    subclassId: "draconic-bloodline",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-draconic-resilience",
    name: "Resiliência Dracônica",
    level: 1,
    description:
      "Seus pontos de vida máximos aumentam em 1 por nível de feiticeiro e, sem armadura, sua CA é 13 mais o modificador de Destreza.",
    subclassId: "draconic-bloodline",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-draconic-elemental-affinity",
    name: "Afinidade Elemental",
    level: 6,
    description:
      "Some seu modificador de Carisma ao dano de magias do tipo do seu ancestral e, gastando 1 ponto de feitiçaria, ganhe resistência a esse dano por 1 hora.",
    subclassId: "draconic-bloodline",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-draconic-dragon-wings",
    name: "Asas de Dragão",
    level: 14,
    description:
      "Como ação bônus, manifeste asas que concedem deslocamento de voo igual ao seu deslocamento terrestre.",
    subclassId: "draconic-bloodline",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-draconic-presence",
    name: "Presença Dracônica",
    level: 18,
    description:
      "Gaste 5 pontos de feitiçaria para emanar uma aura de 18 metros por 1 minuto, deixando inimigos enfeitiçados ou amedrontados se falharem em uma salvaguarda de Sabedoria.",
    subclassId: "draconic-bloodline",
    category: "subclass",
    source: PHB,
  },
  // Magia Selvagem
  {
    id: "sorcerer-wild-magic-surge",
    name: "Surto de Magia Selvagem",
    level: 1,
    description:
      "Ao conjurar uma magia de 1º nível ou superior, o mestre pode pedir um d20; com resultado 1, role na tabela de surtos para um efeito mágico aleatório.",
    subclassId: "wild-magic",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-wild-magic-tides-of-chaos",
    name: "Marés do Caos",
    level: 1,
    description:
      "Ganhe vantagem em um ataque, teste ou salvaguarda; o uso é recuperado quando o mestre provoca um surto de magia selvagem.",
    subclassId: "wild-magic",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-wild-magic-bend-luck",
    name: "Dobrar a Sorte",
    level: 6,
    description:
      "Como reação, gaste 2 pontos de feitiçaria para somar ou subtrair 1d4 da rolagem de outra criatura.",
    subclassId: "wild-magic",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-wild-magic-controlled-chaos",
    name: "Caos Controlado",
    level: 14,
    description:
      "Ao provocar um surto de magia selvagem, role duas vezes na tabela e escolha o resultado.",
    subclassId: "wild-magic",
    category: "subclass",
    source: PHB,
  },
  {
    id: "sorcerer-wild-magic-spell-bombardment",
    name: "Bombardeio Mágico",
    level: 18,
    description:
      "Uma vez por turno, ao rolar dano com dados e obter o valor máximo em um deles, role esse dado novamente e some o resultado.",
    subclassId: "wild-magic",
    category: "subclass",
    source: PHB,
  },
];

const WARLOCK_ABILITIES: ClassAbility[] = [
  {
    id: "warlock-patron",
    name: "Patrono Sobrenatural",
    level: 1,
    description:
      "Escolha o ser que lhe concede poder, ganhando magias ampliadas e recursos nos níveis 1, 6, 10 e 14.",
    category: "class",
    source: PHB,
  },
  {
    id: "warlock-pact-magic",
    name: "Magia de Pacto",
    level: 1,
    description:
      "Você conjura usando Carisma com poucos espaços de magia, sempre do nível mais alto disponível, recuperados em um descanso curto ou longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "warlock-eldritch-invocations",
    name: "Invocações Místicas",
    level: 2,
    description:
      "Aprenda fragmentos de conhecimento proibido que concedem habilidades permanentes ou magias; o número de invocações cresce com o nível.",
    category: "class",
    source: PHB,
  },
  {
    id: "warlock-pact-boon",
    name: "Dádiva de Pacto",
    level: 3,
    description:
      "Escolha o Pacto da Corrente (familiar aprimorado), da Lâmina (arma de pacto) ou do Tomo (livro com truques extras).",
    category: "class",
    source: PHB,
  },
  asi("warlock", 4),
  asi("warlock", 8),
  {
    id: "warlock-mystic-arcanum-6",
    name: "Arcano Místico (6º nível)",
    level: 11,
    description:
      "Escolha uma magia de 6º nível de bruxo que pode ser conjurada uma vez por descanso longo sem gastar espaços.",
    category: "class",
    source: PHB,
  },
  asi("warlock", 12),
  {
    id: "warlock-mystic-arcanum-7",
    name: "Arcano Místico (7º nível)",
    level: 13,
    description:
      "Escolha uma magia de 7º nível conjurável uma vez por descanso longo.",
    category: "class",
    source: PHB,
  },
  {
    id: "warlock-mystic-arcanum-8",
    name: "Arcano Místico (8º nível)",
    level: 15,
    description:
      "Escolha uma magia de 8º nível conjurável uma vez por descanso longo.",
    category: "class",
    source: PHB,
  },
  asi("warlock", 16),
  {
    id: "warlock-mystic-arcanum-9",
    name: "Arcano Místico (9º nível)",
    level: 17,
    description:
      "Escolha uma magia de 9º nível conjurável uma vez por descanso longo.",
    category: "class",
    source: PHB,
  },
  asi("warlock", 19),
  {
    id: "warlock-eldritch-master",
    name: "Mestre Místico",
    level: 20,
    description:
      "Com 1 minuto de súplica ao patrono, recupere todos os espaços de Magia de Pacto, uma vez por descanso longo.",
    category: "class",
    source: PHB,
  },
  // Arquifada
  {
    id: "warlock-archfey-fey-presence",
    name: "Presença Feérica",
    level: 1,
    description:
      "Com uma ação, criaturas em um cubo de 3 metros que falhem em uma salvaguarda de Sabedoria ficam enfeitiçadas ou amedrontadas até o fim do seu próximo turno.",
    subclassId: "archfey",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-archfey-misty-escape",
    name: "Fuga Nebulosa",
    level: 6,
    description:
      "Ao sofrer dano, use a reação para ficar invisível e se teleportar até 18 metros, permanecendo oculto até atacar ou conjurar.",
    subclassId: "archfey",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-archfey-beguiling-defenses",
    name: "Defesas Enganosas",
    level: 10,
    description:
      "Você é imune a ficar enfeitiçado e pode refletir tentativas de enfeitiçamento de volta ao conjurador.",
    subclassId: "archfey",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-archfey-dark-delirium",
    name: "Delírio Sombrio",
    level: 14,
    description:
      "Com uma ação, mergulhe uma criatura a até 18 metros em uma ilusão por 1 minuto, deixando-a enfeitiçada ou amedrontada e isolada da realidade.",
    subclassId: "archfey",
    category: "subclass",
    source: PHB,
  },
  // Corruptor
  {
    id: "warlock-fiend-dark-ones-blessing",
    name: "Bênção do Sombrio",
    level: 1,
    description:
      "Sempre que reduzir uma criatura hostil a 0 pontos de vida, ganhe pontos de vida temporários iguais ao modificador de Carisma mais seu nível de bruxo.",
    subclassId: "fiend",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-fiend-dark-ones-own-luck",
    name: "Sorte do Sombrio",
    level: 6,
    description:
      "Some 1d10 a um teste de habilidade ou salvaguarda depois de rolar, uma vez por descanso curto ou longo.",
    subclassId: "fiend",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-fiend-fiendish-resilience",
    name: "Resiliência Corruptora",
    level: 10,
    description:
      "Ao terminar um descanso, escolha um tipo de dano não mágico para resistir até escolher outro.",
    subclassId: "fiend",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-fiend-hurl-through-hell",
    name: "Arremessar pelo Inferno",
    level: 14,
    description:
      "Ao acertar uma criatura, envie-a a planos hostis até o fim do seu próximo turno, causando 10d10 de dano psíquico se ela não for um corruptor. Uma vez por descanso longo.",
    subclassId: "fiend",
    category: "subclass",
    source: PHB,
  },
  // Grande Antigo
  {
    id: "warlock-goo-awakened-mind",
    name: "Mente Desperta",
    level: 1,
    description:
      "Você pode falar telepaticamente com qualquer criatura a até 9 metros que compreenda algum idioma.",
    subclassId: "great-old-one",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-goo-entropic-ward",
    name: "Guarda Entrópica",
    level: 6,
    description:
      "Como reação, imponha desvantagem a um ataque contra você; se ele errar, seu próximo ataque contra o atacante tem vantagem. Uma vez por descanso.",
    subclassId: "great-old-one",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-goo-thought-shield",
    name: "Escudo de Pensamentos",
    level: 10,
    description:
      "Seus pensamentos não podem ser lidos, você resiste a dano psíquico e devolve o mesmo dano a quem causá-lo.",
    subclassId: "great-old-one",
    category: "subclass",
    source: PHB,
  },
  {
    id: "warlock-goo-create-thrall",
    name: "Criar Servo",
    level: 14,
    description:
      "Toque uma criatura humanoide incapacitada para enfeitiçá-la até que seja curada, mantendo comunicação telepática ilimitada com ela.",
    subclassId: "great-old-one",
    category: "subclass",
    source: PHB,
  },
];

const WIZARD_ABILITIES: ClassAbility[] = [
  {
    id: "wizard-spellcasting",
    name: "Conjuração",
    level: 1,
    description:
      "Você estuda magias arcanas usando Inteligência, escrevendo-as em um grimório e preparando diariamente uma seleção delas.",
    category: "class",
    source: PHB,
  },
  {
    id: "wizard-arcane-recovery",
    name: "Recuperação Arcana",
    level: 1,
    description:
      "Uma vez por dia, em um descanso curto, recupere espaços de magia com total de níveis igual a metade do seu nível de mago, arredondado para cima (nenhum de 6º nível ou superior).",
    category: "class",
    source: PHB,
  },
  {
    id: "wizard-arcane-tradition",
    name: "Tradição Arcana",
    level: 2,
    description:
      "Escolha uma escola de magia como especialidade, ganhando recursos nos níveis 2, 6, 10 e 14.",
    category: "class",
    source: PHB,
  },
  asi("wizard", 4),
  asi("wizard", 8),
  asi("wizard", 12),
  asi("wizard", 16),
  {
    id: "wizard-spell-mastery",
    name: "Maestria em Magias",
    level: 18,
    description:
      "Escolha uma magia de 1º nível e uma de 2º nível do grimório: você pode conjurá-las no nível mais baixo à vontade, sem gastar espaços.",
    category: "class",
    source: PHB,
  },
  asi("wizard", 19),
  {
    id: "wizard-signature-spells",
    name: "Magias de Assinatura",
    level: 20,
    description:
      "Escolha duas magias de 3º nível que ficam sempre preparadas e podem ser conjuradas uma vez cada sem gastar espaço, recuperando-se em um descanso curto.",
    category: "class",
    source: PHB,
  },
  // Abjuração
  {
    id: "wizard-abjuration-savant",
    name: "Estudioso da Abjuração",
    level: 2,
    description:
      "Copiar magias de abjuração no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-abjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-abjuration-arcane-ward",
    name: "Proteção Arcana",
    level: 2,
    description:
      "Ao conjurar uma magia de abjuração, crie uma barreira com pontos de vida iguais ao dobro do seu nível mais o modificador de Inteligência, que absorve dano no seu lugar.",
    subclassId: "school-of-abjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-abjuration-projected-ward",
    name: "Proteção Projetada",
    level: 6,
    description:
      "Como reação, use sua Proteção Arcana para absorver o dano sofrido por uma criatura a até 9 metros.",
    subclassId: "school-of-abjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-abjuration-improved-abjuration",
    name: "Abjuração Aprimorada",
    level: 10,
    description:
      "Some seu bônus de proficiência a testes de habilidade exigidos por magias de abjuração, como dissipar magia.",
    subclassId: "school-of-abjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-abjuration-spell-resistance",
    name: "Resistência a Magia",
    level: 14,
    description:
      "Você tem vantagem em salvaguardas contra magias e resistência ao dano causado por elas.",
    subclassId: "school-of-abjuration",
    category: "subclass",
    source: PHB,
  },
  // Conjuração
  {
    id: "wizard-conjuration-savant",
    name: "Estudioso da Conjuração",
    level: 2,
    description:
      "Copiar magias de conjuração no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-conjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-conjuration-minor-conjuration",
    name: "Conjuração Menor",
    level: 2,
    description:
      "Com uma ação, crie um objeto inanimado de até 1 metro e 4,5 quilos na sua mão ou no chão, que dura 1 hora.",
    subclassId: "school-of-conjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-conjuration-benign-transposition",
    name: "Transposição Benigna",
    level: 6,
    description:
      "Com uma ação, teleporte-se até 9 metros ou troque de lugar com um aliado disposto do mesmo tamanho.",
    subclassId: "school-of-conjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-conjuration-focused-conjuration",
    name: "Conjuração Focada",
    level: 10,
    description:
      "Sua concentração em magias de conjuração não pode ser quebrada por sofrer dano.",
    subclassId: "school-of-conjuration",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-conjuration-durable-summons",
    name: "Invocações Duráveis",
    level: 14,
    description:
      "Criaturas invocadas por suas magias começam com 30 pontos de vida temporários.",
    subclassId: "school-of-conjuration",
    category: "subclass",
    source: PHB,
  },
  // Adivinhação
  {
    id: "wizard-divination-savant",
    name: "Estudioso da Adivinhação",
    level: 2,
    description:
      "Copiar magias de adivinhação no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-divination",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-divination-portent",
    name: "Presságio",
    level: 2,
    description:
      "Após um descanso longo, role dois d20 e reserve os resultados para substituir qualquer ataque, teste ou salvaguarda feito por você ou por outra criatura.",
    subclassId: "school-of-divination",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-divination-expert-divination",
    name: "Adivinhação Experiente",
    level: 6,
    description:
      "Ao conjurar uma magia de adivinhação de 2º nível ou superior, recupere um espaço de nível inferior ao usado.",
    subclassId: "school-of-divination",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-divination-third-eye",
    name: "Terceiro Olho",
    level: 10,
    description:
      "Após um descanso, ganhe um benefício sensorial como visão no escuro superior, ver invisibilidade, ler qualquer idioma ou visão etérea.",
    subclassId: "school-of-divination",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-divination-greater-portent",
    name: "Presságio Maior",
    level: 14,
    description: "Você rola três d20 para o Presságio em vez de dois.",
    subclassId: "school-of-divination",
    category: "subclass",
    source: PHB,
  },
  // Encantamento
  {
    id: "wizard-enchantment-savant",
    name: "Estudioso do Encantamento",
    level: 2,
    description:
      "Copiar magias de encantamento no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-enchantment",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-enchantment-hypnotic-gaze",
    name: "Olhar Hipnótico",
    level: 2,
    description:
      "Com uma ação, uma criatura a até 1,5 metro que falhe em uma salvaguarda de Sabedoria fica enfeitiçada e incapacitada enquanto você mantiver o olhar.",
    subclassId: "school-of-enchantment",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-enchantment-instinctive-charm",
    name: "Encanto Instintivo",
    level: 6,
    description:
      "Como reação a um ataque, force o atacante a mirar outra criatura se ele falhar em uma salvaguarda de Sabedoria.",
    subclassId: "school-of-enchantment",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-enchantment-split-enchantment",
    name: "Encantamento Dividido",
    level: 10,
    description:
      "Magias de encantamento de alvo único podem atingir um segundo alvo.",
    subclassId: "school-of-enchantment",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-enchantment-alter-memories",
    name: "Alterar Memórias",
    level: 14,
    description:
      "Faça uma criatura esquecer que esteve enfeitiçada e apague até várias horas de lembranças recentes.",
    subclassId: "school-of-enchantment",
    category: "subclass",
    source: PHB,
  },
  // Evocação
  {
    id: "wizard-evocation-savant",
    name: "Estudioso da Evocação",
    level: 2,
    description:
      "Copiar magias de evocação no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-evocation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-evocation-sculpt-spells",
    name: "Esculpir Magias",
    level: 2,
    description:
      "Ao conjurar uma magia de evocação em área, escolha até 1 mais o nível da magia em aliados que automaticamente passam na salvaguarda e não sofrem dano.",
    subclassId: "school-of-evocation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-evocation-potent-cantrip",
    name: "Truque Potente",
    level: 6,
    description:
      "Criaturas que passem na salvaguarda contra seus truques ainda sofrem metade do dano.",
    subclassId: "school-of-evocation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-evocation-empowered-evocation",
    name: "Evocação Fortalecida",
    level: 10,
    description:
      "Some seu modificador de Inteligência ao dano de uma magia de evocação de mago que você conjurar.",
    subclassId: "school-of-evocation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-evocation-overchannel",
    name: "Sobrecarga",
    level: 14,
    description:
      "Cause dano máximo com uma magia de 1º a 5º nível; a partir do segundo uso antes de um descanso longo você sofre dano necrótico crescente.",
    subclassId: "school-of-evocation",
    category: "subclass",
    source: PHB,
  },
  // Ilusão
  {
    id: "wizard-illusion-savant",
    name: "Estudioso da Ilusão",
    level: 2,
    description:
      "Copiar magias de ilusão no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-illusion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-illusion-improved-minor-illusion",
    name: "Ilusão Menor Aprimorada",
    level: 2,
    description:
      "Você aprende ilusão menor e pode criar som e imagem com a mesma conjuração.",
    subclassId: "school-of-illusion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-illusion-malleable-illusions",
    name: "Ilusões Maleáveis",
    level: 6,
    description:
      "Com uma ação, altere a natureza de uma ilusão sua de duração igual ou superior a 1 minuto.",
    subclassId: "school-of-illusion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-illusion-illusory-self",
    name: "Eu Ilusório",
    level: 10,
    description:
      "Como reação a um ataque que acertaria você, crie um duplo ilusório que faz o ataque errar. Recupera-se em descanso curto ou longo.",
    subclassId: "school-of-illusion",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-illusion-illusory-reality",
    name: "Realidade Ilusória",
    level: 14,
    description:
      "Torne real por 1 minuto um objeto inanimado dentro de uma ilusão que você esteja mantendo.",
    subclassId: "school-of-illusion",
    category: "subclass",
    source: PHB,
  },
  // Necromancia
  {
    id: "wizard-necromancy-savant",
    name: "Estudioso da Necromancia",
    level: 2,
    description:
      "Copiar magias de necromancia no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-necromancy",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-necromancy-grim-harvest",
    name: "Colheita Sombria",
    level: 2,
    description:
      "Uma vez por turno, ao matar uma criatura com uma magia, recupere o dobro do nível da magia em pontos de vida, ou o triplo se for magia de necromancia.",
    subclassId: "school-of-necromancy",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-necromancy-undead-thralls",
    name: "Servos Mortos-Vivos",
    level: 6,
    description:
      "Você aprende animar mortos e pode criar um morto-vivo adicional por conjuração, com pontos de vida e dano aumentados.",
    subclassId: "school-of-necromancy",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-necromancy-inured-to-undeath",
    name: "Habituado à Morte",
    level: 10,
    description:
      "Você tem resistência a dano necrótico e seu máximo de pontos de vida não pode ser reduzido.",
    subclassId: "school-of-necromancy",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-necromancy-command-undead",
    name: "Comandar Mortos-Vivos",
    level: 14,
    description:
      "Com uma ação, tome o controle de um morto-vivo a até 18 metros que falhe em uma salvaguarda de Carisma.",
    subclassId: "school-of-necromancy",
    category: "subclass",
    source: PHB,
  },
  // Transmutação
  {
    id: "wizard-transmutation-savant",
    name: "Estudioso da Transmutação",
    level: 2,
    description:
      "Copiar magias de transmutação no grimório custa metade do tempo e do ouro.",
    subclassId: "school-of-transmutation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-transmutation-minor-alchemy",
    name: "Alquimia Menor",
    level: 2,
    description:
      "Após 10 minutos de concentração, transforme um material como madeira, pedra ou ferro em outro por 1 hora.",
    subclassId: "school-of-transmutation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-transmutation-transmuters-stone",
    name: "Pedra do Transmutador",
    level: 6,
    description:
      "Crie uma pedra que concede a quem a carrega visão no escuro, deslocamento aumentado, proficiência em salvaguardas de Constituição ou resistência a um tipo de dano elemental.",
    subclassId: "school-of-transmutation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-transmutation-shapechanger",
    name: "Metamorfo",
    level: 10,
    description:
      "Você aprende polimorfia e pode conjurá-la em si mesmo, sem gastar espaço, uma vez por descanso curto ou longo, virando uma besta de ND 1 ou menor.",
    subclassId: "school-of-transmutation",
    category: "subclass",
    source: PHB,
  },
  {
    id: "wizard-transmutation-master-transmuter",
    name: "Mestre Transmutador",
    level: 14,
    description:
      "Consuma a Pedra do Transmutador para transformar grandes quantidades de matéria, remover males, restaurar juventude ou criar um item mágico menor.",
    subclassId: "school-of-transmutation",
    category: "subclass",
    source: PHB,
  },
];

export const CLASS_ABILITIES: Record<string, ClassAbility[]> = {
  barbarian: BARBARIAN_ABILITIES,
  bard: BARD_ABILITIES,
  cleric: CLERIC_ABILITIES,
  druid: DRUID_ABILITIES,
  fighter: FIGHTER_ABILITIES,
  monk: MONK_ABILITIES,
  paladin: PALADIN_ABILITIES,
  ranger: RANGER_ABILITIES,
  rogue: ROGUE_ABILITIES,
  sorcerer: SORCERER_ABILITIES,
  warlock: WARLOCK_ABILITIES,
  wizard: WIZARD_ABILITIES,
};

const rageUses = (level: number): string => {
  if (level >= 20) return "Ilimitadas";
  if (level >= 17) return "6 por descanso longo";
  if (level >= 12) return "5 por descanso longo";
  if (level >= 6) return "4 por descanso longo";
  if (level >= 3) return "3 por descanso longo";
  return "2 por descanso longo";
};

const rageDamage = (level: number): number => {
  if (level >= 16) return 4;
  if (level >= 9) return 3;
  return 2;
};

const bardicInspirationDie = (level: number): string => {
  if (level >= 15) return "d12";
  if (level >= 10) return "d10";
  if (level >= 5) return "d8";
  return "d6";
};

const channelDivinityUses = (level: number): number => {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  return 1;
};

const martialArtsDie = (level: number): string => {
  if (level >= 17) return "d10";
  if (level >= 11) return "d8";
  if (level >= 5) return "d6";
  return "d4";
};

const sneakAttackDice = (level: number): number => Math.ceil(level / 2);

export const CLASS_RESOURCE_SUMMARIES: ClassResourceSummary[] = [
  {
    classId: "barbarian",
    name: "Fúrias",
    getValue: (level) => rageUses(level),
    detail: (level) => `Dano de Fúria +${rageDamage(level)}`,
  },
  {
    classId: "barbarian",
    name: "Dano de Fúria",
    getValue: (level) => `+${rageDamage(level)}`,
    detail: () => "Ataques corpo a corpo com Força durante a fúria",
  },
  {
    classId: "bard",
    name: "Inspiração Bárdica",
    getValue: (level) => bardicInspirationDie(level),
    detail: (level) =>
      level >= 5
        ? "Usos iguais ao mod. de Carisma, recuperados em descanso curto"
        : "Usos iguais ao mod. de Carisma, recuperados em descanso longo",
  },
  {
    classId: "bard",
    name: "Canção do Descanso",
    getValue: (level) => {
      if (level >= 17) return "1d12";
      if (level >= 13) return "1d10";
      if (level >= 9) return "1d8";
      return "1d6";
    },
    detail: () => "Cura extra para aliados em descanso curto",
  },
  {
    classId: "cleric",
    name: "Canalizar Divindade",
    getValue: (level) =>
      level >= 2 ? `${channelDivinityUses(level)} por descanso` : "—",
    detail: (level) => {
      if (level >= 17) return "Destruir Mortos-Vivos ND 4 ou menor";
      if (level >= 14) return "Destruir Mortos-Vivos ND 3 ou menor";
      if (level >= 11) return "Destruir Mortos-Vivos ND 2 ou menor";
      if (level >= 8) return "Destruir Mortos-Vivos ND 1 ou menor";
      if (level >= 5) return "Destruir Mortos-Vivos ND 1/2 ou menor";
      return "Expulsar Mortos-Vivos";
    },
  },
  {
    classId: "druid",
    name: "Forma Selvagem",
    getValue: (level) => {
      if (level < 2) return "—";
      if (level >= 8) return "Besta de ND 1";
      if (level >= 4) return "Besta de ND 1/2";
      return "Besta de ND 1/4";
    },
    detail: (level) => {
      if (level >= 20) return "Usos ilimitados";
      if (level >= 8) return "2 usos por descanso, sem restrição de voo";
      if (level >= 4) return "2 usos por descanso, sem deslocamento de voo";
      return "2 usos por descanso, sem natação nem voo";
    },
  },
  {
    classId: "fighter",
    name: "Surto de Ação",
    getValue: (level) => {
      if (level >= 17) return "2 por descanso";
      if (level >= 2) return "1 por descanso";
      return "—";
    },
    detail: () => "Uma ação adicional no seu turno",
  },
  {
    classId: "fighter",
    name: "Indomável",
    getValue: (level) => {
      if (level >= 17) return "3 por descanso longo";
      if (level >= 13) return "2 por descanso longo";
      if (level >= 9) return "1 por descanso longo";
      return "—";
    },
    detail: () => "Rerrolar uma salvaguarda falha",
  },
  {
    classId: "monk",
    name: "Pontos de Ki",
    getValue: (level) => (level >= 2 ? `${level}` : "—"),
    detail: (level) =>
      level >= 2
        ? `CD de Ki ${8 + Math.floor((level - 1) / 4) + 1}, recuperados em descanso curto`
        : "Disponível a partir do 2º nível",
  },
  {
    classId: "monk",
    name: "Artes Marciais",
    getValue: (level) => martialArtsDie(level),
    detail: (level) =>
      `Movimento sem armadura +${level >= 18 ? 9 : level >= 14 ? 7.5 : level >= 10 ? 6 : level >= 6 ? 4.5 : level >= 2 ? 3 : 0} m`,
  },
  {
    classId: "paladin",
    name: "Cura pelas Mãos",
    getValue: (level) => `${level * 5} pontos de vida`,
    detail: () => "Reserva recuperada em descanso longo; 5 pontos curam veneno ou doença",
  },
  {
    classId: "rogue",
    name: "Ataque Furtivo",
    getValue: (level) => `${sneakAttackDice(level)}d6`,
    detail: () => "Uma vez por turno, com vantagem ou aliado adjacente ao alvo",
  },
  {
    classId: "sorcerer",
    name: "Pontos de Feitiçaria",
    getValue: (level) => (level >= 2 ? `${level}` : "—"),
    detail: (level) =>
      level >= 3
        ? "Usados em Metamagia e conversão de espaços"
        : "Disponível a partir do 2º nível",
  },
  {
    classId: "wizard",
    name: "Recuperação Arcana",
    getValue: (level) => `${Math.ceil(level / 2)} níveis de espaço`,
    detail: () => "Uma vez por dia, em um descanso curto (nada acima do 5º nível)",
  },
];

export function getUnlockedClassAbilities(
  classId: string,
  subclassId: string,
  level: number
): ClassAbility[] {
  const abilities = CLASS_ABILITIES[classId] ?? [];
  return abilities
    .filter(
      (ability) =>
        ability.level <= level &&
        (!ability.subclassId || ability.subclassId === subclassId)
    )
    .sort((a, b) =>
      a.level !== b.level
        ? a.level - b.level
        : Number(Boolean(a.subclassId)) - Number(Boolean(b.subclassId))
    );
}

export function getClassResourceSummaries(
  classId: string,
  level: number
): Array<{ name: string; value: string; detail?: string }> {
  return CLASS_RESOURCE_SUMMARIES.filter(
    (resource) => resource.classId === classId
  ).map((resource) => ({
    name: resource.name,
    value: resource.getValue(level),
    detail: resource.detail?.(level),
  }));
}
