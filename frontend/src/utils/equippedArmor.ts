import {
    computeArmorBodyAc,
    computeShieldAcBonus,
    formatMagicBonusSuffix,
    getArmorTypeById,
    type ArmorTypeDefinition,
} from "../data/dnd/armorCatalog";
import { DND_CLASSES } from "../data/dnd/classes";
import type {
    CharacterClass,
    CharacterFormData,
    CustomInventoryItem,
} from "../types/character";
import {
    getEquippedCatalogItemIds,
    getEquippedSlotRefs,
} from "./equipmentBonuses";

const CATALOG_BODY_ARMOR: Record<
    string,
    { label: string; armorTypeId: string }
> = {
    "chain-mail": { label: "Cota de Malha", armorTypeId: "chain-mail" },
    "scale-mail": { label: "Brunea", armorTypeId: "scale-mail" },
    "leather-armor": { label: "Couro", armorTypeId: "leather" },
};

const CATALOG_SHIELD_IDS = new Set(["shield", "wooden-shield"]);

export interface ResolvedBodyArmor {
    source: "catalog" | "custom";
    label: string;
    def: ArmorTypeDefinition;
    magicBonus: number;
    totalAc: number;
    dexPart: number;
}

export interface ResolvedShield {
    source: "catalog" | "custom";
    label: string;
    magicBonus: number;
    totalBonus: number;
}

function findCustomItem(
    data: CharacterFormData,
    customItemId: string
): CustomInventoryItem | undefined {
    return (data.equipment.customItems ?? []).find(
        (entry) => entry.id === customItemId
    );
}

function resolveCustomBodyArmor(
    item: CustomInventoryItem,
    dexModifier: number
): ResolvedBodyArmor | null {
    const def = getArmorTypeById(item.armorTypeId);
    if (!def || def.tier === "shield") return null;
    const magicBonus = Math.max(0, Math.floor(Number(item.magicBonus) || 0));
    let dexPart = 0;
    if (def.dexMode === "full") dexPart = dexModifier;
    else if (def.dexMode === "max2") dexPart = Math.min(2, dexModifier);
    return {
        source: "custom",
        label: `${item.name}${formatMagicBonusSuffix(magicBonus)}`,
        def,
        magicBonus,
        dexPart,
        totalAc: computeArmorBodyAc(def, dexModifier, magicBonus),
    };
}

function resolveCustomShield(item: CustomInventoryItem): ResolvedShield | null {
    const isShield =
        item.itemKind === "shield" ||
        item.armorTypeId === "shield" ||
        getArmorTypeById(item.armorTypeId)?.tier === "shield";
    if (!isShield) return null;
    const magicBonus = Math.max(0, Math.floor(Number(item.magicBonus) || 0));
    return {
        source: "custom",
        label: `${item.name}${formatMagicBonusSuffix(magicBonus)}`,
        magicBonus,
        totalBonus: computeShieldAcBonus(magicBonus),
    };
}

export function resolveEquippedArmorState(
    data: CharacterFormData,
    primaryClass: CharacterClass | undefined,
    dexModifier: number
): {
    body: ResolvedBodyArmor | null;
    shield: ResolvedShield | null;
    monkShieldBlocksUnarmored: boolean;
} {
    const catalogIds = getEquippedCatalogItemIds(data);
    let body: ResolvedBodyArmor | null = null;
    let shield: ResolvedShield | null = null;

    for (const ref of getEquippedSlotRefs(data)) {
        if (ref.kind !== "custom") continue;
        const item = findCustomItem(data, ref.customItemId);
        if (!item) continue;
        if (!body) {
            const resolvedBody = resolveCustomBodyArmor(item, dexModifier);
            if (resolvedBody) body = resolvedBody;
        }
        if (!shield) {
            const resolvedShield = resolveCustomShield(item);
            if (resolvedShield) shield = resolvedShield;
        }
    }

    if (!body) {
        for (const catalogId of Object.keys(CATALOG_BODY_ARMOR)) {
            if (!catalogIds.includes(catalogId)) continue;
            const meta = CATALOG_BODY_ARMOR[catalogId];
            const def = getArmorTypeById(meta.armorTypeId);
            if (!def) continue;
            let dexPart = 0;
            if (def.dexMode === "full") dexPart = dexModifier;
            else if (def.dexMode === "max2") dexPart = Math.min(2, dexModifier);
            body = {
                source: "catalog",
                label: meta.label,
                def,
                magicBonus: 0,
                dexPart,
                totalAc: computeArmorBodyAc(def, dexModifier, 0),
            };
            break;
        }
    }

    if (!shield) {
        const hasCatalogShield = catalogIds.some((id) =>
            CATALOG_SHIELD_IDS.has(id)
        );
        if (hasCatalogShield) {
            shield = {
                source: "catalog",
                label: "Escudo",
                magicBonus: 0,
                totalBonus: computeShieldAcBonus(0),
            };
        }
    }

    const monkShieldBlocksUnarmored =
        primaryClass?.id === "monk" &&
        Boolean(shield) &&
        !body;

    return { body, shield, monkShieldBlocksUnarmored };
}

/** Armadura corporal equipada que impõe desvantagem em Furtividade (PHB). */
export function getEquippedArmorStealthDisadvantage(
    data: CharacterFormData
): { armorLabel: string } | null {
    const primaryClass = data.classes[0]
        ? DND_CLASSES.find((item) => item.id === data.classes[0].classId)
        : undefined;
    const { body } = resolveEquippedArmorState(data, primaryClass, 0);
    if (!body?.def.stealthDisadvantage) return null;
    return { armorLabel: body.def.name };
}

export function customItemHasStructuredArmor(
    item: CustomInventoryItem | undefined
): boolean {
    if (!item) return false;
    return Boolean(
        item.armorTypeId ||
            (item.itemKind &&
                ["armor", "shield"].includes(item.itemKind))
    );
}
