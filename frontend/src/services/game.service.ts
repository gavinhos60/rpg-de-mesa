import { api } from "./api";
import type { GameSessionSummary } from "../types/game";

export async function startGameSession(
  campaignId: number
): Promise<GameSessionSummary> {
  const response = await api.post<GameSessionSummary>(
    `/campaigns/${campaignId}/sessions/start`
  );
  return response.data;
}

export async function getActiveGameSession(
  campaignId: number
): Promise<GameSessionSummary | null> {
  const response = await api.get<GameSessionSummary | null>(
    `/campaigns/${campaignId}/sessions/active`
  );
  return response.data;
}

export async function closeGameSession(
  campaignId: number,
  sessionId: number
): Promise<GameSessionSummary> {
  const response = await api.post<GameSessionSummary>(
    `/campaigns/${campaignId}/sessions/${sessionId}/close`
  );
  return response.data;
}
