/** @deprecated Import from `./equipmentSlots` */
export {
    ATTUNED_SLOT_COUNT,
    buildPickableInventory,
    equipmentRefKey as attunedRefKey,
    equipmentRefsEqual as attunedRefsEqual,
    normalizeAttunedSlots,
    resolveSlotEntry as resolveAttunedEntry,
} from "./equipmentSlots";

export type { PickableInventoryEntry } from "./equipmentSlots";

import type { AttunedItemRef } from "../types/character";

export type { AttunedItemRef };
