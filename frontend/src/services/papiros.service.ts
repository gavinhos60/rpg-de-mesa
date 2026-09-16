import { api } from "./api";
import type { Papyrus, PapyrusInput } from "../types/papiros";

export async function listPapiros(campaignId: number): Promise<Papyrus[]> {
  const response = await api.get<Papyrus[]>(
    `/campaigns/${campaignId}/papiros`
  );
  return response.data;
}

export async function getPapyrus(
  campaignId: number,
  papyrusId: number
): Promise<Papyrus> {
  const response = await api.get<Papyrus>(
    `/campaigns/${campaignId}/papiros/${papyrusId}`
  );
  return response.data;
}

export async function createPapyrus(
  campaignId: number,
  payload: PapyrusInput
): Promise<Papyrus> {
  const response = await api.post<Papyrus>(
    `/campaigns/${campaignId}/papiros`,
    payload
  );
  return response.data;
}

export async function updatePapyrus(
  campaignId: number,
  papyrusId: number,
  payload: Partial<PapyrusInput>
): Promise<Papyrus> {
  const response = await api.patch<Papyrus>(
    `/campaigns/${campaignId}/papiros/${papyrusId}`,
    payload
  );
  return response.data;
}

export async function publishPapyrus(
  campaignId: number,
  papyrusId: number,
  published: boolean
): Promise<Papyrus> {
  const response = await api.post<Papyrus>(
    `/campaigns/${campaignId}/papiros/${papyrusId}/publish`,
    { published }
  );
  return response.data;
}

export async function deletePapyrus(
  campaignId: number,
  papyrusId: number
): Promise<void> {
  await api.delete(`/campaigns/${campaignId}/papiros/${papyrusId}`);
}
