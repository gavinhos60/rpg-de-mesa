import type {
    Ability,
    CharacterFormData,
} from "../../types/character";

import {
    getResolvedAbilityScoreChoices,
    getResolvedAbilityScoreIncrease,
} from "../../data/dnd/raceResolution";

export function getFinalAbilities(
    data: CharacterFormData
): Record<Ability, number> {
    const abilities: Record<Ability, number> = {
        strength: data.abilities.strength,
        dexterity: data.abilities.dexterity,
        constitution: data.abilities.constitution,
        intelligence: data.abilities.intelligence,
        wisdom: data.abilities.wisdom,
        charisma: data.abilities.charisma,
    };

    const raceIncrease = getResolvedAbilityScoreIncrease(data);
    for (const [ability, bonus] of Object.entries(raceIncrease)) {
        if (bonus) {
            abilities[ability as Ability] += bonus;
        }
    }

    const abilityChoices =
        data.raceChoices?.abilityScoreIncrease ?? [];
    const abilityScoreChoices = getResolvedAbilityScoreChoices(data);

    if (abilityScoreChoices && abilityChoices.length > 0) {
        for (const ability of abilityChoices) {
            if (
                abilityScoreChoices.abilities.includes(
                    ability as Ability
                )
            ) {
                abilities[ability as Ability] +=
                    abilityScoreChoices.amount;
            }
        }
    }

    return abilities;
}
