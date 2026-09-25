import type { Ability } from "./gameTypes";

export type ItemBonusStat = Ability | "ac";

type EquipmentSlotRef =
  | { kind: "catalog"; itemId: string }
  | { kind: "custom"; customItemId: string };

type CustomInventoryItem = {
  id: string;
  quantity?: number;
  itemBonus?: {
    stat?: ItemBonusStat;
    value?: number;
  };
};

export type EquipmentSheetSlice = {
  attunedSlots?: unknown;
  activeSlots?: unknown;
  customItems?: CustomInventoryItem[];
};

const ATTUNED_SLOT_COUNT = 3;
const ACTIVE_SLOT_COUNT = 5;

const ZERO_BONUSES: Record<ItemBonusStat, number> = {
  ac: 0,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
};

function parseSlotRef(raw: unknown): EquipmentSlotRef | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const entry = raw as Record<string, unknown>;
  if (entry.kind === "catalog") {
    const itemId = String(entry.itemId ?? "").trim();
    return itemId ? { kind: "catalog", itemId } : null;
  }
  if (entry.kind === "custom") {
    const customItemId = String(entry.customItemId ?? "").trim();
    return customItemId ? { kind: "custom", customItemId } : null;
  }
  return null;
}

function normalizeSlotTuple(
  raw: unknown,
  count: number
): Array<EquipmentSlotRef | null> {
  const slots: Array<EquipmentSlotRef | null> = Array.from(
    { length: count },
    () => null
  );
  if (!Array.isArray(raw)) return slots;
  for (let i = 0; i < count; i++) {
    slots[i] = parseSlotRef(raw[i]);
  }
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const ref = slots[i];
    if (!ref) continue;
    const key =
      ref.kind === "catalog"
        ? `catalog:${ref.itemId}`
        : `custom:${ref.customItemId}`;
    if (seen.has(key)) slots[i] = null;
    else seen.add(key);
  }
  return slots;
}

function getEquippedSlotRefs(
  equipment: EquipmentSheetSlice | undefined
): EquipmentSlotRef[] {
  if (!equipment) return [];
  const attuned = normalizeSlotTuple(
    equipment.attunedSlots,
    ATTUNED_SLOT_COUNT
  );
  const active = normalizeSlotTuple(equipment.activeSlots, ACTIVE_SLOT_COUNT);
  return [...attuned, ...active].filter(
    (ref): ref is EquipmentSlotRef => ref != null
  );
}

function resolveSlotItemBonus(
  equipment: EquipmentSheetSlice | undefined,
  ref: EquipmentSlotRef
): { stat: ItemBonusStat; value: number } | null {
  if (ref.kind !== "custom") return null;
  const item = (equipment?.customItems ?? []).find(
    (entry) => entry.id === ref.customItemId
  );
  if (!item?.itemBonus?.stat || !item.itemBonus.value) return null;
  const value = Math.floor(Number(item.itemBonus.value));
  if (!Number.isFinite(value) || value <= 0) return null;
  const stat = item.itemBonus.stat;
  if (!stat || !(stat in ZERO_BONUSES)) return null;
  return { stat, value };
}

/** Soma bônus de itens equipados (slots ativos + sintonizados), espelhando o frontend. */
export function sumEquipmentBonuses(
  equipment: EquipmentSheetSlice | undefined
): Record<ItemBonusStat, number> {
  const totals = { ...ZERO_BONUSES };
  for (const ref of getEquippedSlotRefs(equipment)) {
    const bonus = resolveSlotItemBonus(equipment, ref);
    if (!bonus) continue;
    totals[bonus.stat] += Math.max(0, Math.floor(bonus.value));
  }
  return totals;
}

export function applyEquipmentToAbilityScores(
  scores: Record<Ability, number>,
  equipment: EquipmentSheetSlice | undefined,
  capScore: (value: number) => number
): void {
  const bonuses = sumEquipmentBonuses(equipment);
  for (const ability of Object.keys(scores) as Ability[]) {
    const delta = bonuses[ability] ?? 0;
    if (delta !== 0) {
      scores[ability] = capScore(scores[ability] + delta);
    }
  }
}
