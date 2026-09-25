import { useMemo, useState } from "react";
import type {
    ActiveSlots,
    AttunedSlots,
    CharacterFormData,
    EquipmentSlotRef,
} from "../../types/character";
import {
    ACTIVE_SLOT_COUNT,
    ATTUNED_SLOT_COUNT,
    equipmentRefKey,
    removeRefFromSlots,
    normalizeActiveSlots,
    normalizeAttunedSlots,
} from "../../utils/equipmentSlots";
import { EquipmentSlotsPanel } from "./EquipmentSlotsPanel";

interface InventoryEquipmentSectionProps {
    data: CharacterFormData;
    editable?: boolean;
    busy?: boolean;
    onUpdateAttunedSlots?: (slots: AttunedSlots) => Promise<void>;
    onUpdateActiveSlots?: (slots: ActiveSlots) => Promise<void>;
}

export function InventoryEquipmentSection({
    data,
    editable = false,
    busy = false,
    onUpdateAttunedSlots,
    onUpdateActiveSlots,
}: InventoryEquipmentSectionProps) {
    const [tab, setTab] = useState<"magic" | "active">("magic");
    const attuned = normalizeAttunedSlots(data.equipment.attunedSlots);
    const active = normalizeActiveSlots(data.equipment.activeSlots);

    const attunedKeys = useMemo(
        () =>
            new Set(
                attuned
                    .filter((ref): ref is EquipmentSlotRef => ref != null)
                    .map(equipmentRefKey)
            ),
        [attuned]
    );
    const activeKeys = useMemo(
        () =>
            new Set(
                active
                    .filter((ref): ref is EquipmentSlotRef => ref != null)
                    .map(equipmentRefKey)
            ),
        [active]
    );

    async function handleAttunedUpdate(nextRaw: (EquipmentSlotRef | null)[]) {
        if (!onUpdateAttunedSlots) return;
        const next = normalizeAttunedSlots(nextRaw as AttunedSlots);
        let clearedActive = active;
        for (const ref of next) {
            if (ref) clearedActive = removeRefFromSlots(clearedActive, ref);
        }
        await onUpdateAttunedSlots(next);
        if (
            onUpdateActiveSlots &&
            clearedActive.some((ref, i) => ref !== active[i])
        ) {
            await onUpdateActiveSlots(clearedActive);
        }
    }

    async function handleActiveUpdate(nextRaw: (EquipmentSlotRef | null)[]) {
        if (!onUpdateActiveSlots) return;
        const next = normalizeActiveSlots(nextRaw as ActiveSlots);
        let clearedAttuned = attuned;
        for (const ref of next) {
            if (ref) clearedAttuned = removeRefFromSlots(clearedAttuned, ref);
        }
        await onUpdateActiveSlots(next);
        if (
            onUpdateAttunedSlots &&
            clearedAttuned.some((ref, i) => ref !== attuned[i])
        ) {
            await onUpdateAttunedSlots(clearedAttuned);
        }
    }

    return (
        <div className="mb-4">
            <div
                className="mb-2 flex flex-wrap gap-1 border-b pb-1"
                style={{ borderColor: "var(--color-border)" }}
            >
                {(
                    [
                        ["magic", "Equipamentos mágicos sintonizados"],
                        ["active", "Equipamentos ativos"],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className="border px-2.5 py-1 text-[11px]"
                        style={{
                            fontFamily: "'Cinzel', serif",
                            borderColor: "var(--color-border)",
                            backgroundColor:
                                tab === id
                                    ? "var(--color-crimson)"
                                    : "var(--color-parchment)",
                            color:
                                tab === id
                                    ? "var(--color-ink-inverse)"
                                    : "var(--color-ink)",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === "magic" ? (
                <EquipmentSlotsPanel
                    data={data}
                    title="Equipamentos mágicos sintonizados"
                    hint={
                        editable
                            ? `Até ${ATTUNED_SLOT_COUNT} itens mágicos sintonizados.`
                            : `Até ${ATTUNED_SLOT_COUNT} slots.`
                    }
                    slotCount={ATTUNED_SLOT_COUNT}
                    slots={attuned}
                    slotKind="attuned"
                    reservedRefKeys={activeKeys}
                    editable={editable && Boolean(onUpdateAttunedSlots)}
                    busy={busy}
                    onUpdate={
                        onUpdateAttunedSlots
                            ? (slots) => handleAttunedUpdate(slots)
                            : undefined
                    }
                />
            ) : (
                <EquipmentSlotsPanel
                    data={data}
                    title="Equipamentos ativos"
                    hint={
                        editable
                            ? `Até ${ACTIVE_SLOT_COUNT} equipamentos comuns em uso.`
                            : `Até ${ACTIVE_SLOT_COUNT} slots.`
                    }
                    slotCount={ACTIVE_SLOT_COUNT}
                    slots={active}
                    slotKind="active"
                    reservedRefKeys={attunedKeys}
                    editable={editable && Boolean(onUpdateActiveSlots)}
                    busy={busy}
                    onUpdate={
                        onUpdateActiveSlots
                            ? (slots) => handleActiveUpdate(slots)
                            : undefined
                    }
                />
            )}
        </div>
    );
}
