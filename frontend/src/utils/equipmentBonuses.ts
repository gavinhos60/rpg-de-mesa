import type {
    CharacterFormData,
    EquipmentSlotRef,
    ItemBonus,
    ItemBonusStat,
} from "../types/character";
import {
    normalizeActiveSlots,
    normalizeAttunedSlots,
} from "./equipmentSlots";

const ZERO_BONUSES: Record<ItemBonusStat, number> = {
    ac: 0,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
};

export function getEquippedSlotRefs(data: CharacterFormData): EquipmentSlotRef[] {
    const attuned = normalizeAttunedSlots(data.equipment.attunedSlots);
    const active = normalizeActiveSlots(data.equipment.activeSlots);
    return [...attuned, ...active].filter(
        (ref): ref is EquipmentSlotRef => ref != null
    );
}

export function resolveSlotItemBonus(
    data: CharacterFormData,
    ref: EquipmentSlotRef
): ItemBonus | null {
    if (ref.kind === "custom") {
        const item = (data.equipment.customItems ?? []).find(
            (entry) => entry.id === ref.customItemId
        );
        if (!item?.itemBonus?.stat || !item.itemBonus.value) return null;
        return item.itemBonus;
    }
    return null;
}

export function sumEquipmentBonuses(
    data: CharacterFormData
): Record<ItemBonusStat, number> {
    const totals = { ...ZERO_BONUSES };
    for (const ref of getEquippedSlotRefs(data)) {
        const bonus = resolveSlotItemBonus(data, ref);
        if (!bonus) continue;
        totals[bonus.stat] += Math.max(0, Math.floor(bonus.value));
    }
    return totals;
}

export function applyAbilityEquipmentBonus(
    baseScore: number,
    stat: ItemBonusStat,
    bonuses: Record<ItemBonusStat, number>
): number {
    if (stat === "ac") return baseScore;
    return baseScore + (bonuses[stat] ?? 0);
}
