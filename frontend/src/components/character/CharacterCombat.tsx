import type {
    CharacterFormData,
    Skill,
} from "../../types/character";

import {
    ABILITIES,
    getAbilityModifier,
} from "../../data/dnd/abilities";

import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_RACES } from "../../data/dnd/races";
import { DND_SKILLS } from "../../data/dnd/skills";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { getFinalAbilities } from "../../data/dnd/characterStats";

import {
    getBaseArmorClass,
    getCarryingCapacity,
    getInitialHitPoints,
    getInitiative,
    getPassivePerception,
    getSavingThrowModifier,
} from "../../data/dnd/combat";

interface CharacterCombatProps {
    data: CharacterFormData;
}

export function CharacterCombat({
    data,
}: CharacterCombatProps) {
    /*
     * ============================================================
     * CLASSE
     * ============================================================
     */

    const primaryClassSelection =
        data.classes[0];

    const selectedClass =
        primaryClassSelection
            ? DND_CLASSES.find(
                  (characterClass) =>
                      characterClass.id ===
                      primaryClassSelection.classId
              )
            : undefined;

    /*
     * ============================================================
     * RAÇA
     * ============================================================
     */

    const selectedRace = DND_RACES.find(
        (race) => race.id === data.raceId
    );

    /*
     * ============================================================
     * ATRIBUTOS FINAIS
     * ============================================================
     *
     * Aqui entram:
     *
     * - atributo base
     * - bônus fixos da raça
     * - escolhas de bônus da raça
     */

    const abilities =
        getFinalAbilities(data);

    const strength =
        abilities.strength;

    const dexterity =
        abilities.dexterity;

    const constitution =
        abilities.constitution;

    const wisdom =
        abilities.wisdom;

    const intelligence =
        abilities.intelligence;

    const charisma =
        abilities.charisma;

    /*
     * ============================================================
     * NÍVEL TOTAL
     * ============================================================
     */

    const totalLevel =
        data.classes.length > 0
            ? data.classes.reduce(
                  (
                      total,
                      characterClass
                  ) =>
                      total +
                      characterClass.level,
                  0
              )
            : 1;

    const proficiencyBonus =
        getProficiencyBonus(
            totalLevel
        );

    /*
     * ============================================================
     * PONTOS DE VIDA
     * ============================================================
     */

    const hitPoints = selectedClass
        ? getInitialHitPoints(
              selectedClass,
              constitution
          )
        : 0;

    /*
     * ============================================================
     * CLASSE DE ARMADURA
     * ============================================================
     *
     * Monge:
     *
     * 10 + DEX + SAB
     *
     * Demais personagens:
     *
     * 10 + DEX
     *
     * Equipamentos serão adicionados posteriormente.
     */

    const armorClass =
        getBaseArmorClass(
            dexterity,
            wisdom,
            selectedClass
        );

    /*
     * ============================================================
     * INICIATIVA
     * ============================================================
     */

    const initiative =
        getInitiative(
            dexterity
        );

    /*
     * ============================================================
     * DESLOCAMENTO
     * ============================================================
     */

    const movement =
        selectedRace?.speed ?? 30;

    /*
     * ============================================================
     * CAPACIDADE DE CARGA
     * ============================================================
     */

    const carryingCapacity =
        getCarryingCapacity(
            strength
        );

    /*
     * ============================================================
     * PROFICIÊNCIAS DE PERÍCIAS
     * ============================================================
     *
     * Uma perícia pode ser concedida por:
     *
     * - Classe
     * - Raça
     * - Background
     * - Talento
     */

    const raceSkills =
        data.skillProficiencies?.race ?? [];

    const classSkills =
        data.skillProficiencies?.class ?? [];

    const backgroundSkills =
        data.skillProficiencies?.background ?? [];

    const talentSkills =
        data.skillProficiencies?.talent ?? [];

    /*
     * ============================================================
     * TODAS AS PROFICIÊNCIAS
     * ============================================================
     */

    const proficientSkills =
        new Set<Skill>([
            ...raceSkills,
            ...classSkills,
            ...backgroundSkills,
            ...talentSkills,
        ]);

    /*
     * ============================================================
     * PERCEPÇÃO PASSIVA
     * ============================================================
     *
     * Fórmula:
     *
     * 10
     * + modificador de SAB
     * + bônus de proficiência, se proficiente
     *
     * Exemplo:
     *
     * SAB 20 = +5
     * Proficiência nível 12 = +4
     *
     * 10 + 5 + 4 = 19
     */

    const perceptionProficient =
        proficientSkills.has(
            "perception"
        );

    const passivePerception =
        getPassivePerception(
            wisdom,
            perceptionProficient,
            proficiencyBonus
        );

    /*
     * ============================================================
     * FORMATADOR
     * ============================================================
     */

    function formatModifier(
        value: number
    ): string {
        return value >= 0
            ? `+${value}`
            : `${value}`;
    }

    /*
     * ============================================================
     * MODIFICADOR DE PERÍCIA
     * ============================================================
     */

    function getSkillModifier(
        skillId: Skill
    ): number {
        const skill =
            DND_SKILLS.find(
                (item) =>
                    item.id === skillId
            );

        if (!skill) {
            return 0;
        }

        /*
         * Usa o atributo final.
         *
         * Exemplo:
         *
         * SAB 20
         * -> +5
         */

        const abilityValue =
            abilities[
                skill.ability
            ];

        const abilityModifier =
            getAbilityModifier(
                abilityValue
            );

        /*
         * Verifica todas as fontes
         * de proficiência.
         */

        const proficient =
            proficientSkills.has(
                skillId
            );

        return (
            abilityModifier +
            (
                proficient
                    ? proficiencyBonus
                    : 0
            )
        );
    }

    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <div>
            {/* =====================================================
                CABEÇALHO
            ===================================================== */}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                    Combate
                </h2>

                <p className="mt-2 text-slate-400">
                    Os valores abaixo são calculados
                    automaticamente com base na sua
                    raça, classe e atributos.
                </p>
            </div>

            {/* =====================================================
                PRINCIPAIS
            ===================================================== */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CombatCard
                    title="Pontos de Vida"
                    value={hitPoints}
                    description={
                        selectedClass
                            ? `1d${selectedClass.hitDie} + CON`
                            : "Selecione uma classe"
                    }
                />

                <CombatCard
                    title="Classe de Armadura"
                    value={armorClass}
                    description={
                        selectedClass?.id ===
                        "monk"
                            ? "10 + DEX + SAB"
                            : "10 + modificador de Destreza"
                    }
                />

                <CombatCard
                    title="Iniciativa"
                    value={formatModifier(
                        initiative
                    )}
                    description="Modificador de Destreza"
                />

                <CombatCard
                    title="Deslocamento"
                    value={`${movement} ft`}
                    description={
                        selectedRace
                            ? selectedRace.name
                            : "Padrão"
                    }
                />
            </div>

            {/* =====================================================
                INFORMAÇÕES DE COMBATE
            ===================================================== */}

            <section className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Informações de combate
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                    <InfoCard
                        label="Nível total"
                        value={totalLevel}
                    />

                    <InfoCard
                        label="Bônus de proficiência"
                        value={formatModifier(
                            proficiencyBonus
                        )}
                    />

                    <InfoCard
                        label="Percepção passiva"
                        value={passivePerception}
                    />

                    <InfoCard
                        label="Capacidade de carga"
                        value={`${carryingCapacity} lb`}
                    />

                    <InfoCard
                        label="Dado de vida"
                        value={
                            selectedClass
                                ? `d${selectedClass.hitDie}`
                                : "-"
                        }
                    />

                    <InfoCard
                        label="Modificador de CON"
                        value={formatModifier(
                            getAbilityModifier(
                                constitution
                            )
                        )}
                    />
                </div>
            </section>

            {/* =====================================================
                TESTES DE RESISTÊNCIA
            ===================================================== */}

            <section className="mb-8">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Testes de resistência
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        As resistências proficientes recebem
                        automaticamente o bônus de proficiência.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {ABILITIES.map(
                        (ability) => {
                            const value =
                                abilities[
                                    ability.id
                                ];

                            const modifier =
                                getSavingThrowModifier(
                                    ability.id,
                                    value,
                                    selectedClass
                                        ?.savingThrowProficiencies ??
                                        [],
                                    proficiencyBonus
                                );

                            const proficient =
                                selectedClass
                                    ?.savingThrowProficiencies
                                    .includes(
                                        ability.id
                                    ) ??
                                false;

                            return (
                                <div
                                    key={
                                        ability.id
                                    }
                                    className={[
                                        "flex items-center justify-between rounded-xl border p-4",

                                        proficient
                                            ? "border-indigo-500/50 bg-indigo-500/10"
                                            : "border-slate-800 bg-slate-950",
                                    ].join(
                                        " "
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={[
                                                "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold",

                                                proficient
                                                    ? "border-indigo-400 bg-indigo-500 text-white"
                                                    : "border-slate-700 text-slate-500",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {
                                                ability.shortName
                                            }
                                        </div>

                                        <div>
                                            <p className="font-medium text-white">
                                                {
                                                    ability.name
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {proficient
                                                    ? "Proficiente"
                                                    : "Não proficiente"}
                                            </p>
                                        </div>
                                    </div>

                                    <p
                                        className={[
                                            "text-xl font-bold",

                                            modifier >=
                                            0
                                                ? "text-emerald-400"
                                                : "text-red-400",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        {formatModifier(
                                            modifier
                                        )}
                                    </p>
                                </div>
                            );
                        }
                    )}
                </div>
            </section>

            {/* =====================================================
                ATRIBUTOS FINAIS
            ===================================================== */}

            <section className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Atributos finais
                </h3>

                <p className="mb-4 text-sm text-slate-400">
                    Os valores abaixo já incluem os bônus
                    provenientes da raça.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ABILITIES.map(
                        (ability) => {
                            const value =
                                abilities[
                                    ability.id
                                ];

                            const modifier =
                                getAbilityModifier(
                                    value
                                );

                            return (
                                <div
                                    key={
                                        ability.id
                                    }
                                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-white">
                                            {
                                                ability.name
                                            }
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                ability.shortName
                                            }
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">
                                            {
                                                value
                                            }
                                        </p>

                                        <p
                                            className={[
                                                "text-sm font-semibold",

                                                modifier >=
                                                0
                                                    ? "text-emerald-400"
                                                    : "text-red-400",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {formatModifier(
                                                modifier
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </section>

            {/* =====================================================
                PERCEPÇÃO
            ===================================================== */}

            <section>
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Percepção
                </h3>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-white">
                                Percepção
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {perceptionProficient
                                    ? "Sabedoria + bônus de proficiência"
                                    : "Sabedoria"}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                                {formatModifier(
                                    getSkillModifier(
                                        "perception"
                                    )
                                )}
                            </p>

                            <p className="text-xs text-slate-500">
                                Percepção
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/*
 * ================================================================
 * CARD PRINCIPAL
 * ================================================================
 */

interface CombatCardProps {
    title: string;
    value: string | number;
    description: string;
}

function CombatCard({
    title,
    value,
    description,
}: CombatCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm font-medium text-slate-400">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
                {value}
            </p>

            <p className="mt-2 text-xs text-slate-500">
                {description}
            </p>
        </div>
    );
}

/*
 * ================================================================
 * CARD DE INFORMAÇÃO
 * ================================================================
 */

interface InfoCardProps {
    label: string;
    value: string | number;
}

function InfoCard({
    label,
    value,
}: InfoCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}