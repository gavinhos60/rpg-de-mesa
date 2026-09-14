import type {
    Ability,
    AsiSelection,
    CharacterTalent,
    CharacterFormData,
} from "../../types/character";

import { DND_TALENTS } from "./talents";
import { getAsiMilestones } from "./classFeatures";
import {
    getResolvedAbilityScoreChoices,
    getResolvedAbilityScoreIncrease,
} from "./raceResolution";

export const MAX_ABILITY_SCORE = 20;
export const MIN_ABILITY_SCORE = 1;

function emptyBonuses(): Record<Ability, number> {
    return {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
    };
}

export function getAbilityBonuses(
    data: CharacterFormData
): Record<Ability, number> {

    const bonuses = emptyBonuses();

    const raceIncrease = getResolvedAbilityScoreIncrease(data);

    for (const [ability, bonus] of Object.entries(raceIncrease)) {
        if (bonus) {
            bonuses[ability as Ability] += bonus;
        }
    }

    const abilityChoices =
        data.raceChoices?.abilityScoreIncrease ?? [];

    const abilityScoreChoices = getResolvedAbilityScoreChoices(data);

    if (abilityScoreChoices && abilityChoices.length > 0) {
        for (const ability of abilityChoices) {
            if (abilityScoreChoices.abilities.includes(ability as Ability)) {
                bonuses[ability as Ability] += abilityScoreChoices.amount;
            }
        }
    }

    addFeatBonus(
        bonuses,
        DND_TALENTS.find((talent) => talent.id === data.talentId),
        data.talentChoices
    );

    const validAsiKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );

    Object.entries(data.asiSelections).forEach(([key, selection]) => {
        if (!validAsiKeys.has(key)) return;

        if (selection.kind === "ability") {
            addAsiBonus(bonuses, selection);
            return;
        }

        addFeatBonus(
            bonuses,
            DND_TALENTS.find((talent) => talent.id === selection.featId),
            selection.featChoices
        );
    });

    return bonuses;
}

export function getFinalAbilities(
    data: CharacterFormData
): Record<Ability, number> {

    const bonuses = getAbilityBonuses(data);

    return {
        strength: capScore(data.abilities.strength + bonuses.strength),
        dexterity: capScore(data.abilities.dexterity + bonuses.dexterity),
        constitution: capScore(data.abilities.constitution + bonuses.constitution),
        intelligence: capScore(data.abilities.intelligence + bonuses.intelligence),
        wisdom: capScore(data.abilities.wisdom + bonuses.wisdom),
        charisma: capScore(data.abilities.charisma + bonuses.charisma),
    };
}

export function getMaxBaseAbilities(
    data: CharacterFormData
): Record<Ability, number> {

    const bonuses = getAbilityBonuses(data);
    const limits = emptyBonuses();

    for (const ability of Object.keys(limits) as Ability[]) {
        limits[ability] = Math.max(
            MIN_ABILITY_SCORE,
            MAX_ABILITY_SCORE - bonuses[ability]
        );
    }

    return limits;
}

function capScore(value: number): number {
    return Math.min(MAX_ABILITY_SCORE, value);
}

function addAsiBonus(
    bonuses: Record<Ability, number>,
    selection: Extract<AsiSelection, { kind: "ability" }>
) {
    if (selection.mode === "single") {
        const ability = selection.abilities[0];
        if (ability) bonuses[ability] += 2;
        return;
    }

    [...new Set(selection.abilities)].slice(0, 2).forEach((ability) => {
        bonuses[ability] += 1;
    });
}

function addFeatBonus(
    bonuses: Record<Ability, number>,
    talent: CharacterTalent | undefined,
    choices: Record<string, string | string[]> | Record<string, string[]>
) {
    const increase = talent?.abilityScoreIncrease;
    if (!increase) return;

    const allowed = increase.choices ?? [];
    const rawChoice =
        choices.abilityScoreIncrease ??
        choices.ability;
    const selected = Array.isArray(rawChoice) ? rawChoice[0] : rawChoice;
    const ability =
        selected && isAbility(selected)
            ? selected
            : allowed.length === 1
                ? allowed[0]
                : undefined;

    if (ability && (allowed.length === 0 || allowed.includes(ability))) {
        bonuses[ability] += increase.amount;
    }
}

function isAbility(value: string): value is Ability {
    return [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ].includes(value);
}
