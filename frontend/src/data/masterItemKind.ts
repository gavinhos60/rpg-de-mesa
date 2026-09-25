import type {
    CustomInventoryItem,
    MasterItemKind,
} from "../types/character";

export type { MasterItemKind };

export const MASTER_ITEM_KIND_OPTIONS: Array<{
    value: MasterItemKind;
    label: string;
}> = [
    { value: "weapon", label: "Arma" },
    { value: "armor", label: "Armadura" },
    { value: "shield", label: "Escudo" },
    { value: "accessory", label: "Acessório" },
];

export const MAGIC_BONUS_OPTIONS = [0, 1, 2, 3] as const;
export type MagicBonus = (typeof MAGIC_BONUS_OPTIONS)[number];

export function masterItemCategoryFromKind(
    kind: MasterItemKind
): string {
    switch (kind) {
        case "weapon":
            return "weapon";
        case "armor":
            return "armor";
        case "shield":
            return "shield";
        case "accessory":
            return "accessory";
    }
}

export function formatMasterItemExtraLabel(
    item: Pick<
        CustomInventoryItem,
        "itemKind" | "armorTypeId" | "magicBonus" | "itemBonus"
    >
): string | null {
    const parts: string[] = [];
    if (item.magicBonus && item.magicBonus > 0) {
        parts.push(`+${item.magicBonus}`);
    }
    if (parts.length === 0 && item.itemBonus) {
        return null;
    }
    if (parts.length === 0) return null;
    return parts.join(" · ");
}
