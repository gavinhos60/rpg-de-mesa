import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import {
  emptyBoardState,
  type SessionRuntimeState,
} from "../lib/gameTypes";
import type { Prisma } from "../generated/prisma/client";

function roomCode(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

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

export function parseSessionState(raw: unknown): SessionRuntimeState {
  if (!raw || typeof raw !== "object") {
    return { board: emptyBoardState(), chat: [] };
  }

  const data = raw as Partial<SessionRuntimeState>;
  const mergedBoard = {
    ...emptyBoardState(),
    ...(data.board ?? {}),
    tokens: data.board?.tokens ?? [],
    drawings: data.board?.drawings ?? [],
    rulers: (data.board?.rulers ?? []).map((ruler) => {
      const legacy = ruler as { meters?: number; feet?: number };
      return {
        ...ruler,
        meters:
          typeof legacy.meters === "number"
            ? legacy.meters
            : typeof legacy.feet === "number"
              ? Math.round(legacy.feet * 0.3 * 10) / 10
              : 0,
      };
    }),
    effects: data.board?.effects ?? [],
  };

  if (
    (mergedBoard.metersPerSquare == null ||
      Number.isNaN(mergedBoard.metersPerSquare)) &&
    typeof mergedBoard.feetPerSquare === "number"
  ) {
    mergedBoard.metersPerSquare =
      Math.round(mergedBoard.feetPerSquare * 0.3 * 100) / 100;
  }

  if (!mergedBoard.metersPerSquare) {
    mergedBoard.metersPerSquare = 1.5;
  }

  return {
    board: mergedBoard,
    chat: Array.isArray(data.chat) ? data.chat : [],
  };
}

export async function startGameSession(
  campaignId: number,
  authenticatedUserId: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  await prisma.gameSession.updateMany({
    where: {
      campaignId,
      status: "ACTIVE",
    },
    data: {
      status: "CLOSED",
    },
  });

  const initialState: SessionRuntimeState = {
    board: emptyBoardState(),
    chat: [],
  };

  const characters = await prisma.character.findMany({
    where: { campaignId },
    select: {
      id: true,
      name: true,
      playerId: true,
      avatar: true,
      sheet: true,
    },
  });

  const palette = [
    "#7A2530",
    "#3F5B34",
    "#2F4F7A",
    "#8A5A1E",
    "#5C4A1E",
    "#6B3FA0",
  ];

  function hitPointsFromSheet(sheet: unknown): { hpMax: number; hpCurrent: number } {
    const data =
      sheet && typeof sheet === "object"
        ? (sheet as { hitPoints?: unknown })
        : null;
    const raw = data?.hitPoints;
    const hp =
      typeof raw === "number" && Number.isFinite(raw) && raw > 0
        ? Math.round(raw)
        : 10;
    return { hpMax: hp, hpCurrent: hp };
  }

  initialState.board.tokens = characters.map((character, index) => {
    const { hpMax, hpCurrent } = hitPointsFromSheet(character.sheet);
    return {
      id: `pc-${character.id}`,
      kind: "pc" as const,
      name: character.name,
      characterId: character.id,
      ownerUserId: character.playerId,
      x: 50 + (index % 6) * 50,
      y: 50 + Math.floor(index / 6) * 50,
      color: palette[index % palette.length],
      sizeCategory: "Medium" as const,
      gridSpan: 1,
      size: 50,
      imageUrl: character.avatar || undefined,
      hpMax,
      hpCurrent,
      customValue: "",
    };
  });

  return prisma.gameSession.create({
    data: {
      campaignId,
      startedById: authenticatedUserId,
      roomCode: roomCode(),
      status: "ACTIVE",
      state: initialState as unknown as Prisma.InputJsonValue,
    },
    include: {
      campaign: {
        select: { id: true, name: true },
      },
      startedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getActiveGameSession(
  campaignId: number,
  authenticatedUserId: number
) {
  await ensureCampaignMember(authenticatedUserId, campaignId);

  return prisma.gameSession.findFirst({
    where: {
      campaignId,
      status: "ACTIVE",
    },
    include: {
      campaign: {
        select: { id: true, name: true },
      },
      startedBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function closeGameSession(
  campaignId: number,
  sessionId: number,
  authenticatedUserId: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const session = await prisma.gameSession.findFirst({
    where: {
      id: sessionId,
      campaignId,
    },
  });

  if (!session) {
    throw new Error("SESSION_NOT_FOUND");
  }

  return prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "CLOSED" },
    include: {
      campaign: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function getSessionForSocket(sessionId: number) {
  return prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      campaign: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          characters: {
            include: {
              player: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function saveSessionState(
  sessionId: number,
  state: SessionRuntimeState
) {
  return prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      state: state as unknown as Prisma.InputJsonValue,
    },
  });
}
