export interface Papyrus {
  id: number;
  campaignId: number;
  title: string;
  body: string;
  imageUrl?: string | null;
  published: boolean;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface PapyrusInput {
  title: string;
  body: string;
  imageUrl?: string | null;
  published?: boolean;
}
