import type {
    Ability,
    CharacterClassSelection,
    CharacterFormData,
    Skill,
} from "../../types/character";
import {
    getBattleManeuver,
    MARTIAL_ADEPT_MANEUVERS_KEY,
} from "./battleMasterManeuvers";
import { DND_SKILLS } from "./skills";
import { DND_TALENTS } from "./talents";

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

export function getValidAsiKeys(classes: CharacterClassSelection[]): Set<string> {
    return new Set(getAsiMilestones(classes).map((milestone) => milestone.key));
}

export function hasSelectedFeat(
    data: CharacterFormData,
    featId: string
): boolean {
    if (data.talentId === featId) return true;
    const validKeys = getValidAsiKeys(data.classes);
    return Object.entries(data.asiSelections).some(
        ([key, selection]) =>
            validKeys.has(key) &&
            selection.kind === "feat" &&
            selection.featId === featId
    );
}

function normalizeChoiceMap(
    source: Record<string, string | string[]> | undefined
): Record<string, string[]> {
    if (!source) return {};
    return Object.fromEntries(
        Object.entries(source).map(([key, value]) => [
            key,
            Array.isArray(value) ? value : value ? [value] : [],
        ])
    );
}

function choiceValues(
    source: Record<string, string[]> | undefined,
    choiceId: string
): string[] {
    return (source?.[choiceId] ?? []).filter(Boolean);
}

const LANGUAGE_NAMES: Record<string, string> = {
    common: "Comum",
    dwarvish: "Anão",
    elvish: "Élfico",
    giant: "Gigante",
    gnomish: "Gnômico",
    goblin: "Goblin",
    halfling: "Halfling",
    orc: "Orc",
    abyssal: "Abissal",
    celestial: "Celestial",
    draconic: "Dracônico",
    infernal: "Infernal",
    primordial: "Primordial",
    sylvan: "Silvestre",
    undercommon: "Subcomum",
};

function readChoiceList(raw: string | string[] | undefined): string[] {
    if (!raw) return [];
    return (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
}

export function getAllKnownLanguageIds(data: CharacterFormData): string[] {
    return [
        ...new Set([
            ...readChoiceList(data.talentChoices?.languages),
            ...(data.backgroundChoices?.languages ?? []),
            ...getAsiFeatLanguages(data),
        ]),
    ];
}

export function getAsiFeatLanguages(data: CharacterFormData): string[] {
    const validKeys = getValidAsiKeys(data.classes);
    const languages: string[] = [];

    for (const [key, selection] of Object.entries(data.asiSelections)) {
        if (
            !validKeys.has(key) ||
            selection.kind !== "feat" ||
            selection.featId !== "linguist"
        ) {
            continue;
        }
        languages.push(...(selection.featChoices.languages ?? []));
    }

    return [...new Set(languages.filter(Boolean))];
}

export function getMartialAdeptManeuverIds(data: CharacterFormData): string[] {
    if (data.talentId === "martial-adept") {
        const fromFeature = choiceValues(
            data.featureChoices,
            MARTIAL_ADEPT_MANEUVERS_KEY
        );
        if (fromFeature.length > 0) return fromFeature;
        return choiceValues(
            normalizeChoiceMap(data.talentChoices),
            MARTIAL_ADEPT_MANEUVERS_KEY
        );
    }

    const validKeys = getValidAsiKeys(data.classes);
    for (const [key, selection] of Object.entries(data.asiSelections)) {
        if (
            !validKeys.has(key) ||
            selection.kind !== "feat" ||
            selection.featId !== "martial-adept"
        ) {
            continue;
        }
        const picked = choiceValues(
            selection.featChoices,
            MARTIAL_ADEPT_MANEUVERS_KEY
        );
        if (picked.length > 0) return picked;
    }

    return choiceValues(data.featureChoices, MARTIAL_ADEPT_MANEUVERS_KEY);
}

export function formatAsiFeatChoiceLines(
    featId: string,
    featChoices: Record<string, string[]>
): string[] {
    const feat = DND_TALENTS.find((entry) => entry.id === featId);
    if (!feat?.choices?.length) return [];

    const lines: string[] = [];
    for (const choice of feat.choices) {
        const values = featChoices[choice.id] ?? [];
        if (values.length === 0) continue;

        if (choice.type === "skill") {
            const names = values
                .map(
                    (id) =>
                        DND_SKILLS.find((skill) => skill.id === id)?.name ?? id
                )
                .join(", ");
            lines.push(`${choice.name}: ${names}`);
            continue;
        }

        if (choice.type === "language") {
            const names = values
                .map((id) => LANGUAGE_NAMES[id] ?? id)
                .join(", ");
            lines.push(`${choice.name}: ${names}`);
            continue;
        }

        if (choice.type === "maneuver") {
            const names = values
                .map((id) => getBattleManeuver(id)?.name ?? id)
                .join(", ");
            lines.push(`${choice.name}: ${names}`);
            continue;
        }

        if (choice.type === "ability") {
            lines.push(`${choice.name}: ${values.join(", ")}`);
        }
    }

    if (featId === "martial-adept") {
        const maneuvers = choiceValues(featChoices, MARTIAL_ADEPT_MANEUVERS_KEY);
        if (maneuvers.length > 0 && !lines.some((line) => line.startsWith("Manobras:"))) {
            const names = maneuvers
                .map((id) => getBattleManeuver(id)?.name ?? id)
                .join(", ");
            lines.push(`Manobras: ${names}`);
        }
    }

    return lines;
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
