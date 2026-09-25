import type {
    CharacterFormData,
    CharacterTalent,
} from "../../types/character";
import { DND_BACKGROUNDS } from "./backgrounds";
import { getAsiMilestones } from "./classFeatures";
import { DND_CLASSES } from "./classes";
import { DND_RACES } from "./races";
import { getFinalAbilities } from "./characterStats";
import { getResolvedAbilityScoreChoices, getResolvedSkillChoices, getResolvedSkillProficiencies } from "./raceResolution";
import { getSpell } from "./spells";
import {
    emptyClassSelection,
    getAlwaysPreparedSpells,
    getSpellLimits,
    getSpellcastingAbility,
    getTalentSpellClass,
    getTalentSpellOptions,
} from "./spellcasting";
import { DND_TALENTS } from "./talents";
import {
    getFourElementsDisciplineLimit,
    getSelectedElementalDisciplines,
} from "./elementalDisciplines";
import { getPactBoon } from "./eldritchInvocations";
import { getClassFeatureChoiceIssues } from "./classFeatureChoices";
import { getAllWarlockChoicesIssues, getWarlockPactExtrasIssues } from "./warlockPact";

function filled(value: string | null | undefined): boolean {
    return Boolean(value?.trim());
}

function filledUnique(values: string[], count: number): boolean {
    const chosen = values.slice(0, count).filter((value) => filled(value));
    return chosen.length === count && new Set(chosen).size === count;
}

function choiceValues(
    source: Record<string, string | string[]> | undefined,
    choiceId: string
): string[] {
    const raw = source?.[choiceId];
    if (Array.isArray(raw)) {
        return raw.filter((value) => filled(value));
    }
    return filled(raw) ? [raw] : [];
}

function talentChoicesComplete(
    talent: CharacterTalent | undefined,
    values: Record<string, string | string[]> | undefined
): boolean {
    if (!talent) {
        return false;
    }

    return (talent.choices ?? []).every(
        (choice) => choiceValues(values, choice.id).length === choice.count
    );
}

function talentSpellLimits(featId: string): { cantrips: number; spells: number } {
    if (featId === "spell-sniper") {
        return { cantrips: 1, spells: 0 };
    }

    if (featId === "ritual-caster") {
        return { cantrips: 0, spells: 2 };
    }

    if (featId === "magic-initiate") {
        return { cantrips: 2, spells: 1 };
    }

    return { cantrips: 0, spells: 0 };
}

export function getStepIssues(step: number, data: CharacterFormData): string[] {
    switch (step) {
        case 1:
            return identityIssues(data);
        case 2:
            return abilityIssues(data);
        case 3:
            return skillIssues(data);
        case 4:
            return combatIssues(data);
        case 5:
            return equipmentIssues(data);
        case 6:
            return spellIssues(data);
        case 7:
            return loreIssues(data);
        default:
            return [];
    }
}

export function canEnterStep(step: number, data: CharacterFormData): boolean {
    for (let previous = 1; previous < step; previous += 1) {
        if (getStepIssues(previous, data).length > 0) {
            return false;
        }
    }

    return true;
}

function identityIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];

    if (!filled(data.name)) issues.push("Informe o nome do personagem.");
    if (!filled(data.raceId)) issues.push("Selecione uma raça.");
    const race = DND_RACES.find((item) => item.id === data.raceId);
    if (race?.subraces?.length && !filled(data.subraceId)) {
        issues.push("Selecione uma subraça.");
    }
    if (!filled(data.backgroundId)) issues.push("Selecione um antecedente.");
    if (!filled(data.alignment)) issues.push("Selecione um alinhamento.");

    if (getResolvedAbilityScoreChoices(data)) {
        const choices = data.raceChoices.abilityScoreIncrease ?? [];
        const abilityScoreChoices = getResolvedAbilityScoreChoices(data)!;
        if (!filledUnique(choices, abilityScoreChoices.count)) {
            issues.push("Complete as escolhas raciais de atributo.");
        }
    }

    const background = DND_BACKGROUNDS.find((item) => item.id === data.backgroundId);
    if (background?.toolChoice && !filledUnique(data.backgroundChoices.tools, background.toolChoice.count)) {
        issues.push("Escolha as ferramentas do antecedente.");
    }
    if (
        background?.languageChoices &&
        !filledUnique(data.backgroundChoices.languages, background.languageChoices)
    ) {
        issues.push("Escolha os idiomas do antecedente.");
    }

    if (data.classes.length === 0) {
        issues.push("Adicione pelo menos uma classe.");
    }

    data.classes.forEach((selection, index) => {
        const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
        if (!characterClass) {
            issues.push(`Selecione a classe ${index + 1}.`);
            return;
        }

        const needsSubclass = characterClass.subclasses.some(
            (subclass) => selection.level >= subclass.level
        );
        if (needsSubclass && !filled(selection.subclassId)) {
            issues.push(`Selecione a subclasse de ${characterClass.name}.`);
        }
    });

    if (!filled(data.talentId)) {
        issues.push("Selecione o talento inicial.");
    } else {
        const talent = DND_TALENTS.find((item) => item.id === data.talentId);
        if (!talentChoicesComplete(talent, data.talentChoices)) {
            issues.push("Complete as escolhas do talento inicial.");
        }
    }

    return issues;
}

function abilityIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];
    const talent = DND_TALENTS.find((item) => item.id === data.talentId);
    const talentChoices = talent?.abilityScoreIncrease?.choices ?? [];

    if (talentChoices.length > 1) {
        const selected =
            data.talentChoices.abilityScoreIncrease ?? data.talentChoices.ability;
        const value = Array.isArray(selected) ? selected[0] : selected;
        if (!filled(value)) {
            issues.push("Escolha o atributo aumentado pelo talento.");
        }
    }

    getAsiMilestones(data.classes).forEach((milestone, index) => {
        const selection = data.asiSelections[milestone.key];
        if (!selection) {
            issues.push(`Defina a melhoria de habilidade ${index + 1}.`);
            return;
        }

        if (selection.kind === "ability") {
            const needed = selection.mode === "single" ? 1 : 2;
            if (!filledUnique(selection.abilities, needed)) {
                issues.push(`Escolha os atributos da melhoria ${index + 1}.`);
            }
            return;
        }

        if (!filled(selection.featId)) {
            issues.push(`Selecione o talento da melhoria ${index + 1}.`);
            return;
        }

        const feat = DND_TALENTS.find((item) => item.id === selection.featId);
        if (!talentChoicesComplete(feat, selection.featChoices)) {
            issues.push(`Complete as escolhas do talento da melhoria ${index + 1}.`);
        }
    });

    return issues;
}

function skillIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];
    const primary = data.classes[0];
    const characterClass = primary
        ? DND_CLASSES.find((item) => item.id === primary.classId)
        : undefined;

    const classLimit = characterClass?.skillProficiencies.choose ?? 0;
    if ((data.skillProficiencies.class ?? []).length < classLimit) {
        issues.push(`Escolha ${classLimit} perícias da classe.`);
    }

    const raceLimit = getResolvedSkillChoices(data)?.count ?? 0;
    if ((data.skillProficiencies.race ?? []).length < raceLimit) {
        issues.push(`Escolha ${raceLimit} perícias da raça.`);
    }

    const background = DND_BACKGROUNDS.find((item) => item.id === data.backgroundId);
    const baseBackgroundSkills = background?.skillProficiencies ?? [];
    const overlapping = baseBackgroundSkills.filter((skill) =>
        [
            ...getResolvedSkillProficiencies(data),
            ...(data.skillProficiencies.class ?? []),
            ...(data.skillProficiencies.race ?? []),
            ...(data.skillProficiencies.talent ?? []),
        ].includes(skill)
    ).length;

    if ((data.backgroundChoices.skills ?? []).filter(filled).length < overlapping) {
        issues.push("Escolha as perícias substitutas do antecedente.");
    }

    return issues;
}

function combatIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];

    data.classes.forEach((selection) => {
        if (
            selection.classId !== "monk" ||
            selection.subclassId !== "way-of-four-elements" ||
            selection.level < 3
        ) {
            return;
        }

        const limit = getFourElementsDisciplineLimit(selection.level);
        const selected = getSelectedElementalDisciplines(data.featureChoices);

        if (selected.length < limit) {
            issues.push(
                `Escolha ${limit} disciplina${limit === 1 ? "" : "s"} do Discípulo dos Elementos.`
            );
        }
    });

    data.classes.forEach((selection) => {
        if (selection.classId !== "warlock") {
            return;
        }
        if (selection.level >= 3 && !getPactBoon(data.featureChoices)) {
            issues.push("Escolha a Dádiva de Pacto do bruxo.");
        }
        issues.push(...getWarlockPactExtrasIssues(data, selection.level));
    });

    issues.push(...getClassFeatureChoiceIssues(data));

    return issues;
}

function equipmentIssues(data: CharacterFormData): string[] {
    const characterClass = DND_CLASSES.find(
        (item) => item.id === data.classes[0]?.classId
    );
    const choices = characterClass?.startingEquipment?.choices ?? [];
    const incomplete = choices.some(
        (choice) => !filled(data.equipment.choiceSelections[choice.id])
    );

    return incomplete ? ["Complete as escolhas de equipamento da classe."] : [];
}

function spellIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];
    const abilities = getFinalAbilities(data);

    data.classes.forEach((selection) => {
        const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
        const limits = abilityId
            ? getSpellLimits(
                selection.classId,
                selection.level,
                selection.subclassId,
                abilities[abilityId]
            )
            : undefined;

        if (!limits || limits.kind === "none") {
            return;
        }

        if (limits.cantrips === 0 && limits.maxSpellLevel === 0 && !limits.pact) {
            return;
        }

        const selected = data.spells.byClass[selection.classId] ?? emptyClassSelection();
        const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
        const name = characterClass?.name ?? selection.classId;
        const alwaysPrepared = getAlwaysPreparedSpells(
            selection.subclassId,
            selection.level,
            { featureChoices: data.featureChoices }
        );

        if (selected.cantrips.length < limits.cantrips) {
            issues.push(`Escolha os truques de ${name}.`);
        }

        if (limits.known !== null && limits.known > 0) {
            const regularKnown = selected.known.filter(
                (id) => !limits.arcanumLevels.includes(getSpell(id)?.level ?? 0)
            ).length;

            if (regularKnown < limits.known) {
                issues.push(
                    limits.spellbook
                        ? `Grave as magias no grimório de ${name}.`
                        : `Escolha as magias conhecidas de ${name}.`
                );
            }
        }

        if (limits.prepared !== null && limits.prepared > 0) {
            const prepared = selected.prepared.filter(
                (id) => !alwaysPrepared.includes(id)
            ).length;

            if (prepared < limits.prepared) {
                issues.push(`Prepare as magias de ${name}.`);
            }
        }

        if (limits.kind === "pact") {
            limits.arcanumLevels.forEach((level) => {
                const hasArcanum = selected.known.some((id) => getSpell(id)?.level === level);
                if (!hasArcanum) {
                    issues.push(`Escolha o Arcano Místico de ${level}º círculo.`);
                }
            });
        }

        if (selection.classId === "warlock" && selection.level >= 2) {
            issues.push(...getAllWarlockChoicesIssues(data, selection.level));
        }
    });

    const talentLimits = talentSpellLimits(data.talentId);
    if (talentLimits.cantrips > 0 || talentLimits.spells > 0) {
        const listClass = getTalentSpellClass(data.talentId, data.talentChoices);
        const options = getTalentSpellOptions(data.talentId, listClass);
        if (options.cantrips.length > 0 && data.spells.talent.cantrips.length < talentLimits.cantrips) {
            issues.push("Escolha os truques do talento.");
        }
        if (options.spells.length > 0 && data.spells.talent.spells.length < talentLimits.spells) {
            issues.push("Escolha as magias do talento.");
        }
    }

    getAsiMilestones(data.classes).forEach((milestone) => {
        const selection = data.asiSelections[milestone.key];
        if (selection?.kind !== "feat") {
            return;
        }

        const limits = talentSpellLimits(selection.featId);
        if (limits.cantrips === 0 && limits.spells === 0) {
            return;
        }

        const listClass = getTalentSpellClass(selection.featId, selection.featChoices);
        const options = getTalentSpellOptions(selection.featId, listClass);
        const selected = data.spells.byFeat[milestone.key] ?? { cantrips: [], spells: [] };

        if (options.cantrips.length > 0 && selected.cantrips.length < limits.cantrips) {
            issues.push("Escolha os truques do talento de melhoria.");
        }
        if (options.spells.length > 0 && selected.spells.length < limits.spells) {
            issues.push("Escolha as magias do talento de melhoria.");
        }
    });

    return issues;
}

function loreIssues(data: CharacterFormData): string[] {
    const issues: string[] = [];

    if (data.hitPoints === null || data.hitPoints < 1) {
        issues.push("Informe os pontos de vida.");
    }
    if (!filled(data.loreDetails.appearance)) issues.push("Descreva a aparência.");
    if (!filled(data.loreDetails.personalityTraits)) {
        issues.push("Descreva os traços de personalidade.");
    }
    if (!filled(data.loreDetails.ideals)) issues.push("Descreva os ideais.");
    if (!filled(data.loreDetails.bonds)) issues.push("Descreva os vínculos.");
    if (!filled(data.loreDetails.flaws)) issues.push("Descreva as fraquezas.");
    if (!filled(data.lore)) issues.push("Escreva a história do personagem.");
    if (!filled(data.quests)) issues.push("Registre pelo menos uma missão.");

    return issues;
}
