import { api } from "./api";
import type { CharacterFormData, CharacterWallet } from "../types/character";
import { DND_CLASSES } from "../data/dnd/classes";
import { getRaceDisplayName } from "../data/dnd/raceResolution";
import { resolveCharacterWallet } from "../utils/wallet";

export type InventoryItemAction =
  | { kind: "catalog"; itemId: string; quantity: number }
  | { kind: "custom"; customItemId: string; quantity: number };

export interface SavedCharacter {
  id: number;
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string | null;
  sheet?: CharacterFormData | null;
  playerId: number;
  campaignId?: number | null;
  campaign?: {
    id: number;
    name: string;
  } | null;
  player?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateCharacterPayload {
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string | null;
  sheet?: CharacterFormData;
  playerId?: number;
  campaignId?: number | null;
}

export function buildCharacterSummary(data: CharacterFormData): {
  name: string;
  className: string;
  race: string;
  level: number;
} {
  const level =
    data.classes.reduce((total, selection) => total + selection.level, 0) || 1;

  const className =
    data.classes
      .map((selection) => {
        const characterClass = DND_CLASSES.find(
          (item) => item.id === selection.classId
        );
        const subclass = characterClass?.subclasses.find(
          (item) => item.id === selection.subclassId
        );
        const base = characterClass?.name ?? selection.classId;
        return subclass ? `${base} (${subclass.name})` : base;
      })
      .filter(Boolean)
      .join(" / ") || "Aventureiro";

  return {
    name: data.name.trim() || "Sem nome",
    className,
    race: getRaceDisplayName(data) || "Raça desconhecida",
    level,
  };
}

export async function getMyCharacters(): Promise<SavedCharacter[]> {
  const response = await api.get<SavedCharacter[]>("/characters");
  return response.data;
}

export async function getCharacterById(
  id: number
): Promise<SavedCharacter> {
  const response = await api.get<SavedCharacter>(`/characters/${id}`);
  return response.data;
}

export async function createCharacter(
  payload: CreateCharacterPayload
): Promise<SavedCharacter> {
  const response = await api.post<SavedCharacter>("/characters", payload);
  return response.data;
}

export async function createCharacterFromForm(
  data: CharacterFormData,
  options?: { campaignId?: number | null; avatar?: string | null }
): Promise<SavedCharacter> {
  const summary = buildCharacterSummary(data);
  const avatar = options?.avatar ?? data.avatar ?? undefined;
  const sheet: CharacterFormData = {
    ...data,
    wallet: data.wallet ?? resolveCharacterWallet(data),
  };

  return createCharacter({
    ...summary,
    avatar: avatar || undefined,
    campaignId: options?.campaignId ?? null,
    sheet,
  });
}

export async function updateCharacter(
  id: number,
  payload: Partial<CreateCharacterPayload>
): Promise<SavedCharacter> {
  const response = await api.patch<SavedCharacter>(`/characters/${id}`, payload);
  return response.data;
}

export async function updateCharacterFromForm(
  id: number,
  data: CharacterFormData,
  options?: { avatar?: string | null }
): Promise<SavedCharacter> {
  const summary = buildCharacterSummary(data);
  const nextAvatar = options?.avatar !== undefined ? options.avatar : data.avatar ?? null;

  return updateCharacter(id, {
    ...summary,
    avatar: nextAvatar,
    sheet: {
      ...data,
      wallet: data.wallet ?? resolveCharacterWallet(data),
    },
  });
}

export async function assignCharacterToCampaign(
  characterId: number,
  campaignId: number
): Promise<SavedCharacter> {
  const response = await api.post<SavedCharacter>(
    `/characters/${characterId}/assign-campaign`,
    { campaignId }
  );
  return response.data;
}

export async function removeCharacterFromCampaign(
  characterId: number
): Promise<SavedCharacter> {
  const response = await api.post<SavedCharacter>(
    `/characters/${characterId}/remove-campaign`
  );
  return response.data;
}

export async function deleteCharacter(characterId: number): Promise<void> {
  await api.delete(`/characters/${characterId}`);
}

export async function grantCustomItem(
  characterId: number,
  payload: {
    name: string;
    description?: string;
    quantity?: number;
    weight?: number;
  }
): Promise<SavedCharacter> {
  const response = await api.post<SavedCharacter>(
    `/characters/${characterId}/grant-item`,
    payload
  );
  return response.data;
}

export async function updateCharacterWallet(
  characterId: number,
  wallet: CharacterWallet
): Promise<SavedCharacter> {
  const response = await api.patch<SavedCharacter>(
    `/characters/${characterId}/wallet`,
    wallet
  );
  return response.data;
}

export async function discardCharacterItem(
  characterId: number,
  payload: InventoryItemAction
): Promise<SavedCharacter> {
  const response = await api.post<SavedCharacter>(
    `/characters/${characterId}/discard-item`,
    payload
  );
  return response.data;
}

export async function transferCharacterItem(
  characterId: number,
  payload: InventoryItemAction & { targetCharacterId: number }
): Promise<{ from: SavedCharacter; to: SavedCharacter }> {
  const response = await api.post<{ from: SavedCharacter; to: SavedCharacter }>(
    `/characters/${characterId}/transfer-item`,
    payload
  );
  return response.data;
}
