import { api } from "./api";

export interface Character {
  id: number;
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string;
  playerId: number;
  campaignId: number;
}

export async function getCharacters(): Promise<Character[]> {
  const response = await api.get<Character[]>("/characters");

  return response.data;
}