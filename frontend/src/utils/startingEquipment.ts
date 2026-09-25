import { DND_CLASSES } from "../data/dnd/classes";
import type {
    EquipmentAlternative,
    EquipmentChoice,
    EquipmentStack,
} from "../types/character";

export function resolveEquipmentChoiceId(
    choice: EquipmentChoice,
    selections: Record<string, string> | undefined
): string {
    const raw = selections?.[choice.id];
    if (raw != null && String(raw).trim() !== "") {
        return String(raw).trim();
    }
    return choice.alternatives[0]?.id ?? "";
}

export function resolveEquipmentAlternative(
    choice: EquipmentChoice,
    selections: Record<string, string> | undefined
): EquipmentAlternative | undefined {
    const selectedId = resolveEquipmentChoiceId(choice, selections);
    return (
        choice.alternatives.find((alternative) => alternative.id === selectedId) ??
        choice.alternatives[0]
    );
}

export function getChoiceStacks(
    choice: EquipmentChoice,
    selections: Record<string, string> | undefined
): EquipmentStack[] {
    return resolveEquipmentAlternative(choice, selections)?.items ?? [];
}

export function buildDefaultChoiceSelections(
    classId: string
): Record<string, string> {
    const starting = DND_CLASSES.find((item) => item.id === classId)
        ?.startingEquipment;
    if (!starting) return {};
    return Object.fromEntries(
        starting.choices.map((choice) => [
            choice.id,
            resolveEquipmentChoiceId(choice, {}),
        ])
    );
}

/** Normaliza escolhas: preenche faltantes e corrige strings vazias. */
export function normalizeChoiceSelections(
    classId: string,
    selections: Record<string, string> | undefined
): Record<string, string> {
    const starting = DND_CLASSES.find((item) => item.id === classId)
        ?.startingEquipment;
    if (!starting) return { ...(selections ?? {}) };

    const merged = {
        ...buildDefaultChoiceSelections(classId),
        ...(selections ?? {}),
    };

    return Object.fromEntries(
        starting.choices.map((choice) => [
            choice.id,
            resolveEquipmentChoiceId(choice, merged),
        ])
    );
}

export function isEquipmentChoiceComplete(
    choice: EquipmentChoice,
    selections: Record<string, string> | undefined
): boolean {
    const id = resolveEquipmentChoiceId(choice, selections);
    if (!id) return false;
    return choice.alternatives.some((alternative) => alternative.id === id);
}
