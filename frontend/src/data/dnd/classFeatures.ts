import type {
    Ability,
    CharacterClassSelection,
    CharacterFormData,
    Skill,
} from "../../types/character";

const STANDARD_ASI_LEVELS = [4, 8, 12, 16, 19] as const;

export const CLASS_ASI_LEVELS: Record<string, readonly number[]> = {
    barbarian: STANDARD_ASI_LEVELS,
    bard: STANDARD_ASI_LEVELS,
    cleric: STANDARD_ASI_LEVELS,
    druid: STANDARD_ASI_LEVELS,
    fighter: [4, 6, 8, 12, 14, 16, 19],
    monk: STANDARD_ASI_LEVELS,
    paladin: STANDARD_ASI_LEVELS,
    ranger: STANDARD_ASI_LEVELS,
    rogue: [4, 8, 10, 12, 16, 19],
    sorcerer: STANDARD_ASI_LEVELS,
    warlock: STANDARD_ASI_LEVELS,
    wizard: STANDARD_ASI_LEVELS,
};

export interface AsiMilestone {
    key: string;
    classId: string;
    classLevel: number;
}

export function getAsiMilestones(
    classes: CharacterClassSelection[]
): AsiMilestone[] {
    return classes.flatMap((selection) =>
        (CLASS_ASI_LEVELS[selection.classId] ?? [])
            .filter((level) => selection.level >= level)
            .map((level) => ({
                key: `${selection.classId}:${level}`,
                classId: selection.classId,
                classLevel: level,
            }))
    );
}

export function getAsiFeatSkills(data: CharacterFormData): Skill[] {
    const validKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );

    return Object.entries(data.asiSelections).flatMap(([key, selection]) => {
        if (
            !validKeys.has(key) ||
            selection.kind !== "feat" ||
            selection.featId !== "skilled"
        ) {
            return [];
        }

        return (selection.featChoices.skills ?? []) as Skill[];
    });
}

export function getFeatSavingThrowAbilities(data: CharacterFormData): Ability[] {
    const abilities: Ability[] = [];
    const initial = data.talentId === "resilient"
        ? data.talentChoices.ability
        : undefined;
    const initialAbility = Array.isArray(initial) ? initial[0] : initial;
    if (initialAbility) abilities.push(initialAbility as Ability);

    const validKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );
    Object.entries(data.asiSelections).forEach(([key, selection]) => {
        if (
            validKeys.has(key) &&
            selection.kind === "feat" &&
            selection.featId === "resilient"
        ) {
            const ability = selection.featChoices.ability?.[0];
            if (ability) abilities.push(ability as Ability);
        }
    });

    return [...new Set(abilities)];
}
