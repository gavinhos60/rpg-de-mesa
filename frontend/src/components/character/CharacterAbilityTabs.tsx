import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { CharacterFormData, CharacterRace } from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_RACES } from "../../data/dnd/races";
import {
    getRaceDisplayName,
    getResolvedRaceTraits,
    getResolvedSkillProficiencies,
    getSelectedSubrace,
} from "../../data/dnd/raceResolution";
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
}

export function CharacterAbilityTabs({
    data,
    onChange,
    variant = "wizard",
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
            ? { borderColor: "#C09A5A", backgroundColor: "#F3E7C3" }
            : { borderColor: "#6B4423", backgroundColor: "#DCCBA0" };

    return (
        <section>
            <div
                className="mb-4 flex overflow-x-auto border-y"
                style={{ borderColor: variant === "sheet" ? "#A67C3D" : "#6B4423" }}
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
                                        ? "#7A2530"
                                        : "#7A2530"
                                    : "transparent",
                                color: active ? "#F3E6C4" : "#5C4A38",
                            }}
                        >
                            <span className="block text-sm">{tab.label}</span>
                            {tab.subtitle && (
                                <span
                                    className="mt-0.5 block text-[11px]"
                                    style={{ color: active ? "#E8C9A0" : "#8A7860" }}
                                >
                                    {tab.subtitle}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {resolvedTab === "race" ? (
                <RaceAbilitiesPanel data={data} race={race} subraceName={subrace?.name} card={card} />
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
}: {
    data: CharacterFormData;
    race: CharacterRace | undefined;
    subraceName?: string;
    card: { borderColor: string; backgroundColor: string };
}) {
    if (!race) {
        return (
            <p className="text-sm italic text-[#5C4A38]">
                Selecione uma raça na etapa Identidade para ver os traços raciais.
            </p>
        );
    }

    const traits = getResolvedRaceTraits(data);
    const skillProficiencies = getResolvedSkillProficiencies(data);

    return (
        <div>
            <div className="mb-4 border p-4" style={card}>
                <p className="text-sm text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                    {getRaceDisplayName(data) || race.name}
                </p>
                <p className="mt-1 text-xs text-[#8A7860]">
                    Deslocamento {race.speed ?? 30} ft
                    {race.languages?.length
                        ? ` · Idiomas: ${race.languages.join(", ")}`
                        : ""}
                </p>
                {subraceName && (
                    <p className="mt-2 text-xs text-[#5C4A38]">Subraça: {subraceName}</p>
                )}
                {skillProficiencies.length > 0 && (
                    <p className="mt-2 text-xs text-[#5C4A38]">
                        Proficiências fixas: {skillProficiencies.join(", ")}
                    </p>
                )}
            </div>

            {traits.length === 0 ? (
                <p className="text-sm italic text-[#5C4A38]">
                    Esta raça não possui traços adicionais catalogados.
                </p>
            ) : (
                <div className="space-y-3">
                    {traits.map((trait) => (
                        <article key={trait.id} className="border p-4" style={card}>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                                    {trait.name}
                                </p>
                                <span
                                    className="px-2 py-1 text-xs"
                                    style={{ ...cinzel, backgroundColor: "#5C4A1E", color: "#EBDFC4" }}
                                >
                                    Raça
                                </span>
                            </div>
                            <p className="text-sm leading-6 text-[#5C4A38]">{trait.description}</p>
                        </article>
                    ))}
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
                            <p className="text-xs text-[#8A7860]">{className}</p>
                            <p className="mt-1 text-[#2A1D14]" style={cinzel}>
                                {resource.name}
                            </p>
                            <p
                                className="mt-2 text-2xl text-[#7A2530]"
                                style={{ ...cinzel, fontWeight: 600 }}
                            >
                                {resource.value}
                            </p>
                            {resource.detail && (
                                <p className="mt-1 text-xs text-[#8A7860]">{resource.detail}</p>
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
                <p className="text-sm italic text-[#5C4A38]">
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
                    <h4 className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        Discípulo dos Elementos
                    </h4>
                    <p className="mt-1 text-sm text-[#5C4A38]">
                        Sintonização Elemental é permanente. Escolha mais {limit} disciplina
                        {limit === 1 ? "" : "s"} disponíveis para o seu nível.
                    </p>
                </div>
                <span
                    className="px-3 py-1 text-sm"
                    style={{
                        ...cinzel,
                        backgroundColor: selected.length >= limit ? "#3F5B34" : "#7A2530",
                        color: "#EBDFC4",
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
                        style={{ borderColor: "#A67C3D", backgroundColor: "#EBDFC4" }}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-[#2A1D14]" style={cinzel}>
                                {discipline.name}
                            </p>
                            <span className="text-xs text-[#8A7860]">Fixa · Ki {discipline.kiCost}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[#5C4A38]">
                            {discipline.description}
                        </p>
                    </div>
                ))}
            </div>

            {readOnly ? (
                <ul className="space-y-2">
                    {selected.length === 0 ? (
                        <li className="text-sm italic text-[#5C4A38]">
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
                                    style={{ borderColor: "#A67C3D", backgroundColor: "#EBDFC4" }}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm text-[#2A1D14]" style={cinzel}>
                                            {discipline.name}
                                        </p>
                                        <span className="text-xs text-[#8A7860]">
                                            Nv. {discipline.minLevel}+ · Ki {discipline.kiCost}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-[#5C4A38]">
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
                                    borderColor: isSelected ? "#7A2530" : "#A67C3D",
                                    backgroundColor: isSelected ? "#DCCBA0" : "#EBDFC4",
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm text-[#2A1D14]" style={cinzel}>
                                        {discipline.name}
                                    </span>
                                    <span className="text-xs text-[#7A2530]">
                                        {isSelected ? "✓" : "+"}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[#8A7860]">
                                    Nv. {discipline.minLevel}+ · Ki {discipline.kiCost}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#5C4A38]">
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
}: {
    ability: ClassAbility;
    className: string;
    subclassName?: string;
    card: { borderColor: string; backgroundColor: string };
}) {
    return (
        <article className="border p-4" style={card}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="text-[#2A1D14]" style={{ ...cinzel, fontWeight: 600 }}>
                        {ability.name}
                    </p>
                    <p className="text-xs text-[#8A7860]">
                        {className}
                        {ability.subclassId && subclassName ? ` · ${subclassName}` : ""}
                        {ability.source ? ` · ${ability.source}` : ""}
                    </p>
                </div>
                <span
                    className="px-2 py-1 text-xs"
                    style={{
                        ...cinzel,
                        backgroundColor: ability.subclassId ? "#3F5B34" : "#7A2530",
                        color: "#EBDFC4",
                    }}
                >
                    Nível {ability.level}
                </span>
            </div>
            <p className="text-sm leading-6 text-[#5C4A38]">{ability.description}</p>
        </article>
    );
}
