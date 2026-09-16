import { api } from "./api";
import type {
  DeliverItemResult,
  Shop,
  ShopDelivery,
  ShopInput,
  ShopItem,
  ShopItemInput,
} from "../types/mercado";

export async function listShops(campaignId: number): Promise<Shop[]> {
  const response = await api.get<Shop[]>(
    `/campaigns/${campaignId}/mercado/shops`
  );
  return response.data;
}

export async function getShop(
  campaignId: number,
  shopId: number
): Promise<Shop> {
  const response = await api.get<Shop>(
    `/campaigns/${campaignId}/mercado/shops/${shopId}`
  );
  return response.data;
}

export async function createShop(
  campaignId: number,
  payload: ShopInput
): Promise<Shop> {
  const response = await api.post<Shop>(
    `/campaigns/${campaignId}/mercado/shops`,
    payload
  );
  return response.data;
}

export async function updateShop(
  campaignId: number,
  shopId: number,
  payload: Partial<ShopInput>
): Promise<Shop> {
  const response = await api.patch<Shop>(
    `/campaigns/${campaignId}/mercado/shops/${shopId}`,
    payload
  );
  return response.data;
}

export async function deleteShop(
  campaignId: number,
  shopId: number
): Promise<void> {
  await api.delete(`/campaigns/${campaignId}/mercado/shops/${shopId}`);
}

export async function createShopItem(
  campaignId: number,
  shopId: number,
  payload: ShopItemInput
): Promise<ShopItem> {
  const response = await api.post<ShopItem>(
    `/campaigns/${campaignId}/mercado/shops/${shopId}/items`,
    payload
  );
  return response.data;
}

export async function updateShopItem(
  campaignId: number,
  shopId: number,
  itemId: number,
  payload: Partial<ShopItemInput>
): Promise<ShopItem> {
  const response = await api.patch<ShopItem>(
    `/campaigns/${campaignId}/mercado/shops/${shopId}/items/${itemId}`,
    payload
  );
  return response.data;
}

export async function deleteShopItem(
  campaignId: number,
  shopId: number,
  itemId: number
): Promise<void> {
  await api.delete(
    `/campaigns/${campaignId}/mercado/shops/${shopId}/items/${itemId}`
  );
}

export async function deliverShopItem(
  campaignId: number,
  shopId: number,
  itemId: number,
  payload: { characterId: number; quantity?: number }
): Promise<DeliverItemResult> {
  const response = await api.post<DeliverItemResult>(
    `/campaigns/${campaignId}/mercado/shops/${shopId}/items/${itemId}/deliver`,
    payload
  );
  return response.data;
}

export async function listDeliveries(
  campaignId: number,
  shopId?: number
): Promise<ShopDelivery[]> {
  const response = await api.get<ShopDelivery[]>(
    `/campaigns/${campaignId}/mercado/deliveries`,
    { params: shopId != null ? { shopId } : undefined }
  );
  return response.data;
}
