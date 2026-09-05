import type { Ability, Skill } from "../../types/character";

export interface DndSkill {
    id: Skill;
    name: string;
    ability: Ability;
}

export const DND_SKILLS: DndSkill[] = [
    {
        id: "acrobatics",
        name: "Acrobacia",
        ability: "dexterity",
    },
    {
        id: "animal-handling",
        name: "Adestrar Animais",
        ability: "wisdom",
    },
    {
        id: "arcana",
        name: "Arcanismo",
        ability: "intelligence",
    },
    {
        id: "athletics",
        name: "Atletismo",
        ability: "strength",
    },
    {
        id: "deception",
        name: "Enganação",
        ability: "charisma",
    },
    {
        id: "history",
        name: "História",
        ability: "intelligence",
    },
    {
        id: "insight",
        name: "Intuição",
        ability: "wisdom",
    },
    {
        id: "intimidation",
        name: "Intimidação",
        ability: "charisma",
    },
    {
        id: "investigation",
        name: "Investigação",
        ability: "intelligence",
    },
    {
        id: "medicine",
        name: "Medicina",
        ability: "wisdom",
    },
    {
        id: "nature",
        name: "Natureza",
        ability: "intelligence",
    },
    {
        id: "perception",
        name: "Percepção",
        ability: "wisdom",
    },
    {
        id: "performance",
        name: "Atuação",
        ability: "charisma",
    },
    {
        id: "persuasion",
        name: "Persuasão",
        ability: "charisma",
    },
    {
        id: "religion",
        name: "Religião",
        ability: "intelligence",
    },
    {
        id: "sleight-of-hand",
        name: "Prestidigitação",
        ability: "dexterity",
    },
    {
        id: "stealth",
        name: "Furtividade",
        ability: "dexterity",
    },
    {
        id: "survival",
        name: "Sobrevivência",
        ability: "wisdom",
    },
];