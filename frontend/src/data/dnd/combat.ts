import type {
    Ability,
    CharacterClass,
} from "../../types/character";

import { getAbilityModifier } from "./abilities";

export function getHitDie(
    characterClass: CharacterClass
): number {
    return characterClass.hitDie;
}

export function getInitialHitPoints(
    characterClass: CharacterClass,
    constitution: number
): number {
    const constitutionModifier =
        getAbilityModifier(constitution);

    return Math.max(
        1,
        characterClass.hitDie + constitutionModifier
    );
}

export function getInitiative(
    dexterity: number
): number {
    return getAbilityModifier(dexterity);
}

export function getBaseArmorClass(
    dexterity: number,
    wisdom: number,
    characterClass?: CharacterClass
): number {
    const dexterityModifier =
        getAbilityModifier(dexterity);

    if (characterClass?.id === "monk") {
        const wisdomModifier =
            getAbilityModifier(wisdom);

        return (
            10 +
            dexterityModifier +
            wisdomModifier
        );
    }

    return 10 + dexterityModifier;
}

export function getSavingThrowModifier(
    ability: Ability,
    value: number,
    savingThrowProficiencies: Ability[],
    proficiencyBonus: number
): number {
    const modifier =
        getAbilityModifier(value);

    const proficient =
        savingThrowProficiencies.includes(ability);

    return (
        modifier +
        (proficient
            ? proficiencyBonus
            : 0)
    );
}

export function getPassivePerception(
    wisdom: number,
    proficient: boolean,
    proficiencyBonus: number
): number {
    const wisdomModifier =
        getAbilityModifier(wisdom);

    return (
        10 +
        wisdomModifier +
        (proficient
            ? proficiencyBonus
            : 0)
    );
}

export function getCarryingCapacity(
    strength: number
): number {
    return strength * 15;
}