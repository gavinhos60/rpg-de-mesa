import type { ItemBonusStat } from "../types/character";

export const ITEM_BONUS_OPTIONS: Array<{
    value: ItemBonusStat;
    label: string;
}> = [
    { value: "ac", label: "Bônus de CA" },
    { value: "strength", label: "Bônus de Força" },
    { value: "dexterity", label: "Bônus de Destreza" },
    { value: "constitution", label: "Bônus de Constituição" },
    { value: "intelligence", label: "Bônus de Inteligência" },
    { value: "wisdom", label: "Bônus de Sabedoria" },
    { value: "charisma", label: "Bônus de Carisma" },
];

export const ITEM_BONUS_VALUE_MIN = 1;
export const ITEM_BONUS_VALUE_MAX = 10;

export function formatItemBonusLabel(
    stat: ItemBonusStat | null | undefined,
    value: number | null | undefined
): string | null {
    if (!stat || value == null || !Number.isFinite(value) || value <= 0) {
        return null;
    }
    const label = ITEM_BONUS_OPTIONS.find((o) => o.value === stat)?.label;
    if (!label) return null;
    return `${label} +${Math.floor(value)}`;
}

export function parseItemBonusFields(
    statRaw: string,
    valueRaw: string
): { stat: ItemBonusStat; value: number } | undefined {
    const stat = statRaw.trim() as ItemBonusStat;
    if (!ITEM_BONUS_OPTIONS.some((o) => o.value === stat)) return undefined;
    const value = Math.floor(Number(valueRaw));
    if (!Number.isFinite(value) || value < ITEM_BONUS_VALUE_MIN) return undefined;
    return {
        stat,
        value: Math.min(ITEM_BONUS_VALUE_MAX, value),
    };
}
