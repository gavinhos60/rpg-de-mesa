import { getEquipmentImageUrl } from "../../data/dnd/equipmentImages";

interface EquipmentCatalogImageProps {
    itemId: string;
    className?: string;
}

export function EquipmentCatalogImage({
    itemId,
    className = "h-14 w-14 shrink-0 rounded border object-cover",
}: EquipmentCatalogImageProps) {
    return (
        <img
            src={getEquipmentImageUrl(itemId)}
            alt=""
            className={className}
            style={{ borderColor: "var(--color-border)" }}
        />
    );
}
