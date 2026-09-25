import { ABILITIES, getAbilityModifier } from "../data/dnd/abilities";
import { getAsiMilestones, getAsiFeatSkills } from "../data/dnd/classFeatures";
import { getFinalAbilities } from "../data/dnd/characterStats";
import { DND_CLASSES } from "../data/dnd/classes";
import { getClassFeatureBonusSkills } from "../data/dnd/classFeatureChoices";
import { getProficiencyBonus } from "../data/dnd/rules";
import {
    DND_SKILLS,
    getProficientSkills,
    getSkillExtraBonus,
} from "../data/dnd/skills";
import { getResolvedSkillProficiencies } from "../data/dnd/raceResolution";
import {
    getRaceById,
    getSelectedSubrace,
    getResolvedAbilityScoreChoices,
} from "../data/dnd/raceResolution";
import { DND_TALENTS } from "../data/dnd/talents";
import type {
    Ability,
    AsiSelection,
    CharacterFormData,
    Skill,
} from "../types/character";
import {
    applyAbilityEquipmentBonus,
    resolveSlotItemBonus,
    sumEquipmentBonuses,
    getEquippedSlotRefs,
} from "./equipmentBonuses";
import { resolveSlotEntry } from "./equipmentSlots";
import {
    customItemHasStructuredArmor,
    getEquippedArmorStealthDisadvantage,
    resolveEquippedArmorState,
} from "./equippedArmor";

export type StatBreakdownLine =
    | { kind: "base"; label: string; value: number }
    | { kind: "delta"; label: string; delta: number }
    | { kind: "note"; label: string };

function formatSigned(delta: number): string {
    return delta >= 0 ? `+${delta}` : `${delta}`;
}

export function formatBreakdownLine(line: StatBreakdownLine): string {
    if (line.kind === "base") {
        return `${line.label}: ${line.value}`;
    }
    if (line.kind === "note") {
        return line.label;
    }
    return `${line.label}: ${formatSigned(line.delta)}`;
}

export function sumStatBreakdownLines(lines: StatBreakdownLine[]): number {
    let total = 0;
    for (const line of lines) {
        if (line.kind === "base") total += line.value;
        else if (line.kind === "delta") total += line.delta;
    }
    return total;
}

