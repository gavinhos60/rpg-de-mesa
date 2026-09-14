import { prisma } from "../lib/prisma";
import type { Prisma } from "../generated/prisma/client";

export async function getMyCharacters(playerId: number) {
  return prisma.character.findMany({
    where: { playerId },
    orderBy: { id: "desc" },
    include: {
      campaign: true,
    },
  });
}

export async function getCharacterById(
  id: number,
  authenticatedUserId: number
) {
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      campaign: true,
      player: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  if (character.playerId === authenticatedUserId) {
    return character;
  }

  if (character.campaignId != null) {
    const membership = await prisma.campaignMember.findUnique({
      where: {
        userId_campaignId: {
          userId: authenticatedUserId,
          campaignId: character.campaignId,
        },
      },
    });

    if (membership) {
      return character;
    }
  }

  throw new Error("CHARACTER_FORBIDDEN");
}

export async function assignCharacterToCampaign(
  characterId: number,
  campaignId: number,
  authenticatedUserId: number
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  if (character.playerId !== authenticatedUserId) {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  const membership = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: {
        userId: authenticatedUserId,
        campaignId,
      },
    },
  });

  if (!membership) {
    throw new Error("NOT_CAMPAIGN_MEMBER");
  }

  if (character.campaignId === campaignId) {
    throw new Error("CHARACTER_ALREADY_IN_CAMPAIGN");
  }

  return prisma.character.update({
    where: { id: characterId },
    data: { campaignId },
    include: {
      campaign: true,
      player: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function createCharacter(data: {
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string;
  sheet?: Prisma.InputJsonValue;
  playerId?: number;
  campaignId?: number | null;
  authenticatedUserId: number;
}) {
  const {
    authenticatedUserId,
    campaignId,
    sheet,
    ...characterData
  } = data;

  const playerId = data.playerId ?? authenticatedUserId;

  if (campaignId != null) {
    const member = await prisma.campaignMember.findUnique({
      where: {
        userId_campaignId: {
          userId: authenticatedUserId,
          campaignId,
        },
      },
    });

    if (!member) {
      throw new Error("NOT_CAMPAIGN_MEMBER");
    }

    if (member.role === "PLAYER" && playerId !== authenticatedUserId) {
      throw new Error("PLAYER_CANNOT_CREATE_FOR_OTHER");
    }

    const targetPlayer = await prisma.campaignMember.findUnique({
      where: {
        userId_campaignId: {
          userId: playerId,
          campaignId,
        },
      },
    });

    if (!targetPlayer) {
      throw new Error("TARGET_NOT_CAMPAIGN_MEMBER");
    }
  } else if (playerId !== authenticatedUserId) {
    throw new Error("PLAYER_CANNOT_CREATE_FOR_OTHER");
  }

  return prisma.character.create({
    data: {
      name: characterData.name,
      className: characterData.className,
      race: characterData.race,
      level: characterData.level,
      avatar: characterData.avatar,
      sheet: sheet ?? undefined,
      playerId,
      campaignId: campaignId ?? null,
    },
    include: {
      campaign: true,
    },
  });
}

export async function updateCharacter(
  id: number,
  authenticatedUserId: number,
  data: {
    name?: string;
    className?: string;
    race?: string;
    level?: number;
    avatar?: string | null;
    sheet?: Prisma.InputJsonValue;
    playerId?: number;
    campaignId?: number | null;
  }
) {
  const existing = await prisma.character.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  if (existing.playerId !== authenticatedUserId) {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  return prisma.character.update({
    where: { id },
    data,
    include: {
      player: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      campaign: true,
    },
  });
}
