import {
    ARMOR_TIER_LABELS,
    armorTypesForTier,
    type ArmorTier,
} from "../../data/dnd/armorCatalog";
import {
    MAGIC_BONUS_OPTIONS,
    MASTER_ITEM_KIND_OPTIONS,
    type MasterItemKind,
    type MagicBonus,
} from "../../data/masterItemKind";

const fieldStyle = {
    backgroundColor: "var(--color-parchment)",
    borderColor: "var(--color-border)",
    color: "var(--color-ink)",
} as const;

export interface MasterItemTypeFieldValues {
    itemKind: MasterItemKind;
    armorTypeId: string;
    magicBonus: MagicBonus;
}

interface MasterItemTypeFieldsProps {
    values: MasterItemTypeFieldValues;
    onChange: (patch: Partial<MasterItemTypeFieldValues>) => void;
    className?: string;
}

export function MasterItemTypeFields({
    values,
    onChange,
    className = "",
}: MasterItemTypeFieldsProps) {
    const showArmorPicker =
        values.itemKind === "armor" || values.itemKind === "shield";

    function handleKindChange(kind: MasterItemKind) {
        if (kind === "shield") {
            onChange({ itemKind: kind, armorTypeId: "shield" });
            return;
        }
        if (kind === "armor" && values.armorTypeId === "shield") {
            onChange({ itemKind: kind, armorTypeId: "" });
            return;
        }
        onChange({ itemKind: kind });
    }

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="block text-[10px] text-[var(--color-ink-soft)]">
                Tipo do item
                <select
                    value={values.itemKind}
                    onChange={(e) =>
                        handleKindChange(e.target.value as MasterItemKind)
                    }
                    className="mt-0.5 w-full border px-2 py-1 text-sm outline-none"
                    style={fieldStyle}
                >
                    {MASTER_ITEM_KIND_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            {showArmorPicker ? (
                <ArmorTypeSelect
                    itemKind={values.itemKind}
                    armorTypeId={values.armorTypeId}
                    onArmorTypeIdChange={(armorTypeId) =>
                        onChange({ armorTypeId })
                    }
                />
            ) : null}

            {values.itemKind !== "accessory" ? (
                <label className="block text-[10px] text-[var(--color-ink-soft)]">
                    Bônus mágico
                    <select
                        value={String(values.magicBonus)}
                        onChange={(e) =>
                            onChange({
                                magicBonus: Number(
                                    e.target.value
                                ) as MagicBonus,
                            })
                        }
                        className="mt-0.5 w-full border px-2 py-1 text-sm outline-none"
                        style={fieldStyle}
                    >
                        {MAGIC_BONUS_OPTIONS.map((bonus) => (
                            <option key={bonus} value={String(bonus)}>
                                {bonus === 0 ? "Nenhum (+0)" : `+${bonus}`}
                            </option>
                        ))}
                    </select>
                </label>
            ) : null}
        </div>
    );
}

function ArmorTypeSelect({
    itemKind,
    armorTypeId,
    onArmorTypeIdChange,
}: {
    itemKind: MasterItemKind;
    armorTypeId: string;
    onArmorTypeIdChange: (id: string) => void;
}) {
    if (itemKind === "shield") {
        return (
            <p className="text-[10px] text-[var(--color-ink-muted)]">
                Modelo: Escudo (+2 na CA, mais bônus mágico)
            </p>
        );
    }

    const tiers: Exclude<ArmorTier, "shield">[] = [
        "light",
        "medium",
        "heavy",
    ];

    return (
        <label className="block text-[10px] text-[var(--color-ink-soft)]">
            Modelo de armadura
            <select
                value={armorTypeId}
                onChange={(e) => onArmorTypeIdChange(e.target.value)}
                className="mt-0.5 w-full border px-2 py-1 text-sm outline-none"
                style={fieldStyle}
            >
                <option value="">Selecione…</option>
                {tiers.map((tier) => (
                    <optgroup key={tier} label={ARMOR_TIER_LABELS[tier]}>
                        {armorTypesForTier(tier).map((armor) => (
                            <option key={armor.id} value={armor.id}>
                                {armor.name} (CA {armor.baseAc}
                                {armor.dexMode === "full"
                                    ? " + DES"
                                    : armor.dexMode === "max2"
                                      ? " + DES (máx. +2)"
                                      : ""}
                                )
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </label>
    );
}
