import type { Ability, CharacterFormData, Skill } from "../../types/character";

import { getResolvedSkillProficiencies } from "./raceResolution";
import { getAsiFeatSkills } from "./classFeatures";
import { getAbilityModifier } from "./abilities";

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

export function getProficientSkills(data: CharacterFormData): Set<Skill> {
    const monkeyPath = data.classes.some(
        (selection) =>
            selection.classId === "monk" &&
            selection.subclassId === "way-of-the-monkey" &&
            selection.level >= 3
    );

    const flagged = Object.entries(data.skills ?? {})
        .filter(([, value]) => value?.proficient)
        .map(([id]) => id as Skill);

    return new Set<Skill>([
        ...getResolvedSkillProficiencies(data),
        ...(data.skillProficiencies?.race ?? []),
        ...(data.skillProficiencies?.class ?? []),
        ...(data.skillProficiencies?.background ?? []),
        ...(data.skillProficiencies?.talent ?? []),
        ...getAsiFeatSkills(data),
        ...(monkeyPath ? ["deception" as Skill] : []),
        ...flagged,
    ]);
}

export function getSkillExtraBonus(
    data: CharacterFormData,
    skill: Skill,
    abilities: Record<Ability, number>
): number {
    const monkeyPath = data.classes.some(
        (selection) =>
            selection.classId === "monk" &&
            selection.subclassId === "way-of-the-monkey" &&
            selection.level >= 3
    );

    if (monkeyPath && skill === "deception") {
        return getAbilityModifier(abilities.wisdom);
    }

    return 0;
}