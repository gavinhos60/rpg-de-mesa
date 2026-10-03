import { api } from "./api";
import type { CustomMonsterSheet } from "../types/customMonster";

export type SavedCustomMonster = {
  id: number;
  name: string;
  avatar?: string | null;
  sheet?: CustomMonsterSheet | null;
  userId: number;
  user?: { id: number; name: string };
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCustomMonsterPayload = {
  name: string;
  avatar?: string | null;
  sheet: CustomMonsterSheet;
};

export async function getMyMonsters(): Promise<SavedCustomMonster[]> {
  const { data } = await api.get<SavedCustomMonster[]>("/monsters");
  return data;
}

export async function getCampaignMonsters(
  campaignId: number
): Promise<SavedCustomMonster[]> {
  const { data } = await api.get<SavedCustomMonster[]>(
    `/monsters/campaign/${campaignId}`
  );
  return data;
}

export async function getMonsterById(id: number): Promise<SavedCustomMonster> {
  const { data } = await api.get<SavedCustomMonster>(`/monsters/${id}`);
  return data;
}

export async function createMonster(
  payload: CreateCustomMonsterPayload
): Promise<SavedCustomMonster> {
  const { data } = await api.post<SavedCustomMonster>("/monsters", payload);
  return data;
}

export async function updateMonster(
  id: number,
  payload: Partial<CreateCustomMonsterPayload>
): Promise<SavedCustomMonster> {
  const { data } = await api.patch<SavedCustomMonster>(
    `/monsters/${id}`,
    payload
  );
  return data;
}

export async function deleteMonster(id: number): Promise<void> {
  await api.delete(`/monsters/${id}`);
}
