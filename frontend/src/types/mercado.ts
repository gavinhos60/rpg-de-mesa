export interface ShopItem {
  id: number;
  shopId: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: string;
  quantity?: number | null;
  unlimitedStock: boolean;
  category: string;
  extraInfo?: string | null;
  bonusStat?: string | null;
  bonusValue?: number | null;
  requiresAttunement?: boolean;
  weight?: number | null;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: number;
  campaignId: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  items: ShopItem[];
}

export interface ShopDelivery {
  id: number;
  campaignId: number;
  shopId: number;
  shopItemId: number;
  shopItemName: string;
  shopName: string;
  characterId: number;
  characterName: string;
  playerId?: number | null;
  playerName?: string | null;
  quantity: number;
  deliveredById: number;
  deliveredByName: string;
  createdAt: string;
}

export interface ShopInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isOpen?: boolean;
}

export interface ShopItemInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price: string;
  quantity?: number | null;
  unlimitedStock?: boolean;
  category: string;
  extraInfo?: string | null;
  bonusStat?: string | null;
  bonusValue?: number | null;
  requiresAttunement?: boolean;
  weight?: number | null;
  available?: boolean;
}

export interface DeliverItemResult {
  item: ShopItem;
  character: unknown;
  delivery: ShopDelivery;
}

export function isItemSoldOut(item: ShopItem): boolean {
  if (!item.available) return true;
  if (item.unlimitedStock) return false;
  return (item.quantity ?? 0) <= 0;
}
