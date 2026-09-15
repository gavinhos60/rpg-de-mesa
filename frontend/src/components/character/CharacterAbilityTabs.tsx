import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { CharacterFormData, CharacterRace } from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_RACES } from "../../data/dnd/races";
import {
    getRaceDisplayName,
    getResolvedRaceTraits,
    getResolvedSkillProficiencies,
    getResolvedSpeed,
    getSelectedSubrace,
} from "../../data/dnd/raceResolution";
import { formatMeters } from "../../utils/units";
import {
    getClassResourceSummaries,
    getUnlockedClassAbilities,
    type ClassAbility,
} from "../../data/dnd/classAbilities";
import {
    FOUR_ELEMENTS_DISCIPLINE_KEY,
    getChoosableElementalDisciplines,
    getElementalDiscipline,
    getFixedElementalDisciplines,
    getFourElementsDisciplineLimit,
    getSelectedElementalDisciplines,
} from "../../data/dnd/elementalDisciplines";

const cinzel = { fontFamily: "'Cinzel', serif" } as const;

type AbilityTabId = "race" | `class:${string}`;

interface AbilityTabsProps {
    data: CharacterFormData;
    onChange?: Dispatch<SetStateAction<CharacterFormData>>;
    /** Visual denser for the final sheet parchment look */
    variant?: "wizard" | "sheet";
    /** Clique em traço/habilidade (ficha em jogo). */
    onUseFeature?: (name: string, description: string) => void;
}

