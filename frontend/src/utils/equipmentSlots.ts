import { formatItemBonusLabel } from "../data/itemBonus";
import { DND_CLASSES } from "../data/dnd/classes";
import { getEquipmentItem } from "../data/dnd/equipment";
import { getEquipmentImageUrl } from "../data/dnd/equipmentImages";
import type {
    ActiveSlots,
    AttunedSlots,
    CharacterFormData,
    EquipmentSlotRef,
    ItemBonus,
} from "../types/character";
import { buildCharacterInventory } from "./characterInventory";

const AUTO_EQUIP_ARMOR_PRIORITY = [
    "chain-mail",
    "scale-mail",
    "leather-armor",
] as const;

const AUTO_EQUIP_SHIELD_IDS = ["shield", "wooden-shield"] as const;

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
        imageUrl: getEquipmentImageUrl(row.itemId),
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

function slotsSnapshot(data: CharacterFormData): string {
    return JSON.stringify({
        active: data.equipment.activeSlots,
        attuned: data.equipment.attunedSlots,
        classId: data.equipment.classId,
        choices: data.equipment.choiceSelections,
    });
}

function countEquippedCatalog(
    slots: (EquipmentSlotRef | null)[],
    itemId: string
): number {
    return slots.filter(
        (ref) => ref?.kind === "catalog" && ref.itemId === itemId
    ).length;
}

function hasEquippedArmor(slots: (EquipmentSlotRef | null)[]): boolean {
    return AUTO_EQUIP_ARMOR_PRIORITY.some(
        (id) => countEquippedCatalog(slots, id) > 0
    );
}

function hasEquippedShield(slots: (EquipmentSlotRef | null)[]): boolean {
    return AUTO_EQUIP_SHIELD_IDS.some(
        (id) => countEquippedCatalog(slots, id) > 0
    );
}

function pruneEquippedCatalogSlots(
    data: CharacterFormData,
    attuned: AttunedSlots,
    active: ActiveSlots
): { attuned: AttunedSlots; active: ActiveSlots } {
    const inventory = buildCharacterInventory(data);
    const qtyById = new Map(
        inventory.map((row) => [
            row.itemId,
            row.classQuantity + row.manualQuantity,
        ])
    );
    const used = new Map<string, number>();

    const keepRef = (ref: EquipmentSlotRef | null): EquipmentSlotRef | null => {
        if (!ref) return null;
        if (ref.kind === "custom") {
            const item = (data.equipment.customItems ?? []).find(
                (entry) => entry.id === ref.customItemId
            );
            return item && item.quantity > 0 ? ref : null;
        }
        const max = qtyById.get(ref.itemId) ?? 0;
        const next = (used.get(ref.itemId) ?? 0) + 1;
        if (next > max) return null;
        used.set(ref.itemId, next);
        return ref;
    };

    return {
        attuned: attuned.map(keepRef) as AttunedSlots,
        active: active.map(keepRef) as ActiveSlots,
    };
}

function tryEquipInFirstEmptyActive(
    active: ActiveSlots,
    itemId: string
): ActiveSlots | null {
    const index = active.findIndex((ref) => !ref);
    if (index < 0) return null;
    const next = [...active] as (EquipmentSlotRef | null)[];
    next[index] = { kind: "catalog", itemId };
    return next as ActiveSlots;
}

/** Preenche slots ativos (não sintonizados) com equipamento inicial do inventário. */
export function ensureStarterEquipmentEquipped(
    data: CharacterFormData
): CharacterFormData {
    const before = slotsSnapshot(data);
    let attuned = normalizeAttunedSlots(data.equipment.attunedSlots);
    let active = normalizeActiveSlots(data.equipment.activeSlots);
    const startedWithEmptyActive = active.every((ref) => !ref);
    ({ attuned, active } = pruneEquippedCatalogSlots(data, attuned, active));

    const inventory = buildCharacterInventory(data);
    const qtyById = new Map(
        inventory.map((row) => [
            row.itemId,
            row.classQuantity + row.manualQuantity,
        ])
    );

    const allSlots = (): (EquipmentSlotRef | null)[] => [...attuned, ...active];

    const equippedCount = (itemId: string): number =>
        countEquippedCatalog(allSlots(), itemId);

    const equipCatalog = (itemId: string): void => {
        const available = (qtyById.get(itemId) ?? 0) - equippedCount(itemId);
        if (available <= 0) return;
        const next = tryEquipInFirstEmptyActive(active, itemId);
        if (next) active = next;
    };

    if (startedWithEmptyActive) {
        for (const row of inventory) {
            let remaining =
                row.classQuantity +
                row.manualQuantity -
                equippedCount(row.itemId);
            while (remaining > 0) {
                const next = tryEquipInFirstEmptyActive(active, row.itemId);
                if (!next) break;
                active = next;
                remaining -= 1;
            }
        }
    } else {
        if (!hasEquippedArmor(allSlots())) {
            for (const armorId of AUTO_EQUIP_ARMOR_PRIORITY) {
                if ((qtyById.get(armorId) ?? 0) > 0) {
                    equipCatalog(armorId);
                    break;
                }
            }
        }

        if (!hasEquippedShield(allSlots())) {
            for (const shieldId of AUTO_EQUIP_SHIELD_IDS) {
                if ((qtyById.get(shieldId) ?? 0) > 0) {
                    equipCatalog(shieldId);
                    break;
                }
            }
        }
    }

    const result: CharacterFormData = {
        ...data,
        equipment: {
            ...data.equipment,
            attuned,
            activeSlots: active,
        },
    };

    return slotsSnapshot(result) === before ? data : result;
}

/** Garante escolhas padrão de equipamento de classe e equipa itens iniciais nos slots ativos. */
export function ensureClassEquipmentDefaults(
    data: CharacterFormData
): CharacterFormData {
    const primaryClassId = data.classes[0]?.classId ?? "";
    const characterClass = DND_CLASSES.find(
        (entry) => entry.id === primaryClassId
    );
    const startingEquipment = characterClass?.startingEquipment;
    if (!startingEquipment) {
        return ensureStarterEquipmentEquipped(data);
    }

    const defaultChoices = Object.fromEntries(
        startingEquipment.choices.map((choice) => [
            choice.id,
            choice.alternatives[0]?.id ?? "",
        ])
    );

    const classChanged = data.equipment.classId !== primaryClassId;
    const choiceSelections = classChanged
        ? defaultChoices
        : {
              ...defaultChoices,
              ...data.equipment.choiceSelections,
          };

    const withChoices: CharacterFormData = {
        ...data,
        equipment: {
            ...data.equipment,
            classId: primaryClassId,
            choiceSelections,
            ...(classChanged
                ? {
                      activeSlots: [
                          null,
                          null,
                          null,
                          null,
                          null,
                      ] as ActiveSlots,
                  }
                : {}),
        },
    };

    return ensureStarterEquipmentEquipped(withChoices);
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
