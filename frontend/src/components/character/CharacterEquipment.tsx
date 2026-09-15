import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type {
    CharacterFormData,
    EquipmentStack,
} from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { DND_BACKGROUNDS } from "../../data/dnd/backgrounds";
import {
    DND_EQUIPMENT,
    formatMetricWeight,
    getEquipmentItem,
} from "../../data/dnd/equipment";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getCarryingCapacity } from "../../data/dnd/combat";

interface CharacterEquipmentProps {
    data: CharacterFormData;
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

interface InventoryRow {
    itemId: string;
    classQuantity: number;
    manualQuantity: number;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };

export function CharacterEquipment({
    data,
    onChange,
}: CharacterEquipmentProps) {
    const [query, setQuery] = useState("");
    const [isListOpen, setIsListOpen] = useState(false);

    const primaryClassId = data.classes[0]?.classId ?? "";
    const selectedClass = DND_CLASSES.find(
        (characterClass) => characterClass.id === primaryClassId
    );
    const startingEquipment = selectedClass?.startingEquipment;

    useEffect(() => {
        if (!startingEquipment || data.equipment.classId === primaryClassId) {
            return;
        }

        const defaults = Object.fromEntries(
            startingEquipment.choices.map((choice) => [
                choice.id,
                choice.alternatives[0]?.id ?? "",
            ])
        );

        onChange((previous) => ({
            ...previous,
            equipment: {
                ...previous.equipment,
                classId: primaryClassId,
                choiceSelections: defaults,
            },
        }));
    }, [data.equipment.classId, onChange, primaryClassId, startingEquipment]);

    const classItems = useMemo(() => {
        if (!startingEquipment) {
            return [];
        }

        const result = [...startingEquipment.fixed];

        for (const choice of startingEquipment.choices) {
            const selectedId =
                data.equipment.choiceSelections[choice.id] ??
                choice.alternatives[0]?.id;
            const selected = choice.alternatives.find(
                (alternative) => alternative.id === selectedId
            );
            if (selected) result.push(...selected.items);
        }

        return result;
    }, [data.equipment.choiceSelections, startingEquipment]);
    const backgroundItems = useMemo(() => {
        const background = DND_BACKGROUNDS.find(
            (item) => item.id === data.backgroundId
        );
        if (!background) return [];

        const chosenTools = background.equipmentFromToolChoice
            ? data.backgroundChoices.tools
                .filter(Boolean)
                .map((itemId) => ({ itemId, quantity: 1 }))
            : [];

        return [...background.startingEquipment, ...chosenTools];
    }, [data.backgroundChoices.tools, data.backgroundId]);

    const inventory = useMemo(
        () => consolidateInventory(
            [...classItems, ...backgroundItems],
            data.equipment.manualItems
        ),
        [backgroundItems, classItems, data.equipment.manualItems]
    );

    const weight = inventory.reduce((total, row) => {
        const equipment = getEquipmentItem(row.itemId);
        return total + (equipment?.weight ?? 0) *
            (row.classQuantity + row.manualQuantity);
    }, 0);

    const strength = getFinalAbilities(data).strength;
    const carryingCapacity = getCarryingCapacity(strength);
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    const matchingItems = DND_EQUIPMENT.filter((equipment) =>
        equipment.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
    );
    const exactMatch = matchingItems.find(
        (equipment) => equipment.name.toLocaleLowerCase("pt-BR") === normalizedQuery
    );
    const selectedMatch = exactMatch
        ?? (matchingItems.length === 1 ? matchingItems[0] : undefined);

    function choose(choiceId: string, alternativeId: string) {
        onChange((previous) => ({
            ...previous,
            equipment: {
                ...previous.equipment,
                choiceSelections: {
                    ...previous.equipment.choiceSelections,
                    [choiceId]: alternativeId,
                },
            },
        }));
    }

    function changeManualItem(itemId: string, amount: number) {
        onChange((previous) => {
            const current = previous.equipment.manualItems.find(
                (entry) => entry.itemId === itemId
            );
            const quantity = Math.max(0, (current?.quantity ?? 0) + amount);
            const withoutItem = previous.equipment.manualItems.filter(
                (entry) => entry.itemId !== itemId
            );

            return {
                ...previous,
                equipment: {
                    ...previous.equipment,
                    manualItems: quantity > 0
                        ? [...withoutItem, { itemId, quantity }]
                        : withoutItem,
                },
            };
        });
    }

    if (!selectedClass || !startingEquipment) {
        return (
            <div className="border p-8 text-center" style={card}>
                <p className="text-[var(--color-ink)]" style={cinzel}>
                    Selecione uma classe na etapa Identidade
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    O equipamento inicial será preparado automaticamente.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Equipamentos de {selectedClass.name}
                </h2>
                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Escolha o conjunto inicial do PHB 2014 e acrescente outros
                    itens ao inventário.
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <SummaryCard label="Itens distintos" value={inventory.length} />
                <SummaryCard label="Peso carregado" value={formatMetricWeight(weight)} />
                <SummaryCard label="Capacidade" value={formatMetricWeight(carryingCapacity)} />
            </div>

            <section className="mb-8">
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Escolhas da classe
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {startingEquipment.choices.map((choice) => {
                        const selectedId =
                            data.equipment.choiceSelections[choice.id] ??
                            choice.alternatives[0]?.id ??
                            "";

                        return (
                            <label key={choice.id} className="border p-4" style={card}>
                                <span className="mb-2 block text-sm text-[var(--color-ink-muted)]">
                                    {choice.label}
                                </span>
                                <select
                                    required
                                    value={selectedId}
                                    onChange={(event) => choose(choice.id, event.target.value)}
                                    className="w-full border bg-[var(--color-parchment)] px-3 py-2 text-[var(--color-ink)] outline-none"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    {choice.alternatives.map((alternative) => (
                                        <option key={alternative.id} value={alternative.id}>
                                            {alternative.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        );
                    })}
                </div>
            </section>

            <section className="mb-8">
                <div className="mb-4">
                    <h3 className="text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Adicionar equipamento
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                        Digite para buscar ou escolha um item da lista.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <input
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setIsListOpen(true);
                            }}
                            onFocus={() => setIsListOpen(true)}
                            onBlur={() => {
                                window.setTimeout(() => setIsListOpen(false), 120);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && selectedMatch) {
                                    event.preventDefault();
                                    changeManualItem(selectedMatch.id, 1);
                                    setQuery("");
                                    setIsListOpen(false);
                                }
                            }}
                            placeholder="Buscar ou selecionar um equipamento..."
                            className="w-full border bg-[var(--color-parchment)] px-4 py-3 text-[var(--color-ink)] outline-none"
                            style={{ borderColor: "var(--color-border-strong)" }}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={isListOpen}
                            aria-controls="equipment-options"
                        />
                        {isListOpen && (
                            <ul
                                id="equipment-options"
                                role="listbox"
                                className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto border bg-[var(--color-parchment)]"
                                style={{ borderColor: "var(--color-border-strong)" }}
                            >
                                {matchingItems.map((equipment) => (
                                    <li key={equipment.id}>
                                        <button
                                            type="button"
                                            role="option"
                                            className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-[var(--color-surface)]"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => {
                                                setQuery(equipment.name);
                                                setIsListOpen(false);
                                            }}
                                        >
                                            <span>{equipment.name}</span>
                                            <span className="text-xs text-[var(--color-ink-soft)]">
                                                {formatMetricWeight(equipment.weight)}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                                {matchingItems.length === 0 && (
                                    <li className="px-4 py-3 text-sm italic text-[var(--color-ink-muted)]">
                                        Nenhum equipamento encontrado.
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                    <button
                        type="button"
                        disabled={!selectedMatch}
                        onClick={() => {
                            if (!selectedMatch) {
                                return;
                            }

                            changeManualItem(selectedMatch.id, 1);
                            setQuery("");
                            setIsListOpen(false);
                        }}
                        className="border bg-[var(--color-crimson)] px-6 py-3 text-[var(--color-ink-inverse)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ ...cinzel, borderColor: "var(--color-crimson-deep)" }}
                    >
                        Adicionar
                    </button>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Inventário
                </h3>
                <div className="space-y-3">
                    {inventory.map((row) => {
                        const equipment = getEquipmentItem(row.itemId);
                        if (!equipment) return null;
                        const total = row.classQuantity + row.manualQuantity;

                        return (
                            <div
                                key={row.itemId}
                                className="flex flex-wrap items-center justify-between gap-4 border p-4"
                                style={card}
                            >
                                <div>
                                    <p className="text-[var(--color-ink)]" style={cinzel}>{equipment.name}</p>
                                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                                        {row.classQuantity > 0 && `${row.classQuantity} inicial`}
                                        {row.classQuantity > 0 && row.manualQuantity > 0 && " • "}
                                        {row.manualQuantity > 0 && `${row.manualQuantity} manual`}
                                        {" • "}{formatMetricWeight(equipment.weight * total)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {row.manualQuantity > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => changeManualItem(row.itemId, -1)}
                                            className="h-8 w-8 border text-[var(--color-crimson)]"
                                            style={{ borderColor: "var(--color-border)" }}
                                            aria-label={`Remover um ${equipment.name}`}
                                        >
                                            −
                                        </button>
                                    )}
                                    <span className="min-w-8 text-center text-lg" style={cinzel}>
                                        {total}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => changeManualItem(row.itemId, 1)}
                                        className="h-8 w-8 border text-[var(--color-green)]"
                                        style={{ borderColor: "var(--color-border)" }}
                                        aria-label={`Adicionar um ${equipment.name}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {(data.equipment.customItems ?? []).length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h4 className="text-base text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            Itens especiais
                        </h4>
                        {(data.equipment.customItems ?? []).map((item) => (
                            <div key={item.id} className="border p-4" style={card}>
                                <p className="text-[var(--color-ink)]" style={cinzel}>
                                    {item.name}
                                    {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                                </p>
                                {item.description ? (
                                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{item.description}</p>
                                ) : null}
                                {item.grantedByName ? (
                                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                                        Concedido por {item.grantedByName}
                                    </p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function consolidateInventory(
    classItems: EquipmentStack[],
    manualItems: EquipmentStack[]
): InventoryRow[] {
    const rows = new Map<string, InventoryRow>();

    for (const entry of classItems) {
        const row = rows.get(entry.itemId) ?? {
            itemId: entry.itemId,
            classQuantity: 0,
            manualQuantity: 0,
        };
        row.classQuantity += entry.quantity;
        rows.set(entry.itemId, row);
    }

    for (const entry of manualItems) {
        const row = rows.get(entry.itemId) ?? {
            itemId: entry.itemId,
            classQuantity: 0,
            manualQuantity: 0,
        };
        row.manualQuantity += entry.quantity;
        rows.set(entry.itemId, row);
    }

    return [...rows.values()];
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="border p-4" style={card}>
            <p className="text-sm text-[var(--color-ink-muted)]">{label}</p>
            <p className="mt-1 text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                {value}
            </p>
        </div>
    );
}