export function CharacterAbilityTabs({
    data,
    onChange,
    variant = "wizard",
    onUseFeature,
}: AbilityTabsProps) {
    const race = DND_RACES.find((item) => item.id === data.raceId);
    const subrace = getSelectedSubrace(data);
    const classTabs = data.classes.map((selection, index) => {
        const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
        const subclass = characterClass?.subclasses.find(
            (item) => item.id === selection.subclassId
        );
        return {
            id: `class:${selection.classId}:${index}` as AbilityTabId,
            classId: selection.classId,
            subclassId: selection.subclassId,
            level: selection.level,
            label: characterClass?.name ?? selection.classId,
            subclassName: subclass?.name,
        };
    });

    const tabs: Array<{ id: AbilityTabId; label: string; subtitle?: string }> = [
        {
            id: "race",
            label: "Raça",
            subtitle: getRaceDisplayName(data) || race?.name,
        },
        ...classTabs.map((tab) => ({
            id: tab.id,
            label: tab.label,
            subtitle: tab.subclassName
                ? `${tab.subclassName} · Nv. ${tab.level}`
                : `Nv. ${tab.level}`,
        })),
    ];

    const [activeTab, setActiveTab] = useState<AbilityTabId>(
        tabs[0]?.id ?? "race"
    );
    const resolvedTab = tabs.some((tab) => tab.id === activeTab)
        ? activeTab
        : (tabs[0]?.id ?? "race");

    const card =
        variant === "sheet"
            ? {
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment-soft)",
              }
            : {
                  borderColor: "var(--color-border-strong)",
                  backgroundColor: "var(--color-surface)",
              };

    return (
        <section>
            <div
                className="mb-4 flex overflow-x-auto border-y"
                style={{ borderColor: variant === "sheet" ? "var(--color-border)" : "var(--color-border-strong)" }}
            >
                {tabs.map((tab) => {
                    const active = tab.id === resolvedTab;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className="min-w-fit flex-1 px-4 py-3 text-left transition-colors"
                            style={{
                                ...cinzel,
                                backgroundColor: active
                                    ? variant === "sheet"
                                        ? "var(--color-crimson)"
                                        : "var(--color-crimson)"
                                    : "transparent",
                                color: active ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
                            }}
                        >
                            <span className="block text-sm">{tab.label}</span>
                            {tab.subtitle && (
                                <span
                                    className="mt-0.5 block text-[11px]"
                                    style={{ color: active ? "var(--color-ink-inverse)" : "var(--color-ink-soft)" }}
                                >
                                    {tab.subtitle}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {resolvedTab === "race" ? (
                <RaceAbilitiesPanel
                    data={data}
                    race={race}
                    subraceName={subrace?.name}
                    card={card}
                    onUseFeature={onUseFeature}
                />
            ) : (
                classTabs
                    .filter((tab) => tab.id === resolvedTab)
                    .map((tab) => (
                        <ClassAbilitiesPanel
                            key={tab.id}
                            data={data}
                            onChange={onChange}
                            classId={tab.classId}
                            subclassId={tab.subclassId}
                            level={tab.level}
                            className={tab.label}
                            subclassName={tab.subclassName}
                            card={card}
                            variant={variant}
                            onUseFeature={onUseFeature}
                        />
                    ))
            )}
        </section>
    );
}

function RaceAbilitiesPanel({
    data,
    race,
    subraceName,
    card,
    onUseFeature,
}: {
    data: CharacterFormData;
    race: CharacterRace | undefined;
    subraceName?: string;
    card: { borderColor: string; backgroundColor: string };
    onUseFeature?: (name: string, description: string) => void;
}) {
    if (!race) {
        return (
            <p className="text-sm italic text-[var(--color-ink-muted)]">
                Selecione uma raça na etapa Identidade para ver os traços raciais.
            </p>
        );
    }

    const traits = getResolvedRaceTraits(data);
    const skillProficiencies = getResolvedSkillProficiencies(data);

    return (
        <div>
            <div className="mb-4 border p-4" style={card}>
                <p className="text-sm text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    {getRaceDisplayName(data) || race.name}
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                    Deslocamento {formatMeters(getResolvedSpeed(data, race.speed ?? 30))}
                    {race.languages?.length
                        ? ` · Idiomas: ${race.languages.join(", ")}`
                        : ""}
                </p>
                {subraceName && (
                    <p className="mt-2 text-xs text-[var(--color-ink-muted)]">Subraça: {subraceName}</p>
                )}
                {skillProficiencies.length > 0 && (
                    <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                        Proficiências fixas: {skillProficiencies.join(", ")}
                    </p>
                )}
            </div>

            {traits.length === 0 ? (
                <p className="text-sm italic text-[var(--color-ink-muted)]">
                    Esta raça não possui traços adicionais catalogados.
                </p>
            ) : (
                <div className="space-y-3">
                    {traits.map((trait) => {
                        const body = (
                            <>
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {trait.name}
                                    </p>
                                    <span
                                        className="px-2 py-1 text-xs"
                                        style={{ ...cinzel, backgroundColor: "#5C4A1E", color: "var(--color-ink-inverse)" }}
                                    >
                                        Raça
                                    </span>
                                </div>
                                <p className="text-sm leading-6 text-[var(--color-ink-muted)]">{trait.description}</p>
                                {onUseFeature && (
                                    <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--color-crimson)]">
                                        Clique para enviar ao chat
                                    </p>
                                )}
                            </>
                        );
                        if (onUseFeature) {
                            return (
                                <button
                                    key={trait.id}
                                    type="button"
                                    onClick={() => onUseFeature(trait.name, trait.description)}
                                    className="block w-full border p-4 text-left transition hover:border-[var(--color-crimson)]"
                                    style={card}
                                >
                                    {body}
                                </button>
                            );
                        }
                        return (
                            <article key={trait.id} className="border p-4" style={card}>
                                {body}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ClassAbilitiesPanel({
    data,
    onChange,
    classId,
    subclassId,
    level,
    className,
    subclassName,
    card,
    variant,
    onUseFeature,
}: {
    data: CharacterFormData;
    onChange?: Dispatch<SetStateAction<CharacterFormData>>;
    classId: string;
    subclassId: string;
    level: number;
    className: string;
    subclassName?: string;
    card: { borderColor: string; backgroundColor: string };
    variant: "wizard" | "sheet";
    onUseFeature?: (name: string, description: string) => void;
}) {
    const abilities = getUnlockedClassAbilities(classId, subclassId, level)
        .filter((ability) => !ability.id.includes("-asi-"))
        .slice()
        .sort((a, b) =>
            a.level !== b.level
                ? a.level - b.level
                : Number(Boolean(a.subclassId)) - Number(Boolean(b.subclassId))
        );

    const resources = getClassResourceSummaries(classId, level);
    const showFourElements =
        classId === "monk" && subclassId === "way-of-four-elements" && level >= 3;

    return (
        <div>
            {resources.length > 0 && (
                <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <div key={resource.name} className="border p-4" style={card}>
                            <p className="text-xs text-[var(--color-ink-soft)]">{className}</p>
                            <p className="mt-1 text-[var(--color-ink)]" style={cinzel}>
                                {resource.name}
                            </p>
                            <p
                                className="mt-2 text-2xl text-[var(--color-crimson)]"
                                style={{ ...cinzel, fontWeight: 600 }}
                            >
                                {resource.value}
                            </p>
                            {resource.detail && (
                                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{resource.detail}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showFourElements && (
                <FourElementsPicker
                    data={data}
                    onChange={onChange}
                    monkLevel={level}
                    card={card}
                    readOnly={!onChange || variant === "sheet"}
                />
            )}

            {abilities.length === 0 ? (
                <p className="text-sm italic text-[var(--color-ink-muted)]">
                    Nenhuma habilidade desbloqueada para {className} neste nível.
                </p>
            ) : (
                <div className="space-y-3">
                    {abilities.map((ability) => (
                        <AbilityCard
                            key={ability.id}
                            ability={ability}
                            className={className}
                            subclassName={subclassName}
                            card={card}
                            onUseFeature={onUseFeature}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FourElementsPicker({
    data,
    onChange,
    monkLevel,
    card,
    readOnly,
}: {
    data: CharacterFormData;
    onChange?: Dispatch<SetStateAction<CharacterFormData>>;
    monkLevel: number;
    card: { borderColor: string; backgroundColor: string };
    readOnly: boolean;
}) {
    const limit = getFourElementsDisciplineLimit(monkLevel);
    const selected = getSelectedElementalDisciplines(data.featureChoices);
    const fixed = getFixedElementalDisciplines();
    const options = getChoosableElementalDisciplines(monkLevel);

    function toggle(disciplineId: string) {
        if (!onChange || readOnly) return;

        onChange((previous) => {
            const current = getSelectedElementalDisciplines(previous.featureChoices);
            const next = current.includes(disciplineId)
                ? current.filter((id) => id !== disciplineId)
                : current.length >= limit
                    ? current
                    : [...current, disciplineId];

            return {
                ...previous,
                featureChoices: {
                    ...previous.featureChoices,
                    [FOUR_ELEMENTS_DISCIPLINE_KEY]: next,
                },
            };
        });
    }

    return (
        <div className="mb-6 border p-4" style={card}>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h4 className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Discípulo dos Elementos
                    </h4>
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        Sintonização Elemental é permanente. Escolha mais {limit} disciplina
                        {limit === 1 ? "" : "s"} disponíveis para o seu nível.
                    </p>
                </div>
                <span
                    className="px-3 py-1 text-sm"
                    style={{
                        ...cinzel,
                        backgroundColor: selected.length >= limit ? "var(--color-green)" : "var(--color-crimson)",
                        color: "var(--color-ink-inverse)",
                    }}
                >
                    {selected.length} / {limit}
                </span>
            </div>

            <div className="mb-4 space-y-2">
                {fixed.map((discipline) => (
                    <div
                        key={discipline.id}
                        className="border px-3 py-2"
                        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                {discipline.name}
                            </p>
                            <span className="text-xs text-[var(--color-ink-soft)]">Fixa · Ki {discipline.kiCost}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                            {discipline.description}
                        </p>
                    </div>
                ))}
            </div>

            {readOnly ? (
                <ul className="space-y-2">
                    {selected.length === 0 ? (
                        <li className="text-sm italic text-[var(--color-ink-muted)]">
                            Nenhuma disciplina adicional selecionada.
                        </li>
                    ) : (
                        selected.map((id) => {
                            const discipline = getElementalDiscipline(id);
                            if (!discipline) return null;
                            return (
                                <li
                                    key={id}
                                    className="border px-3 py-2"
                                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                            {discipline.name}
                                        </p>
                                        <span className="text-xs text-[var(--color-ink-soft)]">
                                            Nv. {discipline.minLevel}+ · Ki {discipline.kiCost}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                                        {discipline.description}
                                    </p>
                                </li>
                            );
                        })
                    )}
                </ul>
            ) : (
                <div className="grid gap-2 md:grid-cols-2">
                    {options.map((discipline) => {
                        const isSelected = selected.includes(discipline.id);
                        const disabled = !isSelected && selected.length >= limit;

                        return (
                            <button
                                key={discipline.id}
                                type="button"
                                disabled={disabled}
                                onClick={() => toggle(discipline.id)}
                                className="border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                                style={{
                                    borderColor: isSelected ? "var(--color-crimson)" : "var(--color-border)",
                                    backgroundColor: isSelected ? "var(--color-surface)" : "var(--color-parchment)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm text-[var(--color-ink)]" style={cinzel}>
                                        {discipline.name}
                                    </span>
                                    <span className="text-xs text-[var(--color-crimson)]">
                                        {isSelected ? "✓" : "+"}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                                    Nv. {discipline.minLevel}+ · Ki {discipline.kiCost}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                                    {discipline.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function AbilityCard({
    ability,
    className,
    subclassName,
    card,
    onUseFeature,
}: {
    ability: ClassAbility;
    className: string;
    subclassName?: string;
    card: { borderColor: string; backgroundColor: string };
    onUseFeature?: (name: string, description: string) => void;
}) {
    const body = (
        <>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        {ability.name}
                    </p>
                    <p className="text-xs text-[var(--color-ink-soft)]">
                        {className}
                        {ability.subclassId && subclassName ? ` · ${subclassName}` : ""}
                        {ability.source ? ` · ${ability.source}` : ""}
                    </p>
                </div>
                <span
                    className="px-2 py-1 text-xs"
                    style={{
                        ...cinzel,
                        backgroundColor: ability.subclassId ? "var(--color-green)" : "var(--color-crimson)",
                        color: "var(--color-ink-inverse)",
                    }}
                >
                    Nível {ability.level}
                </span>
            </div>
            <p className="text-sm leading-6 text-[var(--color-ink-muted)]">{ability.description}</p>
            {onUseFeature && (
                <p className="mt-2 text-[10px] uppercase tracking-wide text-[var(--color-crimson)]">
                    Clique para enviar ao chat
                </p>
            )}
        </>
    );

    if (onUseFeature) {
        return (
            <button
                type="button"
                onClick={() => onUseFeature(ability.name, ability.description)}
                className="block w-full border p-4 text-left transition hover:border-[var(--color-crimson)]"
                style={card}
            >
                {body}
            </button>
        );
    }

    return (
        <article className="border p-4" style={card}>
            {body}
        </article>
    );
}
