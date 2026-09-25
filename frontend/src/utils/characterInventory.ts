import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";
import { DND_CLASSES } from "../data/dnd/classes";
import type { CharacterFormData } from "../types/character";

export interface CharacterInventoryRow {
    itemId: string;
    classQuantity: number;
    manualQuantity: number;
}

export function buildCharacterInventory(
    data: CharacterFormData
): CharacterInventoryRow[] {
    const counts = new Map<string, CharacterInventoryRow>();
    const classId = data.equipment.classId || data.classes[0]?.classId;
    const characterClass = DND_CLASSES.find((item) => item.id === classId);
    const starting = characterClass?.startingEquipment;

    if (starting) {
        for (const stack of starting.fixed) {
            addInventoryQuantity(counts, stack.itemId, stack.quantity, "class");
        }

        for (const choice of starting.choices) {
            const selectedId =
                data.equipment.choiceSelections[choice.id] ??
                choice.alternatives[0]?.id;
            const selected = choice.alternatives.find(
                (alternative) => alternative.id === selectedId
            );
            for (const stack of selected?.items ?? []) {
                addInventoryQuantity(counts, stack.itemId, stack.quantity, "class");
            }
        }
    }

    const background = DND_BACKGROUNDS.find(
        (item) => item.id === data.backgroundId
    );
    for (const stack of background?.startingEquipment ?? []) {
        addInventoryQuantity(counts, stack.itemId, stack.quantity, "class");
    }
    if (background?.equipmentFromToolChoice) {
        data.backgroundChoices.tools.filter(Boolean).forEach((itemId) => {
            addInventoryQuantity(counts, itemId, 1, "class");
        });
    }

    for (const stack of data.equipment.manualItems) {
        addInventoryQuantity(counts, stack.itemId, stack.quantity, "manual");
    }

    for (const stack of data.equipment.removedItems ?? []) {
        let remaining = Math.max(0, stack.quantity);
        const current = counts.get(stack.itemId);
        if (!current || remaining <= 0) continue;
        const fromClass = Math.min(current.classQuantity, remaining);
        current.classQuantity -= fromClass;
        remaining -= fromClass;
        const fromManual = Math.min(current.manualQuantity, remaining);
        current.manualQuantity -= fromManual;
        if (current.classQuantity <= 0 && current.manualQuantity <= 0) {
            counts.delete(stack.itemId);
        } else {
            counts.set(stack.itemId, current);
        }
    }

    return [...counts.values()].filter(
        (row) => row.classQuantity + row.manualQuantity > 0
    );
}

function addInventoryQuantity(
    counts: Map<string, CharacterInventoryRow>,
    itemId: string,
    quantity: number,
    source: "class" | "manual"
) {
    const current = counts.get(itemId) ?? {
        itemId,
        classQuantity: 0,
        manualQuantity: 0,
    };
    if (source === "class") current.classQuantity += quantity;
    else current.manualQuantity += quantity;
    counts.set(itemId, current);
}
