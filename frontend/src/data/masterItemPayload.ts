import { getArmorTypeById } from "./dnd/armorCatalog";
import { masterItemCategoryFromKind, type MagicBonus } from "./masterItemKind";
import type { ItemBonus, MasterItemKind } from "../types/character";
import { parseItemBonusFields } from "./itemBonus";

export interface MasterItemFormPayload {
    category?: string;
    itemKind?: MasterItemKind;
    armorTypeId?: string;
    magicBonus?: number;
    itemBonus?: ItemBonus;
}

export function buildMasterItemPayload(input: {
    itemKind: MasterItemKind;
    armorTypeId: string;
    magicBonus: MagicBonus;
    accessoryBonusStat: string;
    accessoryBonusValue: string;
}): MasterItemFormPayload {
    const magicBonus = Math.max(0, Math.floor(Number(input.magicBonus) || 0));
    const category = masterItemCategoryFromKind(input.itemKind);

    if (input.itemKind === "armor") {
        const armorTypeId = input.armorTypeId.trim();
        if (!armorTypeId || !getArmorTypeById(armorTypeId)) {
            throw new Error("ARMOR_TYPE_REQUIRED");
        }
        return {
            category,
            itemKind: "armor",
            armorTypeId,
            magicBonus,
        };
    }

    if (input.itemKind === "shield") {
        return {
            category,
            itemKind: "shield",
            armorTypeId: "shield",
            magicBonus,
        };
    }

    if (input.itemKind === "weapon") {
        return {
            category,
            itemKind: "weapon",
            magicBonus,
        };
    }

    const parsedBonus = parseItemBonusFields(
        input.accessoryBonusStat,
        input.accessoryBonusValue
    );
    return {
        category,
        itemKind: "accessory",
        ...(parsedBonus ? { itemBonus: parsedBonus } : {}),
    };
}
