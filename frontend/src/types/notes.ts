export interface PlayerNote {
  id: number;
  campaignId: number;
  userId: number;
  title: string;
  body: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerNoteInput {
  title?: string;
  body?: string;
  imageUrl?: string | null;
}
