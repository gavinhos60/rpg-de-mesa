import { prisma } from "../lib/prisma";

export async function getCampaignMembers(
  campaignId: number
) {
  return prisma.campaignMember.findMany({
    where: {
      campaignId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function ensureMaster(
  userId: number,
  campaignId: number
) {
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

  if (member.role !== "MASTER") {
    throw new Error("MASTER_REQUIRED");
  }

  return member;
}

export async function addCampaignMember(data: {
  userId: number;
  campaignId: number;
  role: "MASTER" | "PLAYER";
  authenticatedUserId: number;
}) {
  await ensureMaster(
    data.authenticatedUserId,
    data.campaignId
  );

  return prisma.campaignMember.create({
    data: {
      userId: data.userId,
      campaignId: data.campaignId,
      role: data.role,
    },
    include: {
      user: {
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

export async function addPlayerByEmail(
  campaignId: number,
  email: string,
  authenticatedUserId: number
) {
  // Somente MASTER pode adicionar jogadores
  await ensureMaster(
    authenticatedUserId,
    campaignId
  );

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const existingMember =
    await prisma.campaignMember.findUnique({
      where: {
        userId_campaignId: {
          userId: user.id,
          campaignId,
        },
      },
    });

  if (existingMember) {
    throw new Error("USER_ALREADY_MEMBER");
  }

  return prisma.campaignMember.create({
    data: {
      userId: user.id,
      campaignId,
      role: "PLAYER",
    },
    include: {
      user: {
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

export async function updateCampaignMember(
  userId: number,
  campaignId: number,
  role: "MASTER" | "PLAYER",
  authenticatedUserId: number
) {
  await ensureMaster(
    authenticatedUserId,
    campaignId
  );

  return prisma.campaignMember.update({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
    data: {
      role,
    },
    include: {
      user: {
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

export async function removeCampaignMember(
  userId: number,
  campaignId: number,
  authenticatedUserId: number
) {
  await ensureMaster(
    authenticatedUserId,
    campaignId
  );

  return prisma.campaignMember.delete({
    where: {
      userId_campaignId: {
        userId,
        campaignId,
      },
    },
  });
}