import type {
    Ability,
    CharacterFormData,
    CharacterRace,
    CharacterSubrace,
    RaceTrait,
    Skill,
} from "../../types/character";
import { DND_RACES } from "./races";

export function getRaceById(raceId: string): CharacterRace | undefined {
    return DND_RACES.find((race) => race.id === raceId);
}

export function getSubrace(
    race: CharacterRace | undefined,
    subraceId: string
): CharacterSubrace | undefined {
    if (!race?.subraces?.length || !subraceId) return undefined;
    return race.subraces.find((subrace) => subrace.id === subraceId);
}

export function getSelectedSubrace(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): CharacterSubrace | undefined {
    return getSubrace(getRaceById(data.raceId), data.subraceId);
}

function mergeAbilityIncreases(
    ...sources: Array<Partial<Record<Ability, number>> | undefined>
): Partial<Record<Ability, number>> {
    const merged: Partial<Record<Ability, number>> = {};

    for (const source of sources) {
        if (!source) continue;
        for (const [ability, bonus] of Object.entries(source)) {
            if (!bonus) continue;
            const key = ability as Ability;
            merged[key] = (merged[key] ?? 0) + bonus;
        }
    }

    return merged;
}

/** Bônus raciais fixos (raça base + subraça). */
export function getResolvedAbilityScoreIncrease(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): Partial<Record<Ability, number>> {
    const race = getRaceById(data.raceId);
    const subrace = getSubrace(race, data.subraceId);
    return mergeAbilityIncreases(
        race?.abilityScoreIncrease,
        subrace?.abilityScoreIncrease
    );
}

/** Escolhas de atributo: preferência da subraça, senão da raça. */
export function getResolvedAbilityScoreChoices(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): CharacterRace["abilityScoreChoices"] | undefined {
    const race = getRaceById(data.raceId);
    const subrace = getSubrace(race, data.subraceId);
    return subrace?.abilityScoreChoices ?? race?.abilityScoreChoices;
}

export function getResolvedRaceTraits(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): RaceTrait[] {
    const race = getRaceById(data.raceId);
    const subrace = getSubrace(race, data.subraceId);
    return [...(race?.traits ?? []), ...(subrace?.traits ?? [])];
}

export function getResolvedSkillProficiencies(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): Skill[] {
    const race = getRaceById(data.raceId);
    const subrace = getSubrace(race, data.subraceId);
    return [
        ...(race?.skillProficiencies ?? []),
        ...(subrace?.skillProficiencies ?? []),
    ];
}

export function getResolvedSkillChoices(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): CharacterRace["skillChoices"] | undefined {
    const race = getRaceById(data.raceId);
    const subrace = getSubrace(race, data.subraceId);
    return subrace?.skillChoices ?? race?.skillChoices;
}

export function getRaceDisplayName(
    data: Pick<CharacterFormData, "raceId" | "subraceId">
): string {
    const race = getRaceById(data.raceId);
    if (!race) return "";
    const subrace = getSubrace(race, data.subraceId);
    return subrace ? `${race.name} (${subrace.name})` : race.name;
}
