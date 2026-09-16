import { api } from "./api";
import type { PlayerNote, PlayerNoteInput } from "../types/notes";

export async function listNotes(campaignId: number): Promise<PlayerNote[]> {
  const response = await api.get<PlayerNote[]>(
    `/campaigns/${campaignId}/notes`
  );
  return response.data;
}

export async function createNote(
  campaignId: number,
  payload: PlayerNoteInput
): Promise<PlayerNote> {
  const response = await api.post<PlayerNote>(
    `/campaigns/${campaignId}/notes`,
    payload
  );
  return response.data;
}

export async function updateNote(
  campaignId: number,
  noteId: number,
  payload: Partial<PlayerNoteInput>
): Promise<PlayerNote> {
  const response = await api.patch<PlayerNote>(
    `/campaigns/${campaignId}/notes/${noteId}`,
    payload
  );
  return response.data;
}

export async function deleteNote(
  campaignId: number,
  noteId: number
): Promise<void> {
  await api.delete(`/campaigns/${campaignId}/notes/${noteId}`);
}
