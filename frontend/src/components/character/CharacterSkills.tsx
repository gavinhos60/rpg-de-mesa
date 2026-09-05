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
import { DND_SKILLS } from "../../data/dnd/skills";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { getFinalAbilities } from "../../data/dnd/characterStats";

interface CharacterSkillsProps {
    data: CharacterFormData;
    races: CharacterRace[];
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

export function CharacterSkills({
    data,
    races,
    onChange,
}: CharacterSkillsProps) {
    /*
     * ---------------------------------------------
     * RAÇA
     * ---------------------------------------------
     */

    const selectedRace = races.find(
        (race) => race.id === data.raceId
    );

    /*
     * ---------------------------------------------
     * CLASSE PRINCIPAL
     * ---------------------------------------------
     */

    const primaryClass = data.classes[0];

    const selectedClass = primaryClass
        ? DND_CLASSES.find(
            (characterClass) =>
                characterClass.id === primaryClass.classId
        )
        : undefined;

    /*
     * ---------------------------------------------
     * NÍVEL TOTAL
     * ---------------------------------------------
     */

    const totalLevel =
        data.classes.length > 0
            ? data.classes.reduce(
                (total, characterClass) =>
                    total + characterClass.level,
                0
            )
            : 1;

    const proficiencyBonus =
        getProficiencyBonus(totalLevel);

    /*
     * ---------------------------------------------
     * ATRIBUTOS FINAIS
     * ---------------------------------------------
     *
     * Inclui os bônus raciais.
     */

    const finalAbilities =
        getFinalAbilities(data);

    /*
     * ---------------------------------------------
     * PERÍCIAS DA CLASSE
     * ---------------------------------------------
     */

    const classSkillOptions =
        selectedClass?.skillProficiencies;

    const classAvailableSkills =
        classSkillOptions?.from ?? [];

    const classSkillLimit =
        classSkillOptions?.choose ?? 0;

    /*
     * ---------------------------------------------
     * PERÍCIAS DA RAÇA
     * ---------------------------------------------
     */

    const raceSkillOptions =
        selectedRace?.skillChoices;

    const raceAvailableSkills =
        raceSkillOptions?.skills ?? [];

    const raceSkillLimit =
        raceSkillOptions?.count ?? 0;

    /*
     * ---------------------------------------------
     * PROFICIÊNCIAS SELECIONADAS
     * ---------------------------------------------
     */

    const selectedClassSkills =
        data.skillProficiencies?.class ?? [];

    const selectedRaceSkills =
        data.skillProficiencies?.race ?? [];

    const selectedBackgroundSkills =
        data.skillProficiencies?.background ?? [];

    const selectedTalentSkills =
        data.skillProficiencies?.talent ?? [];

    /*
     * ---------------------------------------------
     * TODAS AS PROFICIÊNCIAS
     * ---------------------------------------------
     *
     * Uma perícia pode receber proficiência através de:
     *
     * - Classe
     * - Raça
     * - Background
     * - Talento
     *
     * Se qualquer fonte conceder a proficiência,
     * ela é considerada proficiente.
     */

    const proficientSkills = new Set<Skill>([
        ...selectedClassSkills,
        ...selectedRaceSkills,
        ...selectedBackgroundSkills,
        ...selectedTalentSkills,
    ]);

    /*
     * ---------------------------------------------
     * MODIFICADOR DA PERÍCIA
     * ---------------------------------------------
     */

    function getSkillModifier(
        skill: Skill
    ): number {
        const skillDefinition =
            DND_SKILLS.find(
                (item) => item.id === skill
            );

        if (!skillDefinition) {
            return 0;
        }

        /*
         * Usa o atributo FINAL.
         *
         * Exemplo:
         *
         * Sabedoria 20
         * -> modificador +5
         */

        const abilityValue =
            finalAbilities[
                skillDefinition.ability
            ];

        const abilityModifier =
            getAbilityModifier(abilityValue);

        /*
         * Verifica se a perícia possui
         * proficiência em qualquer fonte.
         */

        const isProficient =
            proficientSkills.has(skill);

        /*
         * Bônus de proficiência:
         *
         * proficiente -> +4
         * não proficiente -> +0
         */

        const skillProficiencyBonus =
            isProficient
                ? proficiencyBonus
                : 0;

        return (
            abilityModifier +
            skillProficiencyBonus
        );
    }

    /*
     * ---------------------------------------------
     * PERCEPÇÃO PASSIVA
     * ---------------------------------------------
     *
     * D&D 5e:
     *
     * 10 + modificador de Sabedoria
     * + bônus de proficiência se proficiente.
     *
     * Exemplo:
     *
     * SAB 20 = +5
     * Proficiência = +4
     *
     * 10 + 5 + 4 = 19
     */

    const passivePerception =
        10 + getSkillModifier("perception");

    /*
     * ---------------------------------------------
     * CLASSE
     * ---------------------------------------------
     */

    function toggleClassSkill(
        skill: Skill
    ) {
        if (!classSkillOptions) {
            return;
        }

        if (
            !classAvailableSkills.includes(skill)
        ) {
            return;
        }

        const alreadySelected =
            selectedClassSkills.includes(skill);

        /*
         * REMOVER
         */

        if (alreadySelected) {
            onChange((previous) => {
                const current =
                    previous.skillProficiencies
                        ?.class ?? [];

                const updated =
                    current.filter(
                        (item) => item !== skill
                    );

                const raceSkills =
                    previous.skillProficiencies
                        ?.race ?? [];

                const backgroundSkills =
                    previous.skillProficiencies
                        ?.background ?? [];

                const talentSkills =
                    previous.skillProficiencies
                        ?.talent ?? [];

                const stillProficient =
                    updated.includes(skill) ||
                    raceSkills.includes(skill) ||
                    backgroundSkills.includes(
                        skill
                    ) ||
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

                            proficient:
                                stillProficient,
                        },
                    },
                };
            });

