import { api } from "./api";

export interface CampaignPlayer {
  id: number;
  name: string;
  email: string;
}

export interface CampaignMember {
  id: number;
  userId: number;
  campaignId: number;
  role: "MASTER" | "PLAYER";
  user: CampaignPlayer;
}

export interface CampaignCharacter {
  id: number;
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string;
  playerId: number;
  campaignId: number;
  player: CampaignPlayer;
}

export interface Campaign {
  id: number;
  name: string;
  characters: CampaignCharacter[];
}

export interface CampaignDetails extends Campaign {
  members: CampaignMember[];
}

export async function getCampaigns(): Promise<Campaign[]> {
  const response = await api.get<Campaign[]>("/campaigns");

  return response.data;
}

export async function getCampaignById(
  id: number
): Promise<CampaignDetails> {
  const response = await api.get<CampaignDetails>(
    `/campaigns/${id}`
  );

  return response.data;
}

export async function createCampaign(name: string) {
  const response = await api.post("/campaigns", {
    name,
  });

  return response.data;
}

export interface CreateCharacterRequest {
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string;
  playerId: number;
  campaignId: number;
}

export async function createCharacter(
  data: CreateCharacterRequest
) {
  const response = await api.post(
    "/characters",
    data
  );

  return response.data;
}

export async function addPlayerByEmail(
  campaignId: number,
  email: string
) {
  const response = await api.post(
    `/campaigns/${campaignId}/members/player`,
    {
      email,
    }
  );

  return response.data;
}
export async function deleteCampaign(
    campaignId: number
) {
    await api.delete(
        `/campaigns/${campaignId}`
    );
}