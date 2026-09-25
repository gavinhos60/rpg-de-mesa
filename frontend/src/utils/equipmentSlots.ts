import { formatItemBonusLabel } from "../data/itemBonus";
import { getEquipmentItem } from "../data/dnd/equipment";
import type {
    ActiveSlots,
    AttunedSlots,
    CharacterFormData,
    EquipmentSlotRef,
    ItemBonus,
} from "../types/character";
import { buildCharacterInventory } from "./characterInventory";

export const ATTUNED_SLOT_COUNT = 3;
export const ACTIVE_SLOT_COUNT = 5;

export interface PickableInventoryEntry {
    ref: EquipmentSlotRef;
    name: string;
    quantity: number;
    imageUrl?: string;
    bonusLabel?: string | null;
    /** Itens de catálogo D&D nunca exigem sintonização. */
    requiresAttunement: boolean;
}

export type EquipmentSlotKind = "attuned" | "active";

export function entryAllowedInSlotKind(
    entry: PickableInventoryEntry,
    slotKind: EquipmentSlotKind
): boolean {
    if (slotKind === "attuned") return entry.requiresAttunement;
    return !entry.requiresAttunement;
}

export function filterPickableForSlotKind(
    entries: PickableInventoryEntry[],
    slotKind: EquipmentSlotKind
): PickableInventoryEntry[] {
    return entries.filter((entry) => entryAllowedInSlotKind(entry, slotKind));
}

export function equipmentRefKey(ref: EquipmentSlotRef): string {
    return ref.kind === "catalog"
        ? `catalog:${ref.itemId}`
        : `custom:${ref.customItemId}`;
}

export function equipmentRefsEqual(
    a: EquipmentSlotRef,
    b: EquipmentSlotRef
): boolean {
    return equipmentRefKey(a) === equipmentRefKey(b);
}

function parseSlotRef(raw: unknown): EquipmentSlotRef | null {
    if (!raw || typeof raw !== "object") return null;
    const entry = raw as Record<string, unknown>;
    if (entry.kind === "catalog") {
        const itemId = String(entry.itemId ?? "").trim();
        return itemId ? { kind: "catalog", itemId } : null;
    }
    if (entry.kind === "custom") {
        const customItemId = String(entry.customItemId ?? "").trim();
        return customItemId ? { kind: "custom", customItemId } : null;
    }
    return null;
}

function normalizeSlotTuple<T extends (EquipmentSlotRef | null)[]>(
    raw: unknown,
    count: number,
    empty: T
): T {
    const slots = [...empty] as (EquipmentSlotRef | null)[];
    if (!Array.isArray(raw)) return slots as T;
    for (let i = 0; i < count; i++) {
        slots[i] = parseSlotRef(raw[i]);
    }
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
        const ref = slots[i];
        if (!ref) continue;
        const key = equipmentRefKey(ref);
        if (seen.has(key)) slots[i] = null;
        else seen.add(key);
    }
    return slots as T;
}

export function normalizeAttunedSlots(
    raw: AttunedSlots | EquipmentSlotRef[] | null | undefined
): AttunedSlots {
    return normalizeSlotTuple(raw, ATTUNED_SLOT_COUNT, [
        null,
        null,
        null,
    ] as AttunedSlots);
}

export function normalizeActiveSlots(
    raw: ActiveSlots | EquipmentSlotRef[] | null | undefined
): ActiveSlots {
    return normalizeSlotTuple(raw, ACTIVE_SLOT_COUNT, [
        null,
        null,
        null,
        null,
        null,
    ] as ActiveSlots);
}

export function buildPickableInventory(
    data: CharacterFormData
): PickableInventoryEntry[] {
    const catalog = buildCharacterInventory(data).map((row) => ({
        ref: { kind: "catalog" as const, itemId: row.itemId },
        name: getEquipmentItem(row.itemId)?.name ?? row.itemId,
        quantity: row.classQuantity + row.manualQuantity,
        bonusLabel: null,
        requiresAttunement: false,
    }));
    const custom = (data.equipment.customItems ?? [])
        .filter((item) => item.quantity > 0)
        .map((item) => ({
            ref: { kind: "custom" as const, customItemId: item.id },
            name: item.name,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            bonusLabel: formatItemBonusLabel(
                item.itemBonus?.stat,
                item.itemBonus?.value
            ),
            requiresAttunement: Boolean(item.requiresAttunement),
        }));
    return [...catalog, ...custom];
}

export function resolveSlotEntry(
    data: CharacterFormData,
    ref: EquipmentSlotRef | null
): PickableInventoryEntry | null {
    if (!ref) return null;
    return (
        buildPickableInventory(data).find((entry) =>
            equipmentRefsEqual(entry.ref, ref)
        ) ?? null
    );
}

export function removeRefFromSlots<T extends (EquipmentSlotRef | null)[]>(
    slots: T,
    ref: EquipmentSlotRef
): T {
    const next = [...slots] as (EquipmentSlotRef | null)[];
    for (let i = 0; i < next.length; i++) {
        if (next[i] && equipmentRefsEqual(next[i]!, ref)) next[i] = null;
    }
    return next as T;
}

export function clearDuplicateRefsAcrossGroups(
    assignedRef: EquipmentSlotRef | null,
    attuned: AttunedSlots,
    active: ActiveSlots,
    target: "attuned" | "active"
): { attuned: AttunedSlots; active: ActiveSlots } {
    if (!assignedRef) {
        return { attuned, active };
    }
    if (target === "attuned") {
        return {
            attuned,
            active: removeRefFromSlots(active, assignedRef),
        };
    }
    return {
        attuned: removeRefFromSlots(attuned, assignedRef),
        active,
    };
}

export function customItemBonusFromRecord(
    row: Record<string, unknown>
): ItemBonus | undefined {
    const nested =
        row.itemBonus &&
        typeof row.itemBonus === "object" &&
        !Array.isArray(row.itemBonus)
            ? (row.itemBonus as Record<string, unknown>)
            : null;
    const stat = String(nested?.stat ?? row.bonusStat ?? "").trim();
    const valueRaw = nested?.value ?? row.bonusValue;
    const value = Math.floor(Number(valueRaw));
    if (!stat || !Number.isFinite(value) || value <= 0) return undefined;
    return { stat: stat as ItemBonus["stat"], value };
}
