import type { Ability } from "../../types/character";

export const ABILITIES: {
    id: Ability;
    name: string;
    shortName: string;
}[] = [
    {
        id: "strength",
        name: "Força",
        shortName: "FOR",
    },
    {
        id: "dexterity",
        name: "Destreza",
        shortName: "DES",
    },
    {
        id: "constitution",
        name: "Constituição",
        shortName: "CON",
    },
    {
        id: "intelligence",
        name: "Inteligência",
        shortName: "INT",
    },
    {
        id: "wisdom",
        name: "Sabedoria",
        shortName: "SAB",
    },
    {
        id: "charisma",
        name: "Carisma",
        shortName: "CAR",
    },
];

export function getAbilityModifier(value: number): number {
    return Math.floor((value - 10) / 2);
}