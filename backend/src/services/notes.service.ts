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

export async function createPlayerNote(
  campaignId: number,
  authenticatedUserId: number,
  data: { title?: string; body: string }
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  const title = String(data.title ?? "").trim();
  const body = String(data.body ?? "").trim();
  if (!body) throw new Error("NOTE_BODY_REQUIRED");

  return prisma.playerNote.create({
    data: {
      campaignId,
      userId: authenticatedUserId,
      title,
      body,
    },
  });
}

export async function updatePlayerNote(
  campaignId: number,
  noteId: number,
  authenticatedUserId: number,
  data: { title?: string; body?: string }
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  const existing = await prisma.playerNote.findFirst({
    where: { id: noteId, campaignId, userId: authenticatedUserId },
  });
  if (!existing) throw new Error("NOTE_NOT_FOUND");

  const update: { title?: string; body?: string } = {};
  if (data.title != null) update.title = String(data.title).trim();
  if (data.body != null) {
    const body = String(data.body).trim();
    if (!body) throw new Error("NOTE_BODY_REQUIRED");
    update.body = body;
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
