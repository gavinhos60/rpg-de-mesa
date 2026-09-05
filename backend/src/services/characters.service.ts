import { prisma } from "../lib/prisma";

export async function getCharacters() {
  return prisma.character.findMany({
    include: {
      player: true,
      campaign: true,
    },
  });
}

export async function createCharacter(data: {
  name: string;
  className: string;
  race: string;
  level: number;
  avatar?: string;
  playerId: number;
  campaignId: number;
  authenticatedUserId: number;
}) {
  const {
    authenticatedUserId,
    playerId,
    campaignId,
    ...characterData
  } = data;

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

  // PLAYER só pode criar personagem para si mesmo.
  if (
    member.role === "PLAYER" &&
    playerId !== authenticatedUserId
  ) {
    throw new Error("PLAYER_CANNOT_CREATE_FOR_OTHER");
  }

  // O jogador escolhido precisa ser membro da campanha.
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

  return prisma.character.create({
    data: {
      ...characterData,
      playerId,
      campaignId,
    },
  });
}

export async function updateCharacter(
  id: number,
  data: {
    playerId?: number;
    campaignId?: number;
  }
) {
  return prisma.character.update({
    where: { id },
    data,
    include: {
      player: true,
      campaign: true,
    },
  });
}