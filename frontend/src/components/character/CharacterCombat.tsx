import type { Dispatch, SetStateAction } from "react";

import type { CharacterFormData } from "../../types/character";

import {
    ABILITIES,
    getAbilityModifier,
} from "../../data/dnd/abilities";

import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_RACES } from "../../data/dnd/races";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getRaceDisplayName, getResolvedSpeed } from "../../data/dnd/raceResolution";
import { formatMeters } from "../../utils/units";

import {
    getBaseArmorClass,
    getCarryingCapacity,
    getInitialHitPoints,
    getInitiative,
    getPassivePerception,
    getSavingThrowModifier,
} from "../../data/dnd/combat";
import { formatMetricWeight } from "../../data/dnd/equipment";
import { getProficientSkills } from "../../data/dnd/skills";
import { getFeatSavingThrowAbilities } from "../../data/dnd/classFeatures";
import { CharacterAbilityTabs } from "./CharacterAbilityTabs";

interface CharacterCombatProps {
    data: CharacterFormData;
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };

export function CharacterCombat({ data, onChange }: CharacterCombatProps) {
    const primaryClassSelection = data.classes[0];

    const selectedClass = primaryClassSelection
        ? DND_CLASSES.find(
            (characterClass) => characterClass.id === primaryClassSelection.classId
        )
        : undefined;

    const selectedRace = DND_RACES.find((race) => race.id === data.raceId);

    const abilities = getFinalAbilities(data);

    const strength = abilities.strength;
    const dexterity = abilities.dexterity;
    const constitution = abilities.constitution;
    const wisdom = abilities.wisdom;

    const totalLevel =
        data.classes.length > 0
            ? data.classes.reduce(
                (total, characterClass) => total + characterClass.level,
                0
            )
            : 1;

    const proficiencyBonus = getProficiencyBonus(totalLevel);

    const calculatedHitPoints = selectedClass
        ? getInitialHitPoints(selectedClass, constitution)
        : 0;
    const hitPoints = data.hitPoints ?? calculatedHitPoints;

    const armorClass = getBaseArmorClass(
        dexterity,
        wisdom,
        constitution,
        selectedClass
    );
    const initiative = getInitiative(dexterity);
    const movement = getResolvedSpeed(data);
    const carryingCapacity = getCarryingCapacity(strength);

    const proficientSkills = getProficientSkills(data);

    const perceptionProficient = proficientSkills.has("perception");
    const savingThrowProficiencies = [
        ...(selectedClass?.savingThrowProficiencies ?? []),
        ...getFeatSavingThrowAbilities(data),
    ];

    const passivePerception = getPassivePerception(
        wisdom,
        perceptionProficient,
        proficiencyBonus
    );

    function formatModifier(value: number): string {
        return value >= 0 ? `+${value}` : `${value}`;
    }

    function getSkillModifier(skillId: "perception"): number {
        const abilityValue = abilities.wisdom;
        const abilityModifier = getAbilityModifier(abilityValue);
        const proficient = proficientSkills.has(skillId);

        return abilityModifier + (proficient ? proficiencyBonus : 0);
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Combate
                </h2>

                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Os valores abaixo são calculados automaticamente. Use as
                    sub-abas para ver habilidades de raça e de cada classe.
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CombatCard
                    title="Pontos de Vida"
                    value={hitPoints}
                    description={
                        selectedClass
                            ? data.hitPoints !== null
                                ? "Definido pelo jogador"
                                : `1d${selectedClass.hitDie} + CON`
                            : "Selecione uma classe"
                    }
                />

                <CombatCard
                    title="Classe de Armadura"
                    value={armorClass}
                    description={
                        selectedClass?.id === "monk"
                            ? "10 + DEX + SAB"
                            : selectedClass?.id === "barbarian"
                              ? "10 + DEX + CON"
                              : "10 + modificador de Destreza"
                    }
                />

                <CombatCard
                    title="Iniciativa"
                    value={formatModifier(initiative)}
                    description="Modificador de Destreza"
                />

                <CombatCard
                    title="Deslocamento"
                    value={formatMeters(movement)}
                    description={
                        selectedRace
                            ? getRaceDisplayName(data) || selectedRace.name
                            : "Padrão"
                    }
                />
            </div>

            <section className="mb-8">
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Informações de combate
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                    <InfoCard label="Nível total" value={totalLevel} />
                    <InfoCard label="Bônus de proficiência" value={formatModifier(proficiencyBonus)} />
                    <InfoCard label="Percepção passiva" value={passivePerception} />
                    <InfoCard label="Capacidade de carga" value={formatMetricWeight(carryingCapacity)} />
                    <InfoCard label="Dado de vida" value={selectedClass ? `d${selectedClass.hitDie}` : "-"} />
                    <InfoCard
                        label="Modificador de CON"
                        value={formatModifier(getAbilityModifier(constitution))}
                    />
                </div>
            </section>

            <section className="mb-8">
                <div className="mb-4">
                    <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Testes de resistência
                    </h3>

                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        As resistências proficientes recebem automaticamente o
                        bônus de proficiência.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    {ABILITIES.map((ability) => {
                        const value = abilities[ability.id];

                        const modifier = getSavingThrowModifier(
                            ability.id,
                            value,
                            savingThrowProficiencies,
                            proficiencyBonus
                        );

                        const proficient =
                            savingThrowProficiencies.includes(ability.id);

                        return (
                            <div
                                key={ability.id}
                                className="flex items-center justify-between border p-4"
                                style={{
                                    backgroundColor: proficient ? "var(--color-surface)" : "var(--color-parchment)",
                                    borderColor: proficient ? "var(--color-crimson)" : "var(--color-border)",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center border text-xs"
                                        style={{
                                            ...cinzel,
                                            backgroundColor: proficient ? "var(--color-crimson)" : "transparent",
                                            borderColor: proficient ? "var(--color-crimson-deep)" : "var(--color-border)",
                                            color: proficient ? "var(--color-parchment)" : "var(--color-ink-soft)",
                                        }}
                                    >
                                        {ability.shortName}
                                    </div>

                                    <div>
                                        <p className="text-[var(--color-ink)]" style={cinzel}>{ability.name}</p>
                                        <p className="text-xs text-[var(--color-ink-soft)]">
                                            {proficient ? "Proficiente" : "Não proficiente"}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    className="text-xl"
                                    style={{ ...cinzel, color: modifier >= 0 ? "var(--color-green)" : "#8B3A2E" }}
                                >
                                    {formatModifier(modifier)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mb-8">
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Atributos finais
                </h3>

                <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
                    Os valores abaixo já incluem os bônus provenientes da raça.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ABILITIES.map((ability) => {
                        const value = abilities[ability.id];
                        const modifier = getAbilityModifier(value);

                        return (
                            <div
                                key={ability.id}
                                className="flex items-center justify-between border p-4"
                                style={card}
                            >
                                <div>
                                    <p className="text-[var(--color-ink)]" style={cinzel}>{ability.name}</p>
                                    <p className="text-xs text-[var(--color-ink-soft)]">{ability.shortName}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {value}
                                    </p>

                                    <p
                                        className="text-sm"
                                        style={{ color: modifier >= 0 ? "var(--color-green)" : "#8B3A2E" }}
                                    >
                                        {formatModifier(modifier)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mb-8">
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Percepção
                </h3>

                <div className="border p-5" style={card}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                Percepção
                            </p>

                            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                                {perceptionProficient
                                    ? "Sabedoria + bônus de proficiência"
                                    : "Sabedoria"}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                {formatModifier(getSkillModifier("perception"))}
                            </p>

                            <p className="text-xs text-[var(--color-ink-soft)]">Percepção</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h3 className="mb-2 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Habilidades
                </h3>
                <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
                    Separe por raça e por cada classe do personagem. As habilidades
                    aparecem ordenadas por nível.
                </p>
                <CharacterAbilityTabs data={data} onChange={onChange} variant="wizard" />
            </section>
        </div>
    );
}

interface CombatCardProps {
    title: string;
    value: string | number;
    description: string;
}

function CombatCard({ title, value, description }: CombatCardProps) {
    return (
        <div className="border p-5" style={card}>
            <p className="text-sm text-[var(--color-ink-muted)]">{title}</p>
            <p className="mt-2 text-3xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                {value}
            </p>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{description}</p>
        </div>
    );
}

interface InfoCardProps {
    label: string;
    value: string | number;
}

function InfoCard({ label, value }: InfoCardProps) {
    return (
        <div className="border p-4" style={card}>
            <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
            <p className="mt-1 text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                {value}
            </p>
        </div>
    );
}
