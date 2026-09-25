import { prisma } from "../lib/prisma";
import { emitToCampaignSessions } from "../socket/io";
import { normalizePlayerAudience } from "./publishAudience.service";

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

async function ensureMaster(userId: number, campaignId: number) {
  const member = await ensureCampaignMember(userId, campaignId);
  if (member.role !== "MASTER") {
    throw new Error("MASTER_REQUIRED");
  }
  return member;
}

async function broadcastPublishedNotes(campaignId: number) {
  const published = await prisma.playerNote.findMany({
    where: { campaignId, published: true },
    orderBy: { updatedAt: "desc" },
  });
  await emitToCampaignSessions(campaignId, "note:state", published);
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

export async function listPublishedNotesForPlayer(
  campaignId: number,
  authenticatedUserId: number
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  return prisma.playerNote.findMany({
    where: {
      campaignId,
      published: true,
      audienceUserIds: { has: authenticatedUserId },
    },
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

  const note = await prisma.playerNote.update({
    where: { id: noteId },
    data: update,
  });

  if (existing.published) {
    await broadcastPublishedNotes(campaignId);
  }

  return note;
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

  if (existing.published) {
    await broadcastPublishedNotes(campaignId);
  }
}

export async function setNotePublished(
  campaignId: number,
  noteId: number,
  authenticatedUserId: number,
  published: boolean,
  audienceUserIds?: unknown
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.playerNote.findFirst({
    where: { id: noteId, campaignId, userId: authenticatedUserId },
  });
  if (!existing) throw new Error("NOTE_NOT_FOUND");

  if (!published) {
    const note = await prisma.playerNote.update({
      where: { id: noteId },
      data: { published: false, audienceUserIds: [] },
    });
    await broadcastPublishedNotes(campaignId);
    return note;
  }

  const audience = await normalizePlayerAudience(campaignId, audienceUserIds);
  const note = await prisma.playerNote.update({
    where: { id: noteId },
    data: { published: true, audienceUserIds: audience },
  });
  await broadcastPublishedNotes(campaignId);
  return note;
}
