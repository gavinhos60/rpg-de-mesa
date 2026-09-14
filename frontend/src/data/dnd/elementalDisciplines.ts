export interface ElementalDiscipline {
    id: string;
    name: string;
    minLevel: number;
    kiCost: string;
    description: string;
    fixed?: boolean;
}

/** Disciplinas do Caminho dos Quatro Elementos (PHB 2014). */
export const ELEMENTAL_DISCIPLINES: ElementalDiscipline[] = [
    {
        id: "elemental-attunement",
        name: "Sintonização Elemental",
        minLevel: 3,
        kiCost: "—",
        fixed: true,
        description:
            "Você cria efeitos menores dos elementos: acender ou apagar uma chama pequena, gelar água, moldar terra ou criar uma brisa suave.",
    },
    {
        id: "fangs-of-the-fire-snake",
        name: "Presas da Serpente de Fogo",
        minLevel: 3,
        kiCost: "1+",
        description:
            "Enquanto usar Rajada de Golpes, seu alcance desarmado aumenta em 3 m e os ataques causam dano de fogo. Você pode gastar Ki extra para causar mais dano de fogo em um acerto.",
    },
    {
        id: "fist-of-four-thunders",
        name: "Punho dos Quatro Trovões",
        minLevel: 3,
        kiCost: "2+",
        description:
            "Gaste Ki para conjurar onda trovejante. Espaços maiores aumentam o efeito conforme a magia.",
    },
    {
        id: "fist-of-unbroken-air",
        name: "Punho do Ar Ininterrupto",
        minLevel: 3,
        kiCost: "2+",
        description:
            "Como ação, escolha uma criatura a até 9 m: ela faz um teste de resistência de Força. Se falhar, sofre dano de concussão, é empurrada e pode cair caída.",
    },
    {
        id: "rush-of-the-gale-spirits",
        name: "Ímpeto dos Espíritos da Ventania",
        minLevel: 3,
        kiCost: "2+",
        description:
            "Gaste Ki para conjurar rajada de vento.",
    },
    {
        id: "shape-the-flowing-river",
        name: "Moldar o Rio Fluente",
        minLevel: 3,
        kiCost: "1",
        description:
            "Como ação, congela, derrete ou molda água e gelo em uma área a até 36 m, criando ou removendo terreno difícil.",
    },
    {
        id: "sweeping-cinder-strike",
        name: "Golpe de Brasas Varredoras",
        minLevel: 3,
        kiCost: "2+",
        description:
            "Gaste Ki para conjurar mãos flamejantes.",
    },
    {
        id: "water-whip",
        name: "Chicote de Água",
        minLevel: 3,
        kiCost: "2+",
        description:
            "Como ação bônus, um chicote de água ataca uma criatura a até 9 m. Ela faz um teste de resistência de Destreza: se falhar, sofre dano de concussão e é puxada ou derrubada.",
    },
    {
        id: "clench-of-the-north-wind",
        name: "Garra do Vento Norte",
        minLevel: 6,
        kiCost: "3+",
        description:
            "Gaste Ki para conjurar imobilizar pessoa.",
    },
    {
        id: "gong-of-the-summit",
        name: "Gong do Cume",
        minLevel: 6,
        kiCost: "3+",
        description:
            "Gaste Ki para conjurar estilhaçar.",
    },
    {
        id: "flames-of-the-phoenix",
        name: "Chamas da Fênix",
        minLevel: 11,
        kiCost: "4+",
        description:
            "Gaste Ki para conjurar bola de fogo.",
    },
    {
        id: "mist-stance",
        name: "Postura da Névoa",
        minLevel: 11,
        kiCost: "4+",
        description:
            "Gaste Ki para conjurar forma gasosa sobre si mesmo.",
    },
    {
        id: "ride-the-wind",
        name: "Montar o Vento",
        minLevel: 11,
        kiCost: "4+",
        description:
            "Gaste Ki para conjurar voar sobre si mesmo.",
    },
    {
        id: "breath-of-winter",
        name: "Sopro do Inverno",
        minLevel: 17,
        kiCost: "6",
        description:
            "Gaste Ki para conjurar cone de frio.",
    },
    {
        id: "eternal-mountain-defense",
        name: "Defesa da Montanha Eterna",
        minLevel: 17,
        kiCost: "5+",
        description:
            "Gaste Ki para conjurar pele de pedra sobre si mesmo.",
    },
    {
        id: "river-of-hungry-flame",
        name: "Rio da Chama Faminta",
        minLevel: 17,
        kiCost: "5+",
        description:
            "Gaste Ki para conjurar muralha de fogo.",
    },
    {
        id: "wave-of-rolling-earth",
        name: "Onda da Terra Rolante",
        minLevel: 17,
        kiCost: "6",
        description:
            "Gaste Ki para conjurar muralha de pedra.",
    },
];

export const FOUR_ELEMENTS_DISCIPLINE_KEY = "monk:way-of-four-elements:disciplines";

export function getFourElementsDisciplineLimit(monkLevel: number): number {
    if (monkLevel < 3) return 0;
    let count = 1;
    if (monkLevel >= 6) count += 1;
    if (monkLevel >= 11) count += 1;
    if (monkLevel >= 17) count += 1;
    return count;
}

export function getChoosableElementalDisciplines(
    monkLevel: number
): ElementalDiscipline[] {
    return ELEMENTAL_DISCIPLINES.filter(
        (discipline) => !discipline.fixed && discipline.minLevel <= monkLevel
    );
}

export function getFixedElementalDisciplines(): ElementalDiscipline[] {
    return ELEMENTAL_DISCIPLINES.filter((discipline) => discipline.fixed);
}

export function getSelectedElementalDisciplines(
    featureChoices: Record<string, string[]> | undefined
): string[] {
    return (featureChoices?.[FOUR_ELEMENTS_DISCIPLINE_KEY] ?? []).filter(Boolean);
}

export function getElementalDiscipline(id: string): ElementalDiscipline | undefined {
    return ELEMENTAL_DISCIPLINES.find((discipline) => discipline.id === id);
}
