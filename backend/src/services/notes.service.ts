import { prisma } from "../lib/prisma";

async function ensureCampaignMember(userId: number, campaignId: number) {
  const member = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
  });

  if (!member) {
    throw new Error("NOT_CAMPAIGN_MEMBER");
  }

  return member;
}

export async function listPlayerNotes(
  campaignId: number,
  authenticatedUserId: number
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  return prisma.playerNote.findMany({
    where: { campaignId, userId: authenticatedUserId },
    orderBy: { updatedAt: "desc" },
  });
}

function normalizeNoteContent(data: { body?: string; imageUrl?: string | null }) {
  const body = String(data.body ?? "").trim();
  const imageUrl = data.imageUrl?.trim() ? String(data.imageUrl).trim() : null;
  if (!body && !imageUrl) throw new Error("NOTE_BODY_REQUIRED");
  return { body, imageUrl };
}

export async function createPlayerNote(
  campaignId: number,
  authenticatedUserId: number,
  data: { title?: string; body?: string; imageUrl?: string | null }
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  const title = String(data.title ?? "").trim();
  const { body, imageUrl } = normalizeNoteContent(data);

  return prisma.playerNote.create({
    data: {
      campaignId,
      userId: authenticatedUserId,
      title,
      body,
      imageUrl,
    },
  });
}

export async function updatePlayerNote(
  campaignId: number,
  noteId: number,
  authenticatedUserId: number,
  data: { title?: string; body?: string; imageUrl?: string | null }
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  const existing = await prisma.playerNote.findFirst({
    where: { id: noteId, campaignId, userId: authenticatedUserId },
  });
  if (!existing) throw new Error("NOTE_NOT_FOUND");

  const update: { title?: string; body?: string; imageUrl?: string | null } =
    {};
  if (data.title != null) update.title = String(data.title).trim();
  if (data.body != null || data.imageUrl !== undefined) {
    const { body, imageUrl } = normalizeNoteContent({
      body: data.body ?? existing.body,
      imageUrl:
        data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
    });
    update.body = body;
    update.imageUrl = imageUrl;
  }

  return prisma.playerNote.update({
    where: { id: noteId },
    data: update,
  });
}

export async function deletePlayerNote(
  campaignId: number,
  noteId: number,
  authenticatedUserId: number
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  const existing = await prisma.playerNote.findFirst({
    where: { id: noteId, campaignId, userId: authenticatedUserId },
  });
  if (!existing) throw new Error("NOTE_NOT_FOUND");

  await prisma.playerNote.delete({ where: { id: noteId } });
}
