import type { Server } from "socket.io";
import { prisma } from "../lib/prisma";

let io: Server | null = null;

export function setGameIo(server: Server) {
  io = server;
}

export function getGameIo(): Server | null {
  return io;
}

/** Emit to all active session rooms for a campaign. */
export async function emitToCampaignSessions(
  campaignId: number,
  event: string,
  payload: unknown
) {
  if (!io) return;

  const sessions = await prisma.gameSession.findMany({
    where: { campaignId, status: "ACTIVE" },
    select: { id: true },
  });

  for (const session of sessions) {
    io.to(`session:${session.id}`).emit(event, payload);
  }
}
