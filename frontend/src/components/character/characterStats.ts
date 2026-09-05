import type {
    Ability,
    CharacterFormData,
} from "../../types/character";

import { DND_RACES } from "./races";

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

    const race = DND_RACES.find(
        (item) => item.id === data.raceId
    );

    if (!race) {
        return abilities;
    }

    /*
     * ---------------------------------------------
     * BÔNUS RACIAIS FIXOS
     * ---------------------------------------------
     */

    if (race.abilityScoreIncrease) {
        for (const [ability, bonus] of Object.entries(
            race.abilityScoreIncrease
        )) {
            if (bonus) {
                abilities[ability as Ability] +=
                    bonus;
            }
        }
    }

    /*
     * ---------------------------------------------
     * ESCOLHAS RACIAIS DE ATRIBUTO
     * ---------------------------------------------
     *
     * Exemplo:
     *
     * +1 em uma habilidade escolhida
     * +2 em uma habilidade escolhida
     *
     * O CharacterIdentity salva essas escolhas
     * em:
     *
     * raceChoices.abilityScoreIncrease
     */

    const abilityChoices =
        data.raceChoices?.abilityScoreIncrease ?? [];

    if (
        race.abilityScoreChoices &&
        abilityChoices.length > 0
    ) {
        for (const ability of abilityChoices) {
            if (
                race.abilityScoreChoices.abilities.includes(
                    ability as Ability
                )
            ) {
                abilities[ability as Ability] +=
                    race.abilityScoreChoices.amount;
            }
        }
    }

    return abilities;
}