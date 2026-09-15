import type { Dispatch, SetStateAction } from "react";

import type {
    CharacterFormData,
    CharacterRace,
    Skill,
} from "../../types/character";

import {
    ABILITIES,
    getAbilityModifier,
} from "../../data/dnd/abilities";

import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_BACKGROUNDS } from "../../data/dnd/backgrounds";
import {
    DND_SKILLS,
    getProficientSkills,
    getSkillExtraBonus,
} from "../../data/dnd/skills";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getAsiFeatSkills } from "../../data/dnd/classFeatures";
import {
    getRaceDisplayName,
    getResolvedSkillChoices,
    getResolvedSkillProficiencies,
} from "../../data/dnd/raceResolution";

interface CharacterSkillsProps {
    data: CharacterFormData;
    races: CharacterRace[];
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };

export function CharacterSkills({
    data,
    races,
    onChange,
}: CharacterSkillsProps) {
    const selectedRace = races.find((race) => race.id === data.raceId);

    const primaryClass = data.classes[0];

    const selectedClass = primaryClass
        ? DND_CLASSES.find(
            (characterClass) => characterClass.id === primaryClass.classId
        )
        : undefined;

    const totalLevel =
        data.classes.length > 0
            ? data.classes.reduce(
                (total, characterClass) => total + characterClass.level,
                0
            )
            : 1;

    const proficiencyBonus = getProficiencyBonus(totalLevel);

    const finalAbilities = getFinalAbilities(data);

    const classSkillOptions = selectedClass?.skillProficiencies;
    const classAvailableSkills = classSkillOptions?.from ?? [];
    const classSkillLimit = classSkillOptions?.choose ?? 0;

    const raceSkillOptions = getResolvedSkillChoices(data);
    const raceAvailableSkills = raceSkillOptions?.skills ?? [];
    const raceSkillLimit = raceSkillOptions?.count ?? 0;

    const selectedClassSkills = data.skillProficiencies?.class ?? [];
    const selectedRaceSkills = data.skillProficiencies?.race ?? [];
    const selectedBackgroundSkills = data.skillProficiencies?.background ?? [];
    const selectedTalentSkills = data.skillProficiencies?.talent ?? [];
    const selectedAsiFeatSkills = getAsiFeatSkills(data);
    const selectedBackground = DND_BACKGROUNDS.find(
        (background) => background.id === data.backgroundId
    );
    const raceFixedSkills = getResolvedSkillProficiencies(data);    const baseBackgroundSkills = selectedBackground?.skillProficiencies ?? [];
    const nonBackgroundSkills = new Set<Skill>([
        ...raceFixedSkills,
        ...selectedClassSkills,
        ...selectedRaceSkills,
        ...selectedTalentSkills,
        ...selectedAsiFeatSkills,
    ]);
    const backgroundReplacementCount = baseBackgroundSkills.filter(
        (skill) => nonBackgroundSkills.has(skill)
    ).length;
    const selectedBackgroundReplacements =
        data.backgroundChoices.skills.slice(0, backgroundReplacementCount);

    const proficientSkills = getProficientSkills(data);

    function getSkillModifier(skill: Skill): number {
        const skillDefinition = DND_SKILLS.find((item) => item.id === skill);

        if (!skillDefinition) {
            return 0;
        }

        const abilityValue = finalAbilities[skillDefinition.ability];
        const abilityModifier = getAbilityModifier(abilityValue);
        const isProficient = proficientSkills.has(skill);
        const skillProficiencyBonus = isProficient ? proficiencyBonus : 0;

        return abilityModifier +
            skillProficiencyBonus +
            getSkillExtraBonus(data, skill, finalAbilities);
    }

    const passivePerception = 10 + getSkillModifier("perception");

    function toggleClassSkill(skill: Skill) {
        if (!classSkillOptions) {
            return;
        }

        if (!classAvailableSkills.includes(skill)) {
            return;
        }

        const alreadySelected = selectedClassSkills.includes(skill);

        if (alreadySelected) {
            onChange((previous) => {
                const current = previous.skillProficiencies?.class ?? [];
                const updated = current.filter((item) => item !== skill);

                const raceSkills = previous.skillProficiencies?.race ?? [];
                const backgroundSkills =
                    previous.skillProficiencies?.background ?? [];
                const talentSkills = previous.skillProficiencies?.talent ?? [];

                const stillProficient =
                    updated.includes(skill) ||
                    raceSkills.includes(skill) ||
                    backgroundSkills.includes(skill) ||
                    talentSkills.includes(skill);

                return {
                    ...previous,
                    skillProficiencies: {
                        ...(previous.skillProficiencies ?? {}),
                        class: updated,
                    },
                    skills: {
                        ...previous.skills,
                        [skill]: {
                            ...previous.skills[skill],
                            proficient: stillProficient,
                        },
                    },
                };
            });

            return;
        }

        if (selectedClassSkills.length >= classSkillLimit) {
            return;
        }

        onChange((previous) => {
            const current = previous.skillProficiencies?.class ?? [];
            const updated = [...current, skill];

            return {
                ...previous,
                skillProficiencies: {
                    ...(previous.skillProficiencies ?? {}),
                    class: updated,
                },
                skills: {
                    ...previous.skills,
                    [skill]: { ...previous.skills[skill], proficient: true },
                },
            };
        });
    }

    function toggleRaceSkill(skill: Skill) {
        if (!raceSkillOptions) {
            return;
        }

        if (!raceAvailableSkills.includes(skill)) {
            return;
        }

        const alreadySelected = selectedRaceSkills.includes(skill);

        if (alreadySelected) {
            onChange((previous) => {
                const current = previous.skillProficiencies?.race ?? [];
                const updated = current.filter((item) => item !== skill);

                const classSkills = previous.skillProficiencies?.class ?? [];
                const backgroundSkills =
                    previous.skillProficiencies?.background ?? [];
                const talentSkills = previous.skillProficiencies?.talent ?? [];

                const stillProficient =
                    classSkills.includes(skill) ||
                    updated.includes(skill) ||
                    backgroundSkills.includes(skill) ||
                    talentSkills.includes(skill);

                return {
                    ...previous,
                    skillProficiencies: {
                        ...(previous.skillProficiencies ?? {}),
                        race: updated,
                    },
                    skills: {
                        ...previous.skills,
                        [skill]: {
                            ...previous.skills[skill],
                            proficient: stillProficient,
                        },
                    },
                };
            });

            return;
        }

        if (selectedRaceSkills.length >= raceSkillLimit) {
            return;
        }

        onChange((previous) => {
            const current = previous.skillProficiencies?.race ?? [];
            const updated = [...current, skill];

            return {
                ...previous,
                skillProficiencies: {
                    ...(previous.skillProficiencies ?? {}),
                    race: updated,
                },
                skills: {
                    ...previous.skills,
                    [skill]: { ...previous.skills[skill], proficient: true },
                },
            };
        });
    }

    function updateBackgroundReplacement(index: number, skill: Skill | "") {
        onChange((previous) => {
            const replacements = [
                ...previous.backgroundChoices.skills.slice(
                    0,
                    backgroundReplacementCount
                ),
            ];
            if (skill) replacements[index] = skill;
            else replacements.splice(index, 1);

            const backgroundSkills = [
                ...baseBackgroundSkills,
                ...replacements.filter(Boolean),
            ];
            const proficient = new Set<Skill>([
                ...(previous.skillProficiencies?.class ?? []),
                ...(previous.skillProficiencies?.race ?? []),
                ...(previous.skillProficiencies?.talent ?? []),
                ...getAsiFeatSkills(previous),
                ...backgroundSkills,
            ]);
            const skills = Object.fromEntries(
                Object.entries(previous.skills).map(([id, value]) => [
                    id,
                    {
                        ...value,
                        proficient: proficient.has(id as Skill),
                    },
                ])
            ) as CharacterFormData["skills"];

            return {
                ...previous,
                backgroundChoices: {
                    ...previous.backgroundChoices,
                    skills: replacements.filter(Boolean),
                },
                skillProficiencies: {
                    ...previous.skillProficiencies,
                    background: backgroundSkills,
                },
                skills,
            };
        });
    }

    function SkillOption({
        skill,
        selected,
        available,
        onClick,
    }: {
        skill: Skill;
        selected: boolean;
        available: boolean;
        onClick: () => void;
    }) {
        const skillData = DND_SKILLS.find((item) => item.id === skill);

        if (!skillData) {
            return null;
        }

        const ability = ABILITIES.find((item) => item.id === skillData.ability);
        const modifier = getSkillModifier(skill);

        return (
            <button
                type="button"
                disabled={!available}
                onClick={onClick}
                className="flex w-full items-center justify-between border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                    backgroundColor: selected ? "var(--color-surface)" : "var(--color-parchment)",
                    borderColor: selected ? "var(--color-crimson)" : "var(--color-border)",
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center border text-sm"
                        style={{
                            ...cinzel,
                            borderColor: selected ? "var(--color-crimson-deep)" : "var(--color-border)",
                            backgroundColor: selected ? "var(--color-crimson)" : "transparent",
                            color: selected
                                ? "var(--color-ink-inverse)"
                                : "var(--color-ink-soft)",
                        }}
                    >
                        {selected ? "✓" : ""}
                    </div>

                    <div>
                        <p className="text-[var(--color-ink)]" style={cinzel}>{skillData.name}</p>
                        <p className="text-xs text-[var(--color-ink-soft)]">{ability?.shortName}</p>
                    </div>
                </div>

                <p
                    className="text-lg"
                    style={{ ...cinzel, color: modifier >= 0 ? "var(--color-green)" : "#8B3A2E" }}
                >
                    {modifier >= 0 ? "+" : ""}
                    {modifier}
                </p>
            </button>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Perícias
                </h2>

                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Escolha as perícias concedidas pela sua classe e pela sua raça.
                </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="border p-4" style={card}>
                    <p className="text-sm text-[var(--color-ink-muted)]">Nível total</p>
                    <p className="mt-1 text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        {totalLevel}
                    </p>
                </div>

                <div className="border p-4" style={card}>
                    <p className="text-sm text-[var(--color-ink-muted)]">Bônus de proficiência</p>
                    <p className="mt-1 text-2xl text-[var(--color-crimson)]" style={{ ...cinzel, fontWeight: 600 }}>
                        +{proficiencyBonus}
                    </p>
                </div>

                <div className="border p-4" style={card}>
                    <p className="text-sm text-[var(--color-ink-muted)]">Percepção passiva</p>
                    <p className="mt-1 text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        {passivePerception}
                    </p>
                </div>
            </div>

            {classSkillOptions && (
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                Perícias de {selectedClass?.name}
                            </h3>

                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                Escolha {classSkillLimit} perícias.
                            </p>
                        </div>

                        <div
                            className="px-3 py-1.5 text-sm"
                            style={{ ...cinzel, backgroundColor: "var(--color-crimson)", color: "var(--color-ink-inverse)" }}
                        >
                            {selectedClassSkills.length} / {classSkillLimit}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {classAvailableSkills.map((skill) => (
                            <SkillOption
                                key={skill}
                                skill={skill}
                                available={true}
                                selected={selectedClassSkills.includes(skill)}
                                onClick={() => toggleClassSkill(skill)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {raceSkillOptions && (
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                Perícias de {getRaceDisplayName(data) || selectedRace?.name}
                            </h3>

                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                Escolha {raceSkillLimit} perícias.
                            </p>
                        </div>

                        <div
                            className="px-3 py-1.5 text-sm"
                            style={{ ...cinzel, backgroundColor: "var(--color-green)", color: "var(--color-ink-inverse)" }}
                        >
                            {selectedRaceSkills.length} / {raceSkillLimit}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {raceAvailableSkills.map((skill) => (
                            <SkillOption
                                key={skill}
                                skill={skill}
                                available={true}
                                selected={selectedRaceSkills.includes(skill)}
                                onClick={() => toggleRaceSkill(skill)}
                            />
                        ))}
                    </div>
                </section>
            )}

            {backgroundReplacementCount > 0 && (
                <section className="mb-8">
                    <div className="mb-4">
                        <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Substituições do antecedente
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Uma proficiência do antecedente já veio de outra
                            fonte. Escolha {backgroundReplacementCount} perícia
                            diferente, conforme a regra do PHB.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: backgroundReplacementCount }).map((_, index) => (
                            <label key={index} className="border p-4" style={card}>
                                <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                                    Perícia substituta {index + 1}
                                </span>
                                <select
                                    value={selectedBackgroundReplacements[index] ?? ""}
                                    onChange={(event) =>
                                        updateBackgroundReplacement(
                                            index,
                                            event.target.value as Skill | ""
                                        )
                                    }
                                    className="w-full border bg-[var(--color-parchment)] px-3 py-2 text-[var(--color-ink)] outline-none"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    <option value="">Selecione</option>
                                    {DND_SKILLS.map((skill) => (
                                        <option
                                            key={skill.id}
                                            value={skill.id}
                                            disabled={
                                                nonBackgroundSkills.has(skill.id) ||
                                                baseBackgroundSkills.includes(skill.id) ||
                                                selectedBackgroundReplacements.some(
                                                    (selected, selectedIndex) =>
                                                        selected === skill.id &&
                                                        selectedIndex !== index
                                                )
                                            }
                                        >
                                            {skill.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ))}
                    </div>
                </section>
            )}

            {selectedTalentSkills.length > 0 && (
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                Perícias do talento
                            </h3>

                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                Perícias recebidas através do Talento Inicial.
                            </p>
                        </div>

                        <div
                            className="px-3 py-1.5 text-sm"
                            style={{ ...cinzel, backgroundColor: "#9C7A3C", color: "var(--color-ink-inverse)" }}
                        >
                            {selectedTalentSkills.length}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {selectedTalentSkills.map((skill) => (
                            <SkillOption
                                key={skill}
                                skill={skill}
                                available={false}
                                selected={true}
                                onClick={() => {}}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="mb-8">
                <div className="mb-4">
                    <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Resumo das proficiências
                    </h3>

                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        Suas proficiências podem vir de diferentes fontes.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {DND_SKILLS.map((skill) => {
                        const sources: string[] = [];

                        if (selectedClassSkills.includes(skill.id)) sources.push("Classe");
                        if (
                            selectedRaceSkills.includes(skill.id) ||
                            raceFixedSkills.includes(skill.id)
                        ) sources.push("Raça");
                        if (selectedBackgroundSkills.includes(skill.id)) sources.push("Background");
                        if (selectedTalentSkills.includes(skill.id)) sources.push("Talento");

                        if (sources.length === 0) {
                            return null;
                        }

                        const modifier = getSkillModifier(skill.id);

                        return (
                            <div key={skill.id} className="border p-4" style={card}>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[var(--color-ink)]" style={cinzel}>{skill.name}</p>
                                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                                            {sources.join(" • ")}
                                        </p>
                                    </div>

                                    <p className="text-lg" style={{ ...cinzel, color: "var(--color-green)" }}>
                                        {modifier >= 0 ? "+" : ""}
                                        {modifier}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="border p-4" style={card}>
                <p className="text-sm leading-6 text-[var(--color-ink-muted)]">
                    As perícias recebidas de diferentes fontes não acumulam o
                    bônus de proficiência. Uma perícia continua sendo apenas
                    uma proficiência.
                </p>
            </div>
        </div>
    );
}