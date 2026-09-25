import { useMemo, useState } from "react";
import type {
    CharacterFormData,
    EquipmentSlotRef,
} from "../../types/character";
import {
    buildPickableInventory,
    equipmentRefKey,
    equipmentRefsEqual,
    filterPickableForSlotKind,
    resolveSlotEntry,
    type EquipmentSlotKind,
} from "../../utils/equipmentSlots";

const cinzel = { fontFamily: "'Cinzel', serif" } as const;

interface EquipmentSlotsPanelProps {
    data: CharacterFormData;
    title: string;
    hint: string;
    slotCount: number;
    slots: (EquipmentSlotRef | null)[];
    reservedRefKeys: Set<string>;
    slotKind: EquipmentSlotKind;
    editable?: boolean;
    busy?: boolean;
    onUpdate?: (slots: (EquipmentSlotRef | null)[]) => Promise<void>;
}

export function EquipmentSlotsPanel({
    data,
    title,
    hint,
    slotCount,
    slots,
    reservedRefKeys,
    slotKind,
    editable = false,
    busy = false,
    onUpdate,
}: EquipmentSlotsPanelProps) {
    const pickable = useMemo(
        () =>
            filterPickableForSlotKind(
                buildPickableInventory(data),
                slotKind
            ),
        [data, slotKind]
    );
    const [pickerIndex, setPickerIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const usedKeys = new Set([
        ...reservedRefKeys,
        ...slots
            .filter((ref): ref is EquipmentSlotRef => ref != null)
            .map(equipmentRefKey),
    ]);

    async function applySlots(next: (EquipmentSlotRef | null)[]) {
        if (!onUpdate) return;
        setSaving(true);
        try {
            await onUpdate(next);
        } finally {
            setSaving(false);
            setPickerIndex(null);
        }
    }

    function assignSlot(slotIndex: number, ref: EquipmentSlotRef | null) {
        const next = [...slots];
        if (ref) {
            for (let i = 0; i < slotCount; i++) {
                if (i !== slotIndex && next[i] && equipmentRefsEqual(next[i]!, ref)) {
                    next[i] = null;
                }
            }
        }
        next[slotIndex] = ref;
        void applySlots(next);
    }

    const locked = busy || saving;
    const gridClass =
        slotCount >= 5
            ? "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
            : "grid grid-cols-3 gap-2";

    return (
        <>
            <div
                className="mb-4 border p-3"
                style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-parchment)",
                }}
            >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                        {title}
                    </p>
                    <p className="text-[10px] text-[var(--color-ink-soft)]">{hint}</p>
                </div>
                <div className={gridClass}>
                    {Array.from({ length: slotCount }, (_, index) => {
                        const ref = slots[index] ?? null;
                        const resolved = resolveSlotEntry(data, ref);
                        const missing = ref != null && !resolved;
                        const label =
                            resolved?.name ??
                            (missing ? "Item indisponível" : "Slot vazio");
                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={!editable || locked}
                                onClick={() => {
                                    if (!editable || locked) return;
                                    setPickerIndex(index);
                                }}
                                className="flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 border p-2 text-center transition-opacity disabled:cursor-default"
                                style={{
                                    borderColor: "var(--color-border-strong)",
                                    backgroundColor: "var(--color-surface)",
                                    opacity: !editable || locked ? 0.92 : 1,
                                }}
                            >
                                {resolved?.imageUrl ? (
                                    <img
                                        src={resolved.imageUrl}
                                        alt=""
                                        className="h-10 w-10 rounded object-cover"
                                        style={{
                                            border: "1px solid var(--color-border)",
                                        }}
                                    />
                                ) : (
                                    <span
                                        className="flex h-10 w-10 items-center justify-center rounded text-lg text-[var(--color-ink-soft)]"
                                        style={{
                                            border: "1px dashed var(--color-border)",
                                            backgroundColor:
                                                "var(--color-parchment-soft)",
                                        }}
                                    >
                                        {ref ? "◆" : "+"}
                                    </span>
                                )}
                                <span
                                    className={
                                        missing
                                            ? "line-clamp-2 text-[10px] text-[var(--color-crimson)]"
                                            : "line-clamp-2 text-[10px] text-[var(--color-ink)]"
                                    }
                                    style={ref && !missing ? cinzel : undefined}
                                >
                                    {label}
                                </span>
                                {resolved?.bonusLabel ? (
                                    <span className="text-[9px] text-[var(--color-crimson)]">
                                        {resolved.bonusLabel}
                                    </span>
                                ) : null}
                                <span className="text-[9px] text-[var(--color-ink-soft)]">
                                    Slot {index + 1}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {pickerIndex != null ? (
                <div
                    className="fixed inset-0 z-[95] flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(20, 12, 8, 0.65)" }}
                    role="dialog"
                    aria-modal
                    aria-label="Escolher item equipado"
                    onPointerDown={(event) => {
                        if (event.target === event.currentTarget) setPickerIndex(null);
                    }}
                >
                    <div
                        className="flex max-h-[min(32rem,85vh)] w-full max-w-md flex-col border p-4"
                        style={{
                            borderColor: "var(--color-border-strong)",
                            backgroundColor: "var(--color-surface)",
                        }}
                    >
                        <h4
                            className="mb-1 text-base text-[var(--color-ink)]"
                            style={{ ...cinzel, fontWeight: 600 }}
                        >
                            Slot {pickerIndex + 1}
                        </h4>
                        <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
                            {slotKind === "attuned"
                                ? "Apenas itens que requerem sintonização."
                                : "Apenas itens que não requerem sintonização."}{" "}
                            Limpe o slot para desequipar.
                        </p>
                        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
                            {pickable.length === 0 ? (
                                <li className="text-sm italic text-[var(--color-ink-muted)]">
                                    Nenhum item elegível neste tipo de slot.
                                </li>
                            ) : (
                                pickable.map((entry) => {
                                    const key = equipmentRefKey(entry.ref);
                                    const inOtherSlot =
                                        usedKeys.has(key) &&
                                        !(
                                            slots[pickerIndex] &&
                                            equipmentRefsEqual(
                                                slots[pickerIndex]!,
                                                entry.ref
                                            )
                                        );
                                    return (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                disabled={locked || inOtherSlot}
                                                onClick={() =>
                                                    assignSlot(pickerIndex, entry.ref)
                                                }
                                                className="flex w-full items-center gap-2 border px-2 py-2 text-left text-sm disabled:opacity-50"
                                                style={{
                                                    borderColor: "var(--color-border)",
                                                    backgroundColor:
                                                        "var(--color-parchment)",
                                                }}
                                            >
                                                {entry.imageUrl ? (
                                                    <img
                                                        src={entry.imageUrl}
                                                        alt=""
                                                        className="h-9 w-9 shrink-0 object-cover"
                                                    />
                                                ) : null}
                                                <span className="min-w-0 flex-1">
                                                    <span
                                                        className="block text-[var(--color-ink)]"
                                                        style={cinzel}
                                                    >
                                                        {entry.name}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--color-ink-soft)]">
                                                        × {entry.quantity}
                                                        {entry.bonusLabel
                                                            ? ` · ${entry.bonusLabel}`
                                                            : ""}
                                                        {inOtherSlot
                                                            ? " · já equipado"
                                                            : ""}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {slots[pickerIndex] ? (
                                <button
                                    type="button"
                                    disabled={locked}
                                    onClick={() => assignSlot(pickerIndex, null)}
                                    className="border px-3 py-1.5 text-xs text-[var(--color-crimson)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                        backgroundColor: "var(--color-parchment)",
                                        fontFamily: "'Cinzel', serif",
                                    }}
                                >
                                    Limpar slot
                                </button>
                            ) : null}
                            <button
                                type="button"
                                disabled={locked}
                                onClick={() => setPickerIndex(null)}
                                className="border px-3 py-1.5 text-xs"
                                style={{
                                    borderColor: "var(--color-border)",
                                    backgroundColor: "var(--color-surface)",
                                    fontFamily: "'Cinzel', serif",
                                }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