            return;
        }

        /*
         * LIMITE ATINGIDO
         */

        if (
            selectedClassSkills.length >=
            classSkillLimit
        ) {
            return;
        }

        /*
         * ADICIONAR
         */

        onChange((previous) => {
            const current =
                previous.skillProficiencies
                    ?.class ?? [];

            const updated = [
                ...current,
                skill,
            ];

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
                        proficient: true,
                    },
                },
            };
        });
    }

    /*
     * ---------------------------------------------
     * RAÇA
     * ---------------------------------------------
     */

    function toggleRaceSkill(
        skill: Skill
    ) {
        if (!raceSkillOptions) {
            return;
        }

        if (
            !raceAvailableSkills.includes(skill)
        ) {
            return;
        }

        const alreadySelected =
            selectedRaceSkills.includes(skill);

        /*
         * REMOVER
         */

        if (alreadySelected) {
            onChange((previous) => {
                const current =
                    previous.skillProficiencies
                        ?.race ?? [];

                const updated =
                    current.filter(
                        (item) => item !== skill
                    );

                const classSkills =
                    previous.skillProficiencies
                        ?.class ?? [];

                const backgroundSkills =
                    previous.skillProficiencies
                        ?.background ?? [];

                const talentSkills =
                    previous.skillProficiencies
                        ?.talent ?? [];

                const stillProficient =
                    classSkills.includes(skill) ||
                    updated.includes(skill) ||
                    backgroundSkills.includes(
                        skill
                    ) ||
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

                            proficient:
                                stillProficient,
                        },
                    },
                };
            });

            return;
        }

        /*
         * LIMITE ATINGIDO
         */

        if (
            selectedRaceSkills.length >=
            raceSkillLimit
        ) {
            return;
        }

        /*
         * ADICIONAR
         */

        onChange((previous) => {
            const current =
                previous.skillProficiencies
                    ?.race ?? [];

            const updated = [
                ...current,
                skill,
            ];

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
                        proficient: true,
                    },
                },
            };
        });
    }

    /*
     * ---------------------------------------------
     * COMPONENTE DE PERÍCIA
     * ---------------------------------------------
     */

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
        const skillData =
            DND_SKILLS.find(
                (item) => item.id === skill
            );

        if (!skillData) {
            return null;
        }

        const ability =
            ABILITIES.find(
                (item) =>
                    item.id === skillData.ability
            );

        const modifier =
            getSkillModifier(skill);

        return (
            <button
                type="button"
                disabled={!available}
                onClick={onClick}
                className={[
                    "flex w-full items-center justify-between rounded-xl border p-4 text-left transition",

                    !available
                        ? "cursor-not-allowed border-slate-800 bg-slate-950 opacity-30"
                        : selected
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-slate-700 bg-slate-950 hover:border-slate-600 hover:bg-slate-900",
                ].join(" ")}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",

                            selected
                                ? "border-indigo-400 bg-indigo-500 text-white"
                                : "border-slate-600 text-slate-500",
                        ].join(" ")}
                    >
                        {selected ? "✓" : ""}
                    </div>

                    <div>
                        <p className="font-medium text-white">
                            {skillData.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            {ability?.shortName}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p
                        className={[
                            "text-lg font-bold",

                            modifier >= 0
                                ? "text-emerald-400"
                                : "text-red-400",
                        ].join(" ")}
                    >
                        {modifier >= 0 ? "+" : ""}
                        {modifier}
                    </p>
                </div>
            </button>
        );
    }

    return (
        <div>
            {/* CABEÇALHO */}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Perícias
                </h2>

                <p className="mt-2 text-slate-400">
                    Escolha as perícias concedidas pela
                    sua classe e pela sua raça.
                </p>
            </div>

            {/* RESUMO SUPERIOR */}

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">
                        Nível total
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {totalLevel}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">
                        Bônus de proficiência
                    </p>

                    <p className="mt-1 text-2xl font-bold text-indigo-400">
                        +{proficiencyBonus}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">
                        Percepção passiva
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {passivePerception}
                    </p>
                </div>
            </div>

            {/* PERÍCIAS DA CLASSE */}

            {classSkillOptions && (
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Perícias de{" "}
                                {selectedClass?.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Escolha{" "}
                                {classSkillLimit}{" "}
                                perícias.
                            </p>
                        </div>

                        <div className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400">
                            {selectedClassSkills.length}
                            {" / "}
                            {classSkillLimit}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {classAvailableSkills.map(
                            (skill) => (
                                <SkillOption
                                    key={skill}
                                    skill={skill}
                                    available={true}
                                    selected={selectedClassSkills.includes(
                                        skill
                                    )}
                                    onClick={() =>
                                        toggleClassSkill(
                                            skill
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {/* PERÍCIAS DA RAÇA */}

            {raceSkillOptions && (
                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Perícias de{" "}
                                {selectedRace?.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Escolha{" "}
                                {raceSkillLimit}{" "}
                                perícias.
                            </p>
                        </div>

                        <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
                            {selectedRaceSkills.length}
                            {" / "}
                            {raceSkillLimit}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {raceAvailableSkills.map(
                            (skill) => (
                                <SkillOption
                                    key={skill}
                                    skill={skill}
                                    available={true}
                                    selected={selectedRaceSkills.includes(
                                        skill
                                    )}
                                    onClick={() =>
                                        toggleRaceSkill(
                                            skill
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {/* PERÍCIAS DO TALENTO */}

            {selectedTalentSkills.length > 0 && (
                <section className="mb-8">
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Perícias do talento
                                </h3>

                                <p className="mt-1 text-sm text-slate-400">
                                    Perícias recebidas através do Talento Inicial.
                                </p>
                            </div>

                            <div className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-400">
                                {selectedTalentSkills.length}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {selectedTalentSkills.map(
                            (skill) => (
                                <SkillOption
                                    key={skill}
                                    skill={skill}
                                    available={false}
                                    selected={true}
                                    onClick={() => { }}
                                />
                            )
                        )}
                    </div>
                </section>
            )}

            {/* RESUMO DAS PROFICIÊNCIAS */}

            <section className="mb-8">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Resumo das proficiências
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        Suas proficiências podem vir de diferentes fontes.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {DND_SKILLS.map((skill) => {
                        const sources: string[] = [];

                        if (
                            selectedClassSkills.includes(
                                skill.id
                            )
                        ) {
                            sources.push("Classe");
                        }

                        if (
                            selectedRaceSkills.includes(
                                skill.id
                            )
                        ) {
                            sources.push("Raça");
                        }

                        if (
                            selectedBackgroundSkills.includes(
                                skill.id
                            )
                        ) {
                            sources.push("Background");
                        }

                        if (
                            selectedTalentSkills.includes(
                                skill.id
                            )
                        ) {
                            sources.push("Talento");
                        }

                        if (sources.length === 0) {
                            return null;
                        }

                        const modifier =
                            getSkillModifier(
                                skill.id
                            );

                        return (
                            <div
                                key={skill.id}
                                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-white">
                                            {skill.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {sources.join(
                                                " • "
                                            )}
                                        </p>
                                    </div>

                                    <p className="text-lg font-bold text-emerald-400">
                                        {modifier >= 0
                                            ? "+"
                                            : ""}
                                        {modifier}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* AVISO */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm leading-6 text-slate-400">
                    As perícias recebidas de diferentes
                    fontes não acumulam o bônus de
                    proficiência. Uma perícia continua
                    sendo apenas uma proficiência.
                </p>
            </div>
        </div>
    );
}