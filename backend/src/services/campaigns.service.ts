import { prisma } from "../lib/prisma";

export async function getCampaigns(
    userId: number
) {
    return prisma.campaign.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },
        include: {
            characters: true,
            members: {
                where: {
                    userId,
                },
                select: {
                    userId: true,
                    role: true,
                },
            },
        },
    });
}

export async function getCampaignById(
    id: number,
    userId: number
) {
    return prisma.campaign.findUnique({
        where: {
            id,
        },
        include: {
            characters: {
                include: {
                    player: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
}

export async function createCampaign(
    name: string,
    userId: number
) {
    return prisma.campaign.create({
        data: {
            name,
            members: {
                create: {
                    userId,
                    role: "MASTER",
                },
            },
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
}

export async function deleteCampaign(
  campaignId: number,
  userId: number
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

  await prisma.$transaction([
    prisma.gameSession.deleteMany({
      where: {
        campaignId,
      },
    }),

    prisma.character.updateMany({
      where: {
        campaignId,
      },
      data: {
        campaignId: null,
      },
    }),

    prisma.campaignMember.deleteMany({
      where: {
        campaignId,
      },
    }),

    prisma.campaign.delete({
      where: {
        id: campaignId,
      },
    }),
  ]);
}