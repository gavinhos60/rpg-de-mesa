import { prisma } from "../lib/prisma";

export async function normalizePlayerAudience(
  campaignId: number,
  audienceUserIds: unknown
): Promise<number[]> {
  const raw = Array.isArray(audienceUserIds)
    ? audienceUserIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
    : [];
  const unique = [...new Set(raw.map((id) => Math.trunc(id)))].filter((id) => id > 0);
  if (unique.length === 0) {
    throw new Error("AUDIENCE_REQUIRED");
  }

  const [members, characters] = await Promise.all([
    prisma.campaignMember.findMany({
      where: {
        campaignId,
        role: "PLAYER",
        userId: { in: unique },
      },
      select: { userId: true },
    }),
    prisma.character.findMany({
      where: {
        campaignId,
        playerId: { in: unique },
      },
      select: { playerId: true },
    }),
  ]);
  const allowed = new Set<number>([
    ...members.map((m) => m.userId),
    ...characters.map((c) => c.playerId),
  ]);
  const filtered = unique.filter((id) => allowed.has(id));
  if (filtered.length === 0) {
    throw new Error("AUDIENCE_REQUIRED");
  }
  return filtered;
}
