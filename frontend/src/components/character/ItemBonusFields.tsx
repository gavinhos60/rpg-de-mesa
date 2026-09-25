import {
    ITEM_BONUS_OPTIONS,
    ITEM_BONUS_VALUE_MAX,
    ITEM_BONUS_VALUE_MIN,
} from "../../data/itemBonus";
import type { ItemBonusStat } from "../../types/character";

const fieldStyle = {
    backgroundColor: "var(--color-parchment)",
    borderColor: "var(--color-border)",
    color: "var(--color-ink)",
} as const;

interface ItemBonusFieldsProps {
    label?: string;
    stat: ItemBonusStat | "";
    value: string;
    onStatChange: (stat: ItemBonusStat | "") => void;
    onValueChange: (value: string) => void;
    className?: string;
}

export function ItemBonusFields({
    label = "Info extra (bônus do item)",
    stat,
    value,
    onStatChange,
    onValueChange,
    className = "",
}: ItemBonusFieldsProps) {
    return (
        <div className={className}>
            <p className="mb-1 text-[10px] text-[var(--color-ink-soft)]">{label}</p>
            <div className="grid grid-cols-2 gap-1.5">
                <select
                    value={stat}
                    onChange={(e) =>
                        onStatChange(e.target.value as ItemBonusStat | "")
                    }
                    className="border px-2 py-1 text-sm outline-none"
                    style={fieldStyle}
                >
                    <option value="">Nenhum bônus</option>
                    {ITEM_BONUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    value={value}
                    disabled={!stat}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="border px-2 py-1 text-sm outline-none disabled:opacity-50"
                    style={fieldStyle}
                >
                    <option value="">—</option>
                    {Array.from(
                        { length: ITEM_BONUS_VALUE_MAX - ITEM_BONUS_VALUE_MIN + 1 },
                        (_, i) => ITEM_BONUS_VALUE_MIN + i
                    ).map((n) => (
                        <option key={n} value={String(n)}>
                            +{n}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
