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

export function getArmorClassFromEquipment(
    dexterity: number,
    wisdom: number,
    characterClass: CharacterClass | undefined,
    itemIds: string[]
): number {
    const dexterityModifier = getAbilityModifier(dexterity);
    const hasShield =
        itemIds.includes("shield") ||
        itemIds.includes("wooden-shield");
    let armorClass: number;

    if (itemIds.includes("chain-mail")) {
        armorClass = 16;
    } else if (itemIds.includes("scale-mail")) {
        armorClass = 14 + Math.min(2, dexterityModifier);
    } else if (itemIds.includes("leather-armor")) {
        armorClass = 11 + dexterityModifier;
    } else {
        armorClass = getBaseArmorClass(
            dexterity,
            wisdom,
            characterClass
        );
    }

    return armorClass + (hasShield ? 2 : 0);
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
    return (
        10 +
        getAbilityModifier(wisdom) +
        (proficient ? proficiencyBonus : 0)
    );
}

export function getCarryingCapacity(
    strength: number
): number {
    return strength * 15;
}