import type { Papyrus } from "../types/papiros";
import type { PlayerNote } from "../types/notes";

/** Adapta anotação publicada para o overlay de pergaminho. */
export function publishedNoteAsPapyrus(note: PlayerNote): Papyrus {
  return {
    id: note.id,
    campaignId: note.campaignId,
    title: note.title.trim() || "Anotação do mestre",
    body: note.body,
    imageUrl: note.imageUrl ?? null,
    published: true,
    audienceUserIds: note.audienceUserIds ?? [],
    createdById: note.userId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}
