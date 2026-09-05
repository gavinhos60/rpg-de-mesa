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

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "#DCCBA0", borderColor: "#6B4423" };
const nested = { backgroundColor: "#EBDFC4", borderColor: "#A67C3D" };

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

    function getRaceBonus(ability: Ability): number {
        return selectedRace?.abilityScoreIncrease?.[ability] ?? 0;
    }

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
        const baseValue = data.abilities[ability] ?? 10;
        const raceBonus = getRaceBonus(ability);
        const raceChoiceBonus = getRaceChoiceBonus(ability);
        const talentBonus = getTalentBonus(ability);

        return baseValue + raceBonus + raceChoiceBonus + talentBonus;
    }

    function updateAbility(ability: Ability, value: number) {
        onChange({
            ...data,
            abilities: {
                ...data.abilities,
                [ability]: value,
            },
        });
    }

    const hasRaceAbilityChoices = !!selectedRace?.abilityScoreChoices;
    const raceChoiceCount = selectedRace?.abilityScoreChoices?.count ?? 0;
    const selectedRaceAbilities = raceChoices["abilityScoreIncrease"] ?? [];
    const talentAbilityChoices = getTalentAbilityChoices();
    const selectedTalentAbility = getTalentSelectedAbility();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                    Atributos
                </h2>

                <p className="mt-2 text-[#5C4A38]">
                    Defina os valores dos seis atributos do personagem. Os
                    bônus raciais e do talento serão aplicados automaticamente.
                </p>
            </div>

            {selectedRace && (
                <div className="border p-5" style={card}>
                    <div className="mb-4">
                        <h3 className="text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Raça: {selectedRace.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Bônus concedidos pela sua raça.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(
                            selectedRace.abilityScoreIncrease ?? {}
                        ).map(([ability, bonus]) => {
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
                                    style={{ borderColor: "#3F5B34", color: "#3F5B34" }}
                                >
                                    {abilityData.name} +{bonus}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {hasRaceAbilityChoices && (
                <div className="border p-5" style={{ backgroundColor: "#DCCBA0", borderColor: "#7A2530" }}>
                    <div className="mb-5">
                        <h3 className="text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Escolhas de atributo da raça
                        </h3>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Escolha{" "}
                            <span className="text-[#7A2530]" style={cinzel}>
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
                                    <label className="mb-2 block text-sm text-[#5C4A38]" style={cinzel}>
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
                                        className="w-full border px-4 py-3 text-[#2A1D14] outline-none transition-colors focus:border-[#7A2530]"
                                        style={nested}
                                    >
                                        <option value="">Selecione um atributo</option>

                                        {selectedRace.abilityScoreChoices?.abilities.map(
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
                                                        {selectedRace.abilityScoreChoices?.amount})
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 border p-3 text-sm text-[#5C4A38]" style={nested}>
                        <span className="text-[#2A1D14]" style={cinzel}>Exemplo:</span>{" "}
                        um Meio-Elfo recebe +2 em Carisma e pode escolher dois
                        atributos diferentes para receber +1 em cada.
                    </div>
                </div>
            )}

            {selectedTalent && (
                <div className="border p-5" style={{ backgroundColor: "#DCCBA0", borderColor: "#9C7A3C" }}>
                    <div className="mb-4">
                        <h3 className="text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                            Talento Inicial: {selectedTalent.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Bônus de atributo concedidos pelo talento serão
                            aplicados abaixo.
                        </p>
                    </div>

                    {talentAbilityChoices.length > 0 && (
                        <div>
                            <label className="mb-2 block text-sm text-[#5C4A38]" style={cinzel}>
                                Atributo beneficiado pelo talento
                            </label>

                            <select
                                value={selectedTalentAbility ?? ""}
                                onChange={(event) =>
                                    updateTalentAbility(event.target.value as Ability)
                                }
                                className="w-full border px-4 py-3 text-[#2A1D14] outline-none transition-colors focus:border-[#9C7A3C]"
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
                            <div className="border p-3 text-sm text-[#5C4A38]" style={nested}>
                                Este talento possui um bônus específico de
                                atributo que será aplicado automaticamente.
                            </div>
                        )}
                </div>
            )}

            <div>
                <div className="mb-5">
                    <h3 className="text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        Valores dos atributos
                    </h3>

                    <p className="mt-1 text-sm text-[#5C4A38]">
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
                        const modifier = getAbilityModifier(totalValue);

                        return (
                            <div key={ability.id} className="border p-5" style={card}>
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                            {ability.name}
                                        </p>

                                        <p className="text-xs text-[#8A7860]">
                                            {ability.shortName}
                                        </p>
                                    </div>

                                    <div
                                        className="px-3 py-1.5 text-lg"
                                        style={{ ...cinzel, backgroundColor: "#7A2530", color: "#EBDFC4" }}
                                    >
                                        {formatModifier(modifier)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2 block text-xs text-[#8A7860]" style={cinzel}>
                                        Valor base
                                    </label>

                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={baseValue}
                                        onChange={(event) =>
                                            updateAbility(ability.id, Number(event.target.value))
                                        }
                                        className="w-full border px-4 py-3 text-center text-xl text-[#2A1D14] outline-none transition-colors focus:border-[#7A2530]"
                                        style={{ ...nested, fontFamily: "'Cinzel', serif" }}
                                    />
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#5C4A38]">Base</span>
                                        <span className="text-[#2A1D14]">{baseValue}</span>
                                    </div>

                                    {raceBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#5C4A38]">Raça</span>
                                            <span style={{ color: "#3F5B34" }}>+{raceBonus}</span>
                                        </div>
                                    )}

                                    {raceChoiceBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#5C4A38]">Escolha racial</span>
                                            <span style={{ color: "#3F5B34" }}>+{raceChoiceBonus}</span>
                                        </div>
                                    )}

                                    {talentBonus !== 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-[#5C4A38]">Talento</span>
                                            <span style={{ color: "#9C7A3C" }}>+{talentBonus}</span>
                                        </div>
                                    )}

                                    <div className="my-2 border-t border-[#A67C3D]/50" />

                                    <div className="flex justify-between">
                                        <span className="text-[#5C4A38]" style={cinzel}>Total</span>
                                        <span className="text-[#2A1D14]" style={cinzel}>{totalValue}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-[#5C4A38]">Modificador</span>
                                        <span className="text-[#7A2530]" style={cinzel}>
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
                <h3 className="mb-4 text-lg text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                    Resumo dos atributos
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {ABILITIES.map((ability) => {
                        const total = getTotalAbilityValue(ability.id);
                        const modifier = getAbilityModifier(total);

                        return (
                            <div key={ability.id} className="border p-3 text-center" style={nested}>
                                <p className="text-xs uppercase text-[#8A7860]" style={cinzel}>
                                    {ability.shortName}
                                </p>

                                <p className="mt-1 text-xl text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {total}
                                </p>

                                <p className="text-sm text-[#7A2530]">
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