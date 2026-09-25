import type { Ability, AsiSelection, CharacterFormData } from "../../types/character";
import { ABILITIES } from "../../data/dnd/abilities";
import { DND_CLASSES } from "../../data/dnd/classes";
import { getAsiMilestones } from "../../data/dnd/classFeatures";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { applyAsiSelectionUpdate } from "../../data/dnd/featCleanup";
import { DND_TALENTS, sortTalentsByName } from "../../data/dnd/talents";
import { CharacterTalentChoices } from "./CharacterTalentChoices";

interface CharacterAsiChoicesProps {
    data: CharacterFormData;
    onChange: (data: CharacterFormData) => void;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };
const nested = { backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" };

export function CharacterAsiChoices({
    data,
    onChange,
}: CharacterAsiChoicesProps) {
    const milestones = getAsiMilestones(data.classes);
    const validKeys = new Set(milestones.map((milestone) => milestone.key));
    const selectedFeatIds = new Set([
        data.talentId,
        ...Object.entries(data.asiSelections)
            .filter(([key]) => validKeys.has(key))
            .flatMap(([, selection]) =>
                selection.kind === "feat" ? [selection.featId] : []
            ),
    ]);

    function updateSelection(key: string, selection: AsiSelection) {
        onChange(applyAsiSelectionUpdate(data, key, selection));
    }

    if (milestones.length === 0) {
        return (
            <div className="border p-5" style={card}>
                <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Melhorias por nível
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    Nenhuma classe alcançou ainda um nível de Melhoria no Valor
                    de Habilidade.
                </p>
            </div>
        );
    }

    return (
        <section>
            <div className="mb-5">
                <h3 className="text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Melhorias por nível
                </h3>
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                    Cada marco pertence à classe que o concedeu. Escolha +2 em
                    um atributo, +1 em dois atributos diferentes ou um talento.
                </p>
            </div>

            <div className="space-y-5">
                {milestones.map((milestone, index) => {
                    const selection = data.asiSelections[milestone.key];
                    const characterClass = DND_CLASSES.find(
                        (item) => item.id === milestone.classId
                    );
                    const dataWithoutCurrent = {
                        ...data,
                        asiSelections: Object.fromEntries(
                            Object.entries(data.asiSelections).filter(
                                ([key]) => key !== milestone.key
                            )
                        ),
                    };
                    const valuesBefore = getFinalAbilities(dataWithoutCurrent);
                    const selectedTalent =
                        selection?.kind === "feat"
                            ? DND_TALENTS.find((talent) => talent.id === selection.featId)
                            : undefined;

                    return (
                        <div key={milestone.key} className="border p-5" style={card}>
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
                                        Melhoria {index + 1}
                                    </p>
                                    <h4 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                        {characterClass?.name ?? milestone.classId} — nível {milestone.classLevel}
                                    </h4>
                                </div>
                                <span
                                    className="px-3 py-1 text-xs"
                                    style={{
                                        ...cinzel,
                                        backgroundColor: selection ? "var(--color-green)" : "var(--color-crimson)",
                                        color: "var(--color-ink-inverse)",
                                    }}
                                >
                                    {selection ? "Definida" : "Pendente"}
                                </span>
                            </div>

                            <div className="mb-4 grid gap-2 sm:grid-cols-3">
                                <ModeButton
                                    active={selection?.kind === "ability" && selection.mode === "single"}
                                    label="+2 em um atributo"
                                    onClick={() =>
                                        updateSelection(milestone.key, {
                                            kind: "ability",
                                            mode: "single",
                                            abilities: [],
                                        })
                                    }
                                />
                                <ModeButton
                                    active={selection?.kind === "ability" && selection.mode === "split"}
                                    label="+1 em dois atributos"
                                    onClick={() =>
                                        updateSelection(milestone.key, {
                                            kind: "ability",
                                            mode: "split",
                                            abilities: [],
                                        })
                                    }
                                />
                                <ModeButton
                                    active={selection?.kind === "feat"}
                                    label="Escolher talento"
                                    onClick={() =>
                                        updateSelection(milestone.key, {
                                            kind: "feat",
                                            featId: "",
                                            featChoices: {},
                                        })
                                    }
                                />
                            </div>

                            {selection?.kind === "ability" && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {Array.from({
                                        length: selection.mode === "single" ? 1 : 2,
                                    }).map((_, abilityIndex) => (
                                        <label key={abilityIndex}>
                                            <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                                                Atributo {abilityIndex + 1}
                                            </span>
                                            <select
                                                required
                                                value={selection.abilities[abilityIndex] ?? ""}
                                                onChange={(event) => {
                                                    const abilities = [...selection.abilities];
                                                    abilities[abilityIndex] = event.target.value as Ability;
                                                    updateSelection(milestone.key, {
                                                        ...selection,
                                                        abilities,
                                                    });
                                                }}
                                                className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none"
                                                style={nested}
                                            >
                                                <option value="">Selecione</option>
                                                {ABILITIES.map((ability) => {
                                                    const alreadySelected =
                                                        selection.mode === "split" &&
                                                        selection.abilities.some(
                                                            (selected, selectedIndex) =>
                                                                selected === ability.id &&
                                                                selectedIndex !== abilityIndex
                                                        );
                                                    const maximum =
                                                        selection.mode === "single" ? 18 : 19;
                                                    return (
                                                        <option
                                                            key={ability.id}
                                                            value={ability.id}
                                                            disabled={
                                                                alreadySelected ||
                                                                valuesBefore[ability.id] > maximum
                                                            }
                                                        >
                                                            {ability.name} ({valuesBefore[ability.id]} →{" "}
                                                            {Math.min(20, valuesBefore[ability.id] +
                                                                (selection.mode === "single" ? 2 : 1))})
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {selection?.kind === "feat" && (
                                <div>
                                    <label>
                                        <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                                            Talento
                                        </span>
                                        <select
                                            required
                                            value={selection.featId}
                                            onChange={(event) =>
                                                updateSelection(milestone.key, {
                                                    kind: "feat",
                                                    featId: event.target.value,
                                                    featChoices: {},
                                                })
                                            }
                                            className="w-full border px-4 py-3 text-[var(--color-ink)] outline-none"
                                            style={nested}
                                        >
                                            <option value="">Selecione um talento</option>
                                            {sortTalentsByName(DND_TALENTS).map((talent) => (
                                                <option
                                                    key={talent.id}
                                                    value={talent.id}
                                                    disabled={
                                                        talent.id !== selection.featId &&
                                                        selectedFeatIds.has(talent.id)
                                                    }
                                                >
                                                    {talent.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    {selectedTalent && (
                                        <div className="mt-4 border p-4" style={nested}>
                                            <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                                                {selectedTalent.name}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
                                                {selectedTalent.description}
                                            </p>
                                            <CharacterTalentChoices
                                                talent={selectedTalent}
                                                data={data}
                                                choiceValues={selection.featChoices}
                                                onChange={(choiceId, values) =>
                                                    updateSelection(milestone.key, {
                                                        ...selection,
                                                        featChoices: {
                                                            ...selection.featChoices,
                                                            [choiceId]: values,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ModeButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="border px-3 py-3 text-sm"
            style={{
                borderColor: active ? "var(--color-crimson-deep)" : "var(--color-border)",
                backgroundColor: active ? "var(--color-crimson)" : "var(--color-parchment)",
                color: active ? "var(--color-parchment)" : "var(--color-ink)",
            }}
        >
            {label}
        </button>
    );
}
