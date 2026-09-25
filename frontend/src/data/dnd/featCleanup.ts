import type { AsiSelection, CharacterFormData } from "../../types/character";
import { MARTIAL_ADEPT_MANEUVERS_KEY } from "./battleMasterManeuvers";
import { hasSelectedFeat } from "./classFeatures";
import { syncSkillProficiencyFlags } from "./skills";

function clearAsiMilestoneSpellBenefits(
    data: CharacterFormData,
    milestoneKey: string
): CharacterFormData {
    if (!data.spells.byFeat[milestoneKey]) {
        return data;
    }

    const byFeat = { ...data.spells.byFeat };
    delete byFeat[milestoneKey];

    return {
        ...data,
        spells: {
            ...data.spells,
            byFeat,
        },
    };
}

function stripOrphanMartialAdeptManeuvers(
    data: CharacterFormData
): CharacterFormData {
    if (hasSelectedFeat(data, "martial-adept")) {
        return data;
    }

    if (!data.featureChoices[MARTIAL_ADEPT_MANEUVERS_KEY]) {
        return data;
    }

    const featureChoices = { ...data.featureChoices };
    delete featureChoices[MARTIAL_ADEPT_MANEUVERS_KEY];
    return { ...data, featureChoices };
}

function asiSelectionBenefitsChanged(
    previous: AsiSelection | undefined,
    next: AsiSelection
): boolean {
    if (!previous) {
        return next.kind === "feat" && Boolean(next.featId);
    }

    if (previous.kind !== next.kind) {
        return true;
    }

    if (previous.kind === "feat" && next.kind === "feat") {
        return previous.featId !== next.featId;
    }

    return false;
}

/** Troca do talento inicial — remove escolhas, perícias e magias do talento anterior. */
export function applyInitialTalentChange(
    data: CharacterFormData,
    talentId: string
): CharacterFormData {
    if (talentId === data.talentId) {
        return data;
    }

    let next: CharacterFormData = {
        ...data,
        talentId,
        talentChoices: {},
        skillProficiencies: {
            class: data.skillProficiencies?.class ?? [],
            race: data.skillProficiencies?.race ?? [],
            background: data.skillProficiencies?.background ?? [],
            talent: [],
        },
        spells: {
            ...data.spells,
            talent: { cantrips: [], spells: [] },
        },
    };

    next = stripOrphanMartialAdeptManeuvers(next);
    return syncSkillProficiencyFlags(next);
}

/** Atualiza uma melhoria por nível e remove benefícios do talento anterior desse marco. */
export function applyAsiSelectionUpdate(
    data: CharacterFormData,
    milestoneKey: string,
    selection: AsiSelection
): CharacterFormData {
    const previous = data.asiSelections[milestoneKey];

    let next = { ...data };

    if (asiSelectionBenefitsChanged(previous, selection)) {
        next = clearAsiMilestoneSpellBenefits(next, milestoneKey);
    }

    next = {
        ...next,
        asiSelections: {
            ...next.asiSelections,
            [milestoneKey]: selection,
        },
    };

    next = stripOrphanMartialAdeptManeuvers(next);
    return syncSkillProficiencyFlags(next);
}
