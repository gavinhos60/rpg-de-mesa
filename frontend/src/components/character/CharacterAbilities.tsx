import { useEffect } from "react";

import type {
    Ability,
    CharacterFormData,
} from "../../types/character";

import { DND_TALENTS } from "../../data/dnd/talents";
import { DND_RACES } from "../../data/dnd/races";
import {
    getRaceDisplayName,
    getResolvedAbilityScoreChoices,
    getResolvedAbilityScoreIncrease,
} from "../../data/dnd/raceResolution";
import {
    getAbilityBonuses,
    getFinalAbilities,
    getMaxBaseAbilities,
    MAX_ABILITY_SCORE,
    MIN_ABILITY_SCORE,
} from "../../data/dnd/characterStats";
import { CharacterAsiChoices } from "./CharacterAsiChoices";

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

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };
const nested = { backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" };

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
    const resolvedRaceIncrease = getResolvedAbilityScoreIncrease(data);
    const resolvedRaceChoices = getResolvedAbilityScoreChoices(data);

    const raceChoices = data.raceChoices ?? {};
    const talentChoices = data.talentChoices ?? {};

    function getRaceBonus(ability: Ability): number {
        return resolvedRaceIncrease[ability] ?? 0;
    }

    function getRaceChoiceBonus(ability: Ability): number {
        const choices =
            raceChoices["abilityScoreIncrease"] ?? [];

        if (!resolvedRaceChoices) {
            return 0;
        }

        if (!choices.includes(ability)) {
            return 0;
        }

        return resolvedRaceChoices.amount;
    }

    function getTalentAbilityChoices(): Ability[] {
        if (!selectedTalent?.abilityScoreIncrease) {
            return [];
        }

        return selectedTalent.abilityScoreIncrease.choices ?? [];
    }

    function getTalentSelectedAbility(): Ability | undefined {
        const selected =
            talentChoices["abilityScoreIncrease"] ??
            talentChoices["ability"];

        if (!selected) {
            const choices = getTalentAbilityChoices();
            return choices.length === 1 ? choices[0] : undefined;
        }

        return Array.isArray(selected)
            ? selected[0] as Ability | undefined
            : selected as Ability;
    }

    function getTalentBonus(ability: Ability): number {
        if (!selectedTalent?.abilityScoreIncrease) {
            return 0;
        }

        const amount =
            selectedTalent.abilityScoreIncrease.amount;

        const choices = getTalentAbilityChoices();

        const selectedAbility =
            getTalentSelectedAbility();

        if (
            selectedAbility !== ability ||
            (choices.length > 0 && !choices.includes(ability))
        ) {
            return 0;
        }

        return amount;
    }

    function updateTalentAbility(ability: Ability) {
        onChange({
            ...data,
            talentChoices: {
                ...talentChoices,
                abilityScoreIncrease: ability,
            },
        });
    }

    function updateRaceAbilityChoice(
        index: number,
        ability: Ability
    ) {
        const currentChoices = [
            ...(raceChoices["abilityScoreIncrease"] ?? []),
        ];

        currentChoices[index] = ability;

        const uniqueChoices = currentChoices.filter(
            (value, currentIndex, array) =>
                value &&
                array.indexOf(value) === currentIndex
        );

        while (uniqueChoices.length < currentChoices.length) {
            uniqueChoices.push("");
        }

        onChange({
            ...data,
            raceChoices: {
                ...raceChoices,
                abilityScoreIncrease: currentChoices,
            },
        });
    }

    function getTotalAbilityValue(ability: Ability): number {
        return getFinalAbilities(data)[ability];
    }

    function updateAbility(ability: Ability, value: number) {
        const maxBase = maxBaseAbilities[ability];
        const safeValue = Number.isNaN(value)
            ? MIN_ABILITY_SCORE
            : Math.min(maxBase, Math.max(MIN_ABILITY_SCORE, value));

        onChange({
            ...data,
            abilities: {
                ...data.abilities,
                [ability]: safeValue,
            },
        });
    }

    const abilityBonuses = getAbilityBonuses(data);
    const maxBaseAbilities = getMaxBaseAbilities(data);

    useEffect(() => {
        const limits = getMaxBaseAbilities(data);
        const overflowing = ABILITIES.filter(
            (ability) => (data.abilities[ability.id] ?? 10) > limits[ability.id]
        );

        if (overflowing.length === 0) {
            return;
        }

        const abilities = { ...data.abilities };
        overflowing.forEach((ability) => {
            abilities[ability.id] = limits[ability.id];
        });

        onChange({ ...data, abilities });
    }, [data, onChange]);

    const hasRaceAbilityChoices = !!resolvedRaceChoices;
    const raceChoiceCount = resolvedRaceChoices?.count ?? 0;
    const selectedRaceAbilities = raceChoices["abilityScoreIncrease"] ?? [];
    const talentAbilityChoices = getTalentAbilityChoices();
    const selectedTalentAbility = getTalentSelectedAbility();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Atributos
                </h2>

                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Defina os valores dos seis atributos do personagem. Os
                    bônus raciais e do talento serão aplicados automaticamente.
                </p>
            </div>

            {selectedRace && (
                <div className="border p-5" style={card}>
                    <div className="mb-4">
                        <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Raça: {getRaceDisplayName(data) || selectedRace.name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Bônus concedidos pela sua raça
                            {data.subraceId ? " e subraça" : ""}.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(resolvedRaceIncrease).map(([ability, bonus]) => {
                            const abilityData = ABILITIES.find(
                                (item) => item.id === ability
                            );

                            if (!abilityData) {
                                return null;
                            }

                            return (
                                <span
                                    key={ability}
                                    className="border px-3 py-1.5 text-sm"
                                    style={{ borderColor: "var(--color-green)", color: "var(--color-green)" }}
                                >
                                    {abilityData.name} +{bonus}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {hasRaceAbilityChoices && (
                <div className="border p-5" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}>
                    <div className="mb-5">
                        <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Escolhas de atributo da raça
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Escolha{" "}
                            <span className="text-[var(--color-crimson)]" style={cinzel}>
                                {raceChoiceCount}
                            </span>{" "}
                            atributos diferentes para receber o bônus racial.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: raceChoiceCount }).map((_, index) => {
                            const currentValue = selectedRaceAbilities[index] ?? "";

                            return (
                                <div key={index}>
                                    <label className="mb-2 block text-sm text-[var(--color-ink-muted)]" style={cinzel}>
                                        Escolha {index + 1}
                                    </label>

                                    <select
                                        value={currentValue}
                                        onChange={(event) =>
                                            updateRaceAbilityChoice(
                                                index,
                                                event.target.value as Ability
                                            )
                                        }
                                        className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-crimson)]"
                                        style={nested}
                                    >
                                        <option value="">Selecione um atributo</option>

                                        {resolvedRaceChoices?.abilities.map(
                                            (ability) => {
                                                const alreadySelected =
                                                    selectedRaceAbilities.some(
                                                        (selected, selectedIndex) =>
                                                            selected === ability &&
                                                            selectedIndex !== index
                                                    );

                                                const abilityData = ABILITIES.find(
                                                    (item) => item.id === ability
                                                );

                                                if (!abilityData) {
                                                    return null;
                                                }

                                                return (
                                                    <option
                                                        key={ability}
                                                        value={ability}
                                                        disabled={alreadySelected}
                                                    >
                                                        {abilityData.name} (+
                                                        {resolvedRaceChoices?.amount})
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 border p-3 text-sm text-[var(--color-ink-muted)]" style={nested}>
                        <span className="text-[var(--color-ink)]" style={cinzel}>Exemplo:</span>{" "}
                        um Meio-Elfo recebe +2 em Carisma e pode escolher dois
                        atributos diferentes para receber +1 em cada.
                    </div>
                </div>
            )}

            {selectedTalent && (
                <div className="border p-5" style={{ backgroundColor: "var(--color-surface)", borderColor: "#9C7A3C" }}>
                    <div className="mb-4">
                        <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Talento Inicial: {selectedTalent.name}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Bônus de atributo concedidos pelo talento serão
                            aplicados abaixo.
                        </p>
                    </div>

                    {talentAbilityChoices.length > 0 && (
                        <div>
                            <label className="mb-2 block text-sm text-[var(--color-ink-muted)]" style={cinzel}>
                                Atributo beneficiado pelo talento
                            </label>

                            <select
                                value={selectedTalentAbility ?? ""}
                                onChange={(event) =>
                                    updateTalentAbility(event.target.value as Ability)
                                }
                                className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none transition-colors focus:border-[#9C7A3C]"
                                style={nested}
                            >
                                <option value="">Selecione um atributo</option>

                                {talentAbilityChoices.map((ability) => {
                                    const abilityData = ABILITIES.find(
                                        (item) => item.id === ability
                                    );

                                    if (!abilityData) {
                                        return null;
                                    }

                                    return (
                                        <option key={ability} value={ability}>
                                            {abilityData.name} (+
                                            {selectedTalent.abilityScoreIncrease?.amount})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    {selectedTalent.abilityScoreIncrease &&
                        talentAbilityChoices.length === 0 && (
                            <div className="border p-3 text-sm text-[var(--color-ink-muted)]" style={nested}>
                                Este talento possui um bônus específico de
                                atributo que será aplicado automaticamente.
                            </div>
                        )}
                </div>
            )}

            <CharacterAsiChoices data={data} onChange={onChange} />

            <div>
                <div className="mb-5">
                    <h3 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Valores dos atributos
                    </h3>

                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        O valor informado abaixo representa o valor base antes
                        dos bônus raciais e do talento.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ABILITIES.map((ability) => {
                        const baseValue = data.abilities[ability.id] ?? 10;
                        const raceBonus = getRaceBonus(ability.id);
                        const raceChoiceBonus = getRaceChoiceBonus(ability.id);
                        const talentBonus = getTalentBonus(ability.id);
                        const totalValue = getTotalAbilityValue(ability.id);
                        const progressionBonus =
                            abilityBonuses[ability.id] -
                            raceBonus -
                            raceChoiceBonus -
                            talentBonus;
                        const maxBase = maxBaseAbilities[ability.id];
                        const modifier = getAbilityModifier(totalValue);

                        return (
                            <div key={ability.id} className="border p-5" style={card}>
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                            {ability.name}
                                        </p>

                                        <p className="text-xs text-[var(--color-ink-soft)]">
                                            {ability.shortName}
                                        </p>
                                    </div>

                                    <div
                                        className="px-3 py-1.5 text-lg"
                                        style={{ ...cinzel, backgroundColor: "var(--color-crimson)", color: "var(--color-ink-inverse)" }}
                                    >
                                        {formatModifier(modifier)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2 block text-xs text-[var(--color-ink-soft)]" style={cinzel}>
                                        Valor base
                                    </label>

                                    <input
                                        type="number"
                                        min={MIN_ABILITY_SCORE}
                                        max={maxBase}
                                        value={baseValue}
                                        onChange={(event) =>
                                            updateAbility(ability.id, Number(event.target.value))
                                        }
                                        className="w-full border px-4 py-3 text-center text-xl text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-crimson)]"
                                        style={{ ...nested, fontFamily: "'Cinzel', serif" }}
                                    />

                                    <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                                        {abilityBonuses[ability.id] > 0
                                            ? `Máximo ${maxBase} de base — com +${abilityBonuses[ability.id]} de bônus chega ao teto de ${MAX_ABILITY_SCORE}.`
                                            : `Máximo ${MAX_ABILITY_SCORE}.`}
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-ink-muted)]">Base</span>
                                        <span className="text-[var(--color-ink)]">{baseValue}</span>
                                    </div>

                                    {raceBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ink-muted)]">Raça</span>
                                            <span style={{ color: "var(--color-green)" }}>+{raceBonus}</span>
                                        </div>
                                    )}

                                    {raceChoiceBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ink-muted)]">Escolha racial</span>
                                            <span style={{ color: "var(--color-green)" }}>+{raceChoiceBonus}</span>
                                        </div>
                                    )}

                                    {talentBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ink-muted)]">Talento</span>
                                            <span style={{ color: "#9C7A3C" }}>+{talentBonus}</span>
                                        </div>
                                    )}

                                    {progressionBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-ink-muted)]">Melhorias por nível</span>
                                            <span style={{ color: "var(--color-crimson)" }}>
                                                +{progressionBonus}
                                            </span>
                                        </div>
                                    )}

                                    <div className="my-2 border-t border-[var(--color-border)]/50" />

                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-ink-muted)]" style={cinzel}>Total</span>
                                        <span className="text-[var(--color-ink)]" style={cinzel}>{totalValue}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-ink-muted)]">Modificador</span>
                                        <span className="text-[var(--color-crimson)]" style={cinzel}>
                                            {formatModifier(modifier)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border p-5" style={card}>
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Resumo dos atributos
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {ABILITIES.map((ability) => {
                        const total = getTotalAbilityValue(ability.id);
                        const modifier = getAbilityModifier(total);

                        return (
                            <div key={ability.id} className="border p-3 text-center" style={nested}>
                                <p className="text-xs uppercase text-[var(--color-ink-soft)]" style={cinzel}>
                                    {ability.shortName}
                                </p>

                                <p className="mt-1 text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {total}
                                </p>

                                <p className="text-sm text-[var(--color-crimson)]">
                                    {formatModifier(modifier)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}