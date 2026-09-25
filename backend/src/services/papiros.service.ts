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

async function broadcastPapyri(campaignId: number) {
  const published = await prisma.papyrus.findMany({
    where: { campaignId, published: true },
    orderBy: { updatedAt: "desc" },
  });
  await emitToCampaignSessions(campaignId, "papyrus:state", published);
}

export async function listPapyri(
  campaignId: number,
  authenticatedUserId: number
) {
  const member = await ensureCampaignMember(authenticatedUserId, campaignId);

  if (member.role === "MASTER") {
    return prisma.papyrus.findMany({
      where: { campaignId },
      orderBy: { updatedAt: "desc" },
    });
  }

  return prisma.papyrus.findMany({
    where: {
      campaignId,
      published: true,
      audienceUserIds: { has: authenticatedUserId },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPapyrus(
  campaignId: number,
  papyrusId: number,
  authenticatedUserId: number
) {
  const member = await ensureCampaignMember(authenticatedUserId, campaignId);

  const papyrus = await prisma.papyrus.findFirst({
    where: { id: papyrusId, campaignId },
  });

  if (!papyrus) {
    throw new Error("PAPYRUS_NOT_FOUND");
  }

  if (member.role !== "MASTER") {
    if (
      !papyrus.published ||
      !papyrus.audienceUserIds.includes(authenticatedUserId)
    ) {
      throw new Error("PAPYRUS_NOT_FOUND");
    }
  }

  return papyrus;
}

export async function createPapyrus(
  campaignId: number,
  authenticatedUserId: number,
  data: {
    title: string;
    body: string;
    imageUrl?: string | null;
    published?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const title = String(data.title ?? "").trim();
  const body = String(data.body ?? "").trim();
  if (!title) throw new Error("PAPYRUS_TITLE_REQUIRED");
  if (!body) throw new Error("PAPYRUS_BODY_REQUIRED");

  const imageUrl = data.imageUrl != null ? String(data.imageUrl).trim() || null : null;
  const published = Boolean(data.published);

  const papyrus = await prisma.papyrus.create({
    data: {
      campaignId,
      title,
      body,
      imageUrl,
      published,
      createdById: authenticatedUserId,
    },
  });

  if (published) {
    await broadcastPapyri(campaignId);
  }

  return papyrus;
}

export async function updatePapyrus(
  campaignId: number,
  papyrusId: number,
  authenticatedUserId: number,
  data: {
    title?: string;
    body?: string;
    imageUrl?: string | null;
    published?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.papyrus.findFirst({
    where: { id: papyrusId, campaignId },
  });
  if (!existing) throw new Error("PAPYRUS_NOT_FOUND");

  const update: {
    title?: string;
    body?: string;
    imageUrl?: string | null;
    published?: boolean;
  } = {};

  if (data.title != null) {
    const title = String(data.title).trim();
    if (!title) throw new Error("PAPYRUS_TITLE_REQUIRED");
    update.title = title;
  }
  if (data.body != null) {
    const body = String(data.body).trim();
    if (!body) throw new Error("PAPYRUS_BODY_REQUIRED");
    update.body = body;
  }
  if (data.imageUrl !== undefined) {
    update.imageUrl =
      data.imageUrl == null ? null : String(data.imageUrl).trim() || null;
  }
  if (data.published != null) {
    update.published = Boolean(data.published);
  }

  const papyrus = await prisma.papyrus.update({
    where: { id: papyrusId },
    data: update,
  });

  if (
    existing.published ||
    papyrus.published ||
    data.published != null
  ) {
    await broadcastPapyri(campaignId);
  }

  return papyrus;
}

export async function setPapyrusPublished(
  campaignId: number,
  papyrusId: number,
  authenticatedUserId: number,
  published: boolean,
  audienceUserIds?: unknown
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.papyrus.findFirst({
    where: { id: papyrusId, campaignId },
  });
  if (!existing) throw new Error("PAPYRUS_NOT_FOUND");

  if (!published) {
    const papyrus = await prisma.papyrus.update({
      where: { id: papyrusId },
      data: { published: false, audienceUserIds: [] },
    });
    await broadcastPapyri(campaignId);
    return papyrus;
  }

  const audience = await normalizePlayerAudience(campaignId, audienceUserIds);
  const papyrus = await prisma.papyrus.update({
    where: { id: papyrusId },
    data: { published: true, audienceUserIds: audience },
  });
  await broadcastPapyri(campaignId);
  return papyrus;
}

export async function deletePapyrus(
  campaignId: number,
  papyrusId: number,
  authenticatedUserId: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.papyrus.findFirst({
    where: { id: papyrusId, campaignId },
  });
  if (!existing) throw new Error("PAPYRUS_NOT_FOUND");

  await prisma.papyrus.delete({ where: { id: papyrusId } });

  if (existing.published) {
    await broadcastPapyri(campaignId);
  }

  return { ok: true as const };
}