function addFeatBonusLines(
    ability: Ability,
    lines: StatBreakdownLine[],
    talentId: string | undefined,
    choices: Record<string, string | string[]>
) {
    const talent = DND_TALENTS.find((entry) => entry.id === talentId);
    const increase = talent?.abilityScoreIncrease;
    if (!increase) return;

    const allowed = increase.choices ?? [];
    const rawChoice =
        choices.abilityScoreIncrease ?? choices.ability;
    const selected = Array.isArray(rawChoice) ? rawChoice[0] : rawChoice;
    const picked =
        selected && isAbility(selected)
            ? selected
            : allowed.length === 1
              ? allowed[0]
              : undefined;

    if (
        picked === ability &&
        (allowed.length === 0 || allowed.includes(picked))
    ) {
        lines.push({
            kind: "delta",
            label: talent?.name ? `Talento ${talent.name}` : "Talento",
            delta: increase.amount,
        });
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

function addAsiLines(
    selection: Extract<AsiSelection, { kind: "ability" }>,
    ability: Ability,
    label: string,
    lines: StatBreakdownLine[]
) {
    if (selection.mode === "single") {
        const picked = selection.abilities[0];
        if (picked === ability) {
            lines.push({ kind: "delta", label, delta: 2 });
        }
        return;
    }
    if (selection.abilities.includes(ability)) {
        lines.push({ kind: "delta", label, delta: 1 });
    }
}

export function getAbilityStatBreakdown(
    data: CharacterFormData,
    ability: Ability
): StatBreakdownLine[] {
    const lines: StatBreakdownLine[] = [];
    lines.push({
        kind: "base",
        label: "Valor base (ficha)",
        value: data.abilities[ability],
    });

    const race = getRaceById(data.raceId);
    const subrace = getSelectedSubrace(data);
    const raceBonus = race?.abilityScoreIncrease?.[ability];
    if (raceBonus) {
        lines.push({
            kind: "delta",
            label: `Raça ${race.name}`,
            delta: raceBonus,
        });
    }
    const subraceBonus = subrace?.abilityScoreIncrease?.[ability];
    if (subraceBonus) {
        lines.push({
            kind: "delta",
            label: subrace.name,
            delta: subraceBonus,
        });
    }

    const scoreChoices = getResolvedAbilityScoreChoices(data);
    const pickedAbilities = data.raceChoices?.abilityScoreIncrease ?? [];
    if (
        scoreChoices &&
        pickedAbilities.includes(ability) &&
        scoreChoices.abilities.includes(ability)
    ) {
        lines.push({
            kind: "delta",
            label: `${race?.name ?? "Raça"} (escolha de atributo)`,
            delta: scoreChoices.amount,
        });
    }

    addFeatBonusLines(ability, lines, data.talentId, data.talentChoices ?? {});

    const validAsiKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );
    for (const milestone of getAsiMilestones(data.classes)) {
        const selection = data.asiSelections[milestone.key];
        if (!selection || !validAsiKeys.has(milestone.key)) continue;
        if (selection.kind === "ability") {
            const className =
                DND_CLASSES.find((c) => c.id === milestone.classId)?.name ??
                milestone.classId;
            addAsiLines(
                selection,
                ability,
                `Melhoria de atributo (${className} ${milestone.classLevel})`,
                lines
            );
        } else {
            addFeatBonusLines(
                ability,
                lines,
                selection.featId,
                selection.featChoices ?? {}
            );
        }
    }

    for (const ref of getEquippedSlotRefs(data)) {
        const bonus = resolveSlotItemBonus(data, ref);
        if (!bonus || bonus.stat !== ability) continue;
        const entry = resolveSlotEntry(data, ref);
        lines.push({
            kind: "delta",
            label: entry?.name ? `Item ${entry.name}` : "Item equipado",
            delta: bonus.value,
        });
    }

    return lines;
}

export function getEffectiveAbilities(data: CharacterFormData) {
    const base = getFinalAbilities(data);
    const equipmentBonuses = sumEquipmentBonuses(data);
    return {
        strength: applyAbilityEquipmentBonus(
            base.strength,
            "strength",
            equipmentBonuses
        ),
        dexterity: applyAbilityEquipmentBonus(
            base.dexterity,
            "dexterity",
            equipmentBonuses
        ),
        constitution: applyAbilityEquipmentBonus(
            base.constitution,
            "constitution",
            equipmentBonuses
        ),
        intelligence: applyAbilityEquipmentBonus(
            base.intelligence,
            "intelligence",
            equipmentBonuses
        ),
        wisdom: applyAbilityEquipmentBonus(
            base.wisdom,
            "wisdom",
            equipmentBonuses
        ),
        charisma: applyAbilityEquipmentBonus(
            base.charisma,
            "charisma",
            equipmentBonuses
        ),
        equipmentBonuses,
    };
}

export function getArmorClassBreakdown(
    data: CharacterFormData
): StatBreakdownLine[] {
    const lines: StatBreakdownLine[] = [];
    const primaryClass = data.classes[0]
        ? DND_CLASSES.find((item) => item.id === data.classes[0].classId)
        : undefined;
    const { dexterity, wisdom, constitution } = getEffectiveAbilities(data);

    const dexMod = getAbilityModifier(dexterity);
    const wisMod = getAbilityModifier(wisdom);
    const conMod = getAbilityModifier(constitution);

    const { body, shield, monkShieldBlocksUnarmored } =
        resolveEquippedArmorState(data, primaryClass, dexMod);

    if (body) {
        lines.push({
            kind: "base",
            label: `${body.label} (base ${body.def.baseAc})`,
            value: body.def.baseAc,
        });
        if (body.dexPart !== 0) {
            lines.push({
                kind: "delta",
                label:
                    body.def.dexMode === "max2"
                        ? "Modificador de Destreza (máx. +2)"
                        : "Modificador de Destreza",
                delta: body.dexPart,
            });
        }
        if (body.magicBonus > 0) {
            lines.push({
                kind: "delta",
                label: `Bônus mágico (+${body.magicBonus})`,
                delta: body.magicBonus,
            });
        }
    } else if (monkShieldBlocksUnarmored) {
        lines.push({ kind: "base", label: "Sem armadura (escudo anula monge)", value: 10 });
        if (dexMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Destreza",
                delta: dexMod,
            });
        }
    } else if (primaryClass?.id === "monk") {
        lines.push({ kind: "base", label: "Defesa sem armadura (monge)", value: 10 });
        if (dexMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Destreza",
                delta: dexMod,
            });
        }
        if (wisMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Sabedoria",
                delta: wisMod,
            });
        }
    } else if (primaryClass?.id === "barbarian") {
        lines.push({ kind: "base", label: "Defesa sem armadura (bárbaro)", value: 10 });
        if (dexMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Destreza",
                delta: dexMod,
            });
        }
        if (conMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Constituição",
                delta: conMod,
            });
        }
    } else {
        lines.push({ kind: "base", label: "Sem armadura (10 + DES)", value: 10 });
        if (dexMod !== 0) {
            lines.push({
                kind: "delta",
                label: "Modificador de Destreza",
                delta: dexMod,
            });
        }
    }

    if (shield) {
        lines.push({ kind: "delta", label: "Escudo (base +2)", delta: 2 });
        if (shield.magicBonus > 0) {
            lines.push({
                kind: "delta",
                label: `Bônus mágico do escudo (+${shield.magicBonus})`,
                delta: shield.magicBonus,
            });
        }
    }

    for (const ref of getEquippedSlotRefs(data)) {
        const bonus = resolveSlotItemBonus(data, ref);
        if (!bonus || bonus.stat !== "ac") continue;
        if (ref.kind === "custom") {
            const custom = (data.equipment.customItems ?? []).find(
                (entry) => entry.id === ref.customItemId
            );
            if (customItemHasStructuredArmor(custom)) continue;
        }
        const entry = resolveSlotEntry(data, ref);
        lines.push({
            kind: "delta",
            label: entry?.name ? `Item ${entry.name}` : "Item equipado",
            delta: bonus.value,
        });
    }

    return lines;
}

