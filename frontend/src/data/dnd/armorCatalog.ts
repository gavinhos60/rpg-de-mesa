export type ArmorTier = "light" | "medium" | "heavy" | "shield";

export type ArmorDexMode = "full" | "max2" | "none";

export interface ArmorTypeDefinition {
    id: string;
    name: string;
    tier: ArmorTier;
    /** CA base (sem Destreza), exceto escudo. */
    baseAc: number;
    dexMode: ArmorDexMode;
    minStrength?: number;
    stealthDisadvantage?: boolean;
    weightLb: number;
}

export const SHIELD_BASE_AC_BONUS = 2;

export const ARMOR_TYPES: ArmorTypeDefinition[] = [
    {
        id: "padded",
        name: "Acolchoada",
        tier: "light",
        baseAc: 11,
        dexMode: "full",
        stealthDisadvantage: true,
        weightLb: 8,
    },
    {
        id: "leather",
        name: "Couro",
        tier: "light",
        baseAc: 11,
        dexMode: "full",
        weightLb: 10,
    },
    {
        id: "studded-leather",
        name: "Couro Batido",
        tier: "light",
        baseAc: 12,
        dexMode: "full",
        weightLb: 13,
    },
    {
        id: "hide",
        name: "Peles",
        tier: "medium",
        baseAc: 12,
        dexMode: "max2",
        weightLb: 12,
    },
    {
        id: "chain-shirt",
        name: "Cota de Malha de Anéis",
        tier: "medium",
        baseAc: 13,
        dexMode: "max2",
        weightLb: 20,
    },
    {
        id: "scale-mail",
        name: "Brunea",
        tier: "medium",
        baseAc: 14,
        dexMode: "max2",
        weightLb: 45,
    },
    {
        id: "breastplate",
        name: "Peitoral",
        tier: "medium",
        baseAc: 14,
        dexMode: "max2",
        weightLb: 20,
    },
    {
        id: "half-plate",
        name: "Meia-Armadura",
        tier: "medium",
        baseAc: 15,
        dexMode: "max2",
        stealthDisadvantage: true,
        weightLb: 40,
    },
    {
        id: "ring-mail",
        name: "Cota de Anéis",
        tier: "heavy",
        baseAc: 14,
        dexMode: "none",
        weightLb: 40,
    },
    {
        id: "chain-mail",
        name: "Cota de Malha",
        tier: "heavy",
        baseAc: 16,
        dexMode: "none",
        minStrength: 13,
        stealthDisadvantage: true,
        weightLb: 55,
    },
    {
        id: "splint",
        name: "Cota de Talas",
        tier: "heavy",
        baseAc: 17,
        dexMode: "none",
        minStrength: 15,
        stealthDisadvantage: true,
        weightLb: 60,
    },
    {
        id: "plate",
        name: "Placas",
        tier: "heavy",
        baseAc: 18,
        dexMode: "none",
        minStrength: 15,
        stealthDisadvantage: true,
        weightLb: 65,
    },
    {
        id: "shield",
        name: "Escudo",
        tier: "shield",
        baseAc: SHIELD_BASE_AC_BONUS,
        dexMode: "none",
        weightLb: 6,
    },
];

const ARMOR_BY_ID = new Map(ARMOR_TYPES.map((entry) => [entry.id, entry]));

export function getArmorTypeById(
    id: string | null | undefined
): ArmorTypeDefinition | undefined {
    const key = String(id ?? "").trim();
    return key ? ARMOR_BY_ID.get(key) : undefined;
}

export const ARMOR_TIER_LABELS: Record<Exclude<ArmorTier, "shield">, string> =
    {
        light: "Leves",
        medium: "Médias",
        heavy: "Pesadas",
    };

export function armorTypesForTier(
    tier: Exclude<ArmorTier, "shield">
): ArmorTypeDefinition[] {
    return ARMOR_TYPES.filter((entry) => entry.tier === tier);
}

export function computeArmorBodyAc(
    def: ArmorTypeDefinition,
    dexModifier: number,
    magicBonus: number
): number {
    let ac = def.baseAc;
    if (def.dexMode === "full") {
        ac += dexModifier;
    } else if (def.dexMode === "max2") {
        ac += Math.min(2, dexModifier);
    }
    ac += Math.max(0, Math.floor(magicBonus));
    return ac;
}

export function computeShieldAcBonus(magicBonus: number): number {
    return SHIELD_BASE_AC_BONUS + Math.max(0, Math.floor(magicBonus));
}

export function formatMagicBonusSuffix(magicBonus: number | undefined): string {
    const value = Math.floor(Number(magicBonus) || 0);
    return value > 0 ? ` +${value}` : "";
}

export function suggestMasterItemName(
    armorTypeId: string | undefined,
    magicBonus: number | undefined
): string | undefined {
    const def = getArmorTypeById(armorTypeId);
    if (!def) return undefined;
    return `${def.name}${formatMagicBonusSuffix(magicBonus)}`;
}
