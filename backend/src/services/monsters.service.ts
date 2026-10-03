import { prisma } from "../lib/prisma";
import type { Prisma } from "../generated/prisma/client";

export async function getMyCustomMonsters(userId: number) {
  return prisma.customMonster.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCustomMonstersForCampaign(
  campaignId: number,
  userId: number
) {
  const membership = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: { userId, campaignId },
    },
  });
  if (!membership) {
    throw new Error("NOT_CAMPAIGN_MEMBER");
  }

  const members = await prisma.campaignMember.findMany({
    where: { campaignId },
    select: { userId: true },
  });
  const userIds = [...new Set(members.map((m) => m.userId))];

  return prisma.customMonster.findMany({
    where: { userId: { in: userIds } },
    orderBy: [{ name: "asc" }, { id: "desc" }],
    include: {
      user: { select: { id: true, name: true } },
    },
  });
}

export async function getCustomMonsterById(id: number, userId: number) {
  const monster = await prisma.customMonster.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
  if (!monster) {
    throw new Error("MONSTER_NOT_FOUND");
  }
  if (monster.userId === userId) {
    return monster;
  }

  const sharedCampaign = await prisma.campaignMember.findFirst({
    where: {
      userId,
      campaign: {
        members: { some: { userId: monster.userId } },
      },
    },
  });
  if (!sharedCampaign) {
    throw new Error("MONSTER_FORBIDDEN");
  }
  return monster;
}

export async function createCustomMonster(
  userId: number,
  data: {
    name: string;
    avatar?: string | null;
    sheet?: Prisma.InputJsonValue;
  }
) {
  const name = data.name?.trim();
  if (!name) {
    throw new Error("MONSTER_NAME_REQUIRED");
  }
  return prisma.customMonster.create({
    data: {
      name,
      avatar: data.avatar ?? null,
      sheet: data.sheet ?? {},
      userId,
    },
  });
}

export async function updateCustomMonster(
  id: number,
  userId: number,
  data: {
    name?: string;
    avatar?: string | null;
    sheet?: Prisma.InputJsonValue;
  }
) {
  const existing = await prisma.customMonster.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("MONSTER_NOT_FOUND");
  }
  if (existing.userId !== userId) {
    throw new Error("MONSTER_FORBIDDEN");
  }
  const name = data.name?.trim();
  if (name !== undefined && !name) {
    throw new Error("MONSTER_NAME_REQUIRED");
  }
  return prisma.customMonster.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      ...(data.sheet !== undefined ? { sheet: data.sheet } : {}),
    },
  });
}

export async function deleteCustomMonster(id: number, userId: number) {
  const existing = await prisma.customMonster.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("MONSTER_NOT_FOUND");
  }
  if (existing.userId !== userId) {
    throw new Error("MONSTER_FORBIDDEN");
  }
  await prisma.customMonster.delete({ where: { id } });
}
