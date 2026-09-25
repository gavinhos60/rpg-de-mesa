import { getEquipmentItem } from "./equipment";
import { EQUIPMENT_IMAGE_URL_BY_ID } from "./equipmentImageMap.generated";

const FALLBACK = "/art/equipment/items/burglar-pack.png";

/** PNG local (SRD via dnd5eapi) para item de catálogo. */
export function getEquipmentImageUrl(itemId: string): string {
    if (EQUIPMENT_IMAGE_URL_BY_ID[itemId]) {
        return EQUIPMENT_IMAGE_URL_BY_ID[itemId];
    }
    const item = getEquipmentItem(itemId);
    if (!item) {
        return FALLBACK;
    }
    return FALLBACK;
}
