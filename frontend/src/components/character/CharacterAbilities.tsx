import type {
    Ability,
    CharacterFormData,
} from "../../types/character";

import { DND_TALENTS } from "../../data/dnd/talents";
import { DND_RACES } from "../../data/dnd/races";

import {
    ABILITIES,
    getAbilityModifier,
} from "../../data/dnd/abilities";

interface CharacterAbilitiesProps {
    data: CharacterFormData;
    onChange: (data: CharacterFormData) => void;
}

function formatModifier(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
}

export function CharacterAbilities({
    data,
    onChange,
}: CharacterAbilitiesProps) {
    const selectedTalent = DND_TALENTS.find(
        (talent) => talent.id === data.talentId
    );

    const selectedRace = DND_RACES.find(
        (race) => race.id === data.raceId
    );

    const raceChoices = data.raceChoices ?? {};
    const talentChoices = data.talentChoices ?? {};

    /*
     * ============================================================
     * BÔNUS FIXOS DA RAÇA
     * ============================================================
     */
    function getRaceBonus(ability: Ability): number {
        return selectedRace?.abilityScoreIncrease?.[ability] ?? 0;
    }

    /*
     * ============================================================
     * BÔNUS ESCOLHIDOS DA RAÇA
     *
     * Exemplo:
     *
     * Meio-Elfo:
     * +2 Carisma
     * +1 em dois atributos diferentes
     *
     * raceChoices["abilityScoreIncrease"]
     * = ["strength", "wisdom"]
     * ============================================================
     */
    function getRaceChoiceBonus(ability: Ability): number {
        const choices =
            raceChoices["abilityScoreIncrease"] ?? [];

        if (!selectedRace?.abilityScoreChoices) {
            return 0;
        }

        if (!choices.includes(ability)) {
            return 0;
        }

        return selectedRace.abilityScoreChoices.amount;
    }

    /*
     * ============================================================
     * BÔNUS DO TALENTO
     * ============================================================
     */
    function getTalentAbilityChoices(): Ability[] {
        if (!selectedTalent?.abilityScoreIncrease) {
            return [];
        }

        return selectedTalent.abilityScoreIncrease.choices ?? [];
    }

    function getTalentSelectedAbility(): Ability | undefined {
        const selected =
            talentChoices["abilityScoreIncrease"];

        if (!selected) {
            return undefined;
        }

        return selected as Ability;
    }

    function getTalentBonus(ability: Ability): number {
        if (!selectedTalent?.abilityScoreIncrease) {
            return 0;
        }

        const amount =
            selectedTalent.abilityScoreIncrease.amount;

        const choices = getTalentAbilityChoices();

        /*
         * Caso o talento dê bônus em um único atributo
         * definido diretamente pelo talento.
         */
        if (choices.length === 0) {
            return 0;
        }

        const selectedAbility =
            getTalentSelectedAbility();

        if (selectedAbility !== ability) {
            return 0;
        }

        return amount;
    }

    /*
     * ============================================================
     * ESCOLHER ATRIBUTO DO TALENTO
     * ============================================================
     */
    function updateTalentAbility(
        ability: Ability
    ) {
        onChange({
            ...data,
            talentChoices: {
                ...talentChoices,
                abilityScoreIncrease: ability,
            },
        });
    }

    /*
     * ============================================================
     * ESCOLHER ATRIBUTOS DA RAÇA
     * ============================================================
     */
    function updateRaceAbilityChoice(
        index: number,
        ability: Ability
    ) {
        const currentChoices = [
            ...(raceChoices["abilityScoreIncrease"] ?? []),
        ];

        currentChoices[index] = ability;

        /*
         * Não permite que o mesmo atributo seja escolhido
         * duas vezes.
         */
        const uniqueChoices = currentChoices.filter(
            (value, currentIndex, array) =>
                value &&
                array.indexOf(value) === currentIndex
        );

        /*
         * Mantém exatamente os índices existentes.
         */
        while (uniqueChoices.length < currentChoices.length) {
            uniqueChoices.push("");
        }

        onChange({
            ...data,
            raceChoices: {
                ...raceChoices,
                abilityScoreIncrease:
                    currentChoices,
            },
        });
    }

    /*
     * ============================================================
     * ATRIBUTO TOTAL
     * ============================================================
     */
    function getTotalAbilityValue(
        ability: Ability
    ): number {
        const baseValue =
            data.abilities[ability] ?? 10;

        const raceBonus =
            getRaceBonus(ability);

        const raceChoiceBonus =
            getRaceChoiceBonus(ability);

        const talentBonus =
            getTalentBonus(ability);

        return (
            baseValue +
            raceBonus +
            raceChoiceBonus +
            talentBonus
        );
    }

    /*
     * ============================================================
     * ALTERAR ATRIBUTO BASE
     * ============================================================
     */
    function updateAbility(
        ability: Ability,
        value: number
    ) {
        onChange({
            ...data,
            abilities: {
                ...data.abilities,
                [ability]: value,
            },
        });
    }

    /*
     * ============================================================
     * VERIFICA SE RAÇA POSSUI ESCOLHAS
     * ============================================================
     */
    const hasRaceAbilityChoices =
        !!selectedRace?.abilityScoreChoices;

    const raceChoiceCount =
        selectedRace?.abilityScoreChoices?.count ?? 0;

    const selectedRaceAbilities =
        raceChoices["abilityScoreIncrease"] ?? [];

    /*
     * ============================================================
     * VERIFICA SE TALENTO POSSUI ESCOLHA DE ATRIBUTO
     * ============================================================
     */
    const talentAbilityChoices =
        getTalentAbilityChoices();

    const selectedTalentAbility =
        getTalentSelectedAbility();

    return (
        <div className="space-y-8">
            {/* ================================================== */}
            {/* CABEÇALHO */}
            {/* ================================================== */}

            <div>
                <h2 className="text-2xl font-bold text-white">
                    Atributos
                </h2>

                <p className="mt-2 text-slate-400">
                    Defina os valores dos seis atributos do
                    personagem. Os bônus raciais e do talento
                    serão aplicados automaticamente.
                </p>
            </div>

            {/* ================================================== */}
            {/* RAÇA */}
            {/* ================================================== */}

            {selectedRace && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            Raça: {selectedRace.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Bônus concedidos pela sua raça.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(
                            selectedRace.abilityScoreIncrease ?? {}
                        ).map(([ability, bonus]) => {
                            const abilityData =
                                ABILITIES.find(
                                    (item) =>
                                        item.id === ability
                                );

                            if (!abilityData) {
                                return null;
                            }

                            return (
                                <span
                                    key={ability}
                                    className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400"
                                >
                                    {abilityData.name} +{bonus}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* ESCOLHAS RACIAIS */}
            {/* ================================================== */}

            {hasRaceAbilityChoices && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-white">
                            Escolhas de atributo da raça
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Escolha{" "}
                            <span className="font-medium text-indigo-400">
                                {raceChoiceCount}
                            </span>{" "}
                            atributos diferentes para receber o
                            bônus racial.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({
                            length: raceChoiceCount,
                        }).map((_, index) => {
                            const currentValue =
                                selectedRaceAbilities[index] ??
                                "";

                            return (
                                <div key={index}>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Escolha {index + 1}
                                    </label>

                                    <select
                                        value={currentValue}
                                        onChange={(event) =>
                                            updateRaceAbilityChoice(
                                                index,
                                                event.target
                                                    .value as Ability
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    >
                                        <option value="">
                                            Selecione um atributo
                                        </option>

                                        {selectedRace.abilityScoreChoices?.abilities.map(
                                            (ability) => {
                                                const alreadySelected =
                                                    selectedRaceAbilities.some(
                                                        (
                                                            selected,
                                                            selectedIndex
                                                        ) =>
                                                            selected ===
                                                                ability &&
                                                            selectedIndex !==
                                                                index
                                                    );

                                                const abilityData =
                                                    ABILITIES.find(
                                                        (
                                                            item
                                                        ) =>
                                                            item.id ===
                                                            ability
                                                    );

                                                if (
                                                    !abilityData
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <option
                                                        key={
                                                            ability
                                                        }
                                                        value={
                                                            ability
                                                        }
                                                        disabled={
                                                            alreadySelected
                                                        }
                                                    >
                                                        {
                                                            abilityData.name
                                                        }{" "}
                                                        (+
                                                        {
                                                            selectedRace
                                                                .abilityScoreChoices
                                                                ?.amount
                                                        })
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-900/70 p-3 text-sm text-slate-400">
                        <span className="font-medium text-slate-300">
                            Exemplo:
                        </span>{" "}
                        um Meio-Elfo recebe +2 em Carisma e pode
                        escolher dois atributos diferentes para
                        receber +1 em cada.
                    </div>
                </div>
            )}

            {/* ================================================== */}
            {/* TALENTO */}
            {/* ================================================== */}

            {selectedTalent && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            Talento Inicial:{" "}
                            {selectedTalent.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Bônus de atributo concedidos pelo
                            talento serão aplicados abaixo.
                        </p>
                    </div>

                    {talentAbilityChoices.length > 0 && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Atributo beneficiado pelo talento
                            </label>

                            <select
                                value={
                                    selectedTalentAbility ?? ""
                                }
                                onChange={(event) =>
                                    updateTalentAbility(
                                        event.target
                                            .value as Ability
                                    )
                                }
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-amber-500"
                            >
                                <option value="">
                                    Selecione um atributo
                                </option>

                                {talentAbilityChoices.map(
                                    (ability) => {
                                        const abilityData =
                                            ABILITIES.find(
                                                (item) =>
                                                    item.id ===
                                                    ability
                                            );

                                        if (
                                            !abilityData
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <option
                                                key={ability}
                                                value={ability}
                                            >
                                                {
                                                    abilityData.name
                                                }{" "}
                                                (+
                                                {
                                                    selectedTalent
                                                        .abilityScoreIncrease
                                                        ?.amount
                                                })
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                    )}

                    {selectedTalent.abilityScoreIncrease &&
                        talentAbilityChoices.length === 0 && (
                            <div className="rounded-lg bg-slate-900/70 p-3 text-sm text-slate-400">
                                Este talento possui um bônus
                                específico de atributo que será
                                aplicado automaticamente.
                            </div>
                        )}
                </div>
            )}

            {/* ================================================== */}
            {/* ATRIBUTOS */}
            {/* ================================================== */}

            <div>
                <div className="mb-5">
                    <h3 className="text-xl font-semibold text-white">
                        Valores dos atributos
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        O valor informado abaixo representa o
                        valor base antes dos bônus raciais e do
                        talento.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ABILITIES.map((ability) => {
                        const baseValue =
                            data.abilities[
                                ability.id
                            ] ?? 10;

                        const raceBonus =
                            getRaceBonus(ability.id);

                        const raceChoiceBonus =
                            getRaceChoiceBonus(
                                ability.id
                            );

                        const talentBonus =
                            getTalentBonus(ability.id);

                        const totalValue =
                            getTotalAbilityValue(
                                ability.id
                            );

                        const modifier =
                            getAbilityModifier(
                                totalValue
                            );

                        return (
                            <div
                                key={ability.id}
                                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                            >
                                {/* Nome */}

                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white">
                                            {ability.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                ability.shortName
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-lg font-bold text-indigo-400">
                                        {formatModifier(
                                            modifier
                                        )}
                                    </div>
                                </div>

                                {/* Valor base */}

                                <div className="mb-4">
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Valor base
                                    </label>

                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={
                                            baseValue
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateAbility(
                                                ability.id,
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center text-xl font-semibold text-white outline-none transition focus:border-indigo-500"
                                    />
                                </div>

                                {/* Cálculo */}

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Base
                                        </span>

                                        <span className="text-white">
                                            {baseValue}
                                        </span>
                                    </div>

                                    {raceBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">
                                                Raça
                                            </span>

                                            <span className="text-emerald-400">
                                                +
                                                {
                                                    raceBonus
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {raceChoiceBonus !==
                                        0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">
                                                Escolha racial
                                            </span>

                                            <span className="text-emerald-400">
                                                +
                                                {
                                                    raceChoiceBonus
                                                }
                                            </span>
                                        </div>
                                    )}

                                    {talentBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">
                                                Talento
                                            </span>

                                            <span className="text-amber-400">
                                                +
                                                {
                                                    talentBonus
                                                }
                                            </span>
                                        </div>
                                    )}

                                    <div className="my-2 border-t border-slate-800" />

                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-300">
                                            Total
                                        </span>

                                        <span className="text-white">
                                            {
                                                totalValue
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Modificador
                                        </span>

                                        <span className="font-semibold text-indigo-400">
                                            {formatModifier(
                                                modifier
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ================================================== */}
            {/* RESUMO */}
            {/* ================================================== */}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="mb-4 text-lg font-semibold text-white">
                    Resumo dos atributos
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {ABILITIES.map((ability) => {
                        const total =
                            getTotalAbilityValue(
                                ability.id
                            );

                        const modifier =
                            getAbilityModifier(total);

                        return (
                            <div
                                key={ability.id}
                                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-center"
                            >
                                <p className="text-xs font-medium uppercase text-slate-500">
                                    {
                                        ability.shortName
                                    }
                                </p>

                                <p className="mt-1 text-xl font-bold text-white">
                                    {total}
                                </p>

                                <p className="text-sm text-indigo-400">
                                    {formatModifier(
                                        modifier
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}