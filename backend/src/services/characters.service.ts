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

  const alreadyInCampaign = await prisma.character.findFirst({
    where: {
      playerId: authenticatedUserId,
      campaignId,
      NOT: { id: characterId },
    },
    select: { id: true },
  });

  if (alreadyInCampaign) {
    throw new Error("ONE_CHARACTER_PER_CAMPAIGN");
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

    const alreadyInCampaign = await prisma.character.findFirst({
      where: {
        playerId,
        campaignId,
      },
      select: { id: true },
    });

    if (alreadyInCampaign) {
      throw new Error("ONE_CHARACTER_PER_CAMPAIGN");
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

  if (data.campaignId != null && data.campaignId !== existing.campaignId) {
    const alreadyInCampaign = await prisma.character.findFirst({
      where: {
        playerId: authenticatedUserId,
        campaignId: data.campaignId,
        NOT: { id },
      },
      select: { id: true },
    });
    if (alreadyInCampaign) {
      throw new Error("ONE_CHARACTER_PER_CAMPAIGN");
    }
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

export async function removeCharacterFromCampaign(
  characterId: number,
  authenticatedUserId: number
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  if (character.campaignId == null) {
    throw new Error("CHARACTER_NOT_IN_CAMPAIGN");
  }

  const isOwner = character.playerId === authenticatedUserId;
  const membership = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: {
        userId: authenticatedUserId,
        campaignId: character.campaignId,
      },
    },
  });

  const isMaster = membership?.role === "MASTER";

  if (!isOwner && !isMaster) {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  return prisma.character.update({
    where: { id: characterId },
    data: { campaignId: null },
    include: {
      campaign: true,
      player: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function deleteCharacter(
  characterId: number,
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

  await prisma.character.delete({
    where: { id: characterId },
  });

  return { ok: true as const };
}

export async function grantCustomItemToCharacter(
  characterId: number,
  authenticatedUserId: number,
  item: {
    name: string;
    description?: string;
    quantity?: number;
    weight?: number;
  }
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  if (character.campaignId == null) {
    throw new Error("CHARACTER_NOT_IN_CAMPAIGN");
  }

  const membership = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: {
        userId: authenticatedUserId,
        campaignId: character.campaignId,
      },
    },
  });

  if (membership?.role !== "MASTER") {
    throw new Error("MASTER_REQUIRED");
  }

  const name = String(item.name ?? "").trim();
  if (!name) {
    throw new Error("ITEM_NAME_REQUIRED");
  }

  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
  const description = String(item.description ?? "").trim() || undefined;
  const weightRaw = item.weight != null ? Number(item.weight) : undefined;
  const weight =
    weightRaw != null && Number.isFinite(weightRaw) && weightRaw >= 0
      ? weightRaw
      : undefined;

  const master = await prisma.user.findUnique({
    where: { id: authenticatedUserId },
    select: { name: true },
  });

  const sheetRoot =
    character.sheet &&
    typeof character.sheet === "object" &&
    !Array.isArray(character.sheet)
      ? { ...(character.sheet as Record<string, unknown>) }
      : {};

  const equipmentRaw = sheetRoot.equipment;
  const equipment: Record<string, unknown> =
    equipmentRaw &&
    typeof equipmentRaw === "object" &&
    !Array.isArray(equipmentRaw)
      ? { ...(equipmentRaw as Record<string, unknown>) }
      : {
          classId: "",
          choiceSelections: {},
          manualItems: [],
          customItems: [],
        };

  const existingCustom = Array.isArray(equipment.customItems)
    ? (equipment.customItems as Array<Record<string, unknown>>)
    : [];

  const customItem: Record<string, unknown> = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    quantity,
  };
  if (description) customItem.description = description;
  if (weight != null) customItem.weight = weight;
  if (master?.name) customItem.grantedByName = master.name;

  equipment.customItems = [...existingCustom, customItem];
  sheetRoot.equipment = equipment;

  return prisma.character.update({
    where: { id: characterId },
    data: {
      sheet: sheetRoot as Prisma.InputJsonValue,
    },
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
