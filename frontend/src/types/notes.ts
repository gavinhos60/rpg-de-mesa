export interface PlayerNote {
  id: number;
  campaignId: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerNoteInput {
  title?: string;
  body: string;
}