export function getSkillProficiencySourceLabels(
    data: CharacterFormData,
    skillId: Skill
): string[] {
    const sources: string[] = [];

    const add = (label: string) => {
        if (!sources.includes(label)) sources.push(label);
    };

    if (getResolvedSkillProficiencies(data).includes(skillId)) {
        add("Raça");
    }
    if (data.skillProficiencies?.race?.includes(skillId)) {
        add("Raça");
    }
    if (data.skillProficiencies?.class?.includes(skillId)) {
        add("Classe");
    }
    if (data.skillProficiencies?.background?.includes(skillId)) {
        add("Antecedente");
    }
    if (data.skillProficiencies?.talent?.includes(skillId)) {
        add("Talento inicial");
    }
    if (getAsiFeatSkills(data).includes(skillId)) {
        add("Talento (Habilidoso)");
    }
    if (getClassFeatureBonusSkills(data).includes(skillId)) {
        add("Classe (característica)");
    }

    const monkeyPath = data.classes.some(
        (selection) =>
            selection.classId === "monk" &&
            selection.subclassId === "way-of-the-monkey" &&
            selection.level >= 3
    );
    if (monkeyPath && skillId === "deception") {
        add("Caminho do Macaco");
    }

    return sources;
}

export function getSkillStatBreakdown(
    data: CharacterFormData,
    skillId: Skill
): StatBreakdownLine[] {
    const skillDef = DND_SKILLS.find((entry) => entry.id === skillId);
    if (!skillDef) return [];

    const abilities = getEffectiveAbilities(data);
    const abilityMeta = ABILITIES.find((entry) => entry.id === skillDef.ability);
    const abilityMod = getAbilityModifier(abilities[skillDef.ability]);

    const lines: StatBreakdownLine[] = [
        {
            kind: "delta",
            label: abilityMeta?.name ?? skillDef.ability,
            delta: abilityMod,
        },
    ];

    const totalLevel =
        data.classes.reduce((total, selection) => total + selection.level, 0) ||
        1;
    const proficiencyBonus = getProficiencyBonus(totalLevel);
    const proficient = getProficientSkills(data).has(skillId);
    const expertise = Boolean(data.skills?.[skillId]?.expertise);

    if (proficient && proficiencyBonus !== 0) {
        const sources = getSkillProficiencySourceLabels(data, skillId);
        lines.push({
            kind: "delta",
            label: sources.length
                ? `Proficiência (${sources.join(", ")})`
                : "Proficiência",
            delta: proficiencyBonus,
        });
    }

    if (expertise && proficiencyBonus !== 0) {
        lines.push({
            kind: "delta",
            label: "Expertise",
            delta: proficiencyBonus,
        });
    }

    const extra = getSkillExtraBonus(data, skillId, abilities);
    if (extra !== 0) {
        lines.push({
            kind: "delta",
            label: "Caminho do Macaco (Sabedoria)",
            delta: extra,
        });
    }

    if (skillId === "stealth") {
        const stealthPenalty = getEquippedArmorStealthDisadvantage(data);
        if (stealthPenalty) {
            lines.push({
                kind: "note",
                label: `Desvantagem em testes de Furtividade (${stealthPenalty.armorLabel})`,
            });
        }
    }

    return lines;
}
