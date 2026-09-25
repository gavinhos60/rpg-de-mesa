import type { CampaignCharacterLite } from "../types/game";

export type CampaignPlayerOption = {
  userId: number;
  label: string;
};

export function buildCampaignPlayerOptions(
  characters: CampaignCharacterLite[],
  members: Array<{
    userId: number;
    role: "MASTER" | "PLAYER";
    name: string;
    email: string;
  }> = []
): CampaignPlayerOption[] {
  const map = new Map<number, string>();

  for (const character of characters) {
    if (!character.playerId) continue;
    const label =
      character.player?.name?.trim() ||
      character.name?.trim() ||
      `Jogador #${character.playerId}`;
    map.set(character.playerId, label);
  }

  for (const member of members) {
    if (member.role !== "PLAYER") continue;
    if (map.has(member.userId)) continue;
    map.set(
      member.userId,
      member.name?.trim() || member.email?.trim() || `Jogador #${member.userId}`
    );
  }

  return [...map.entries()]
    .map(([userId, label]) => ({ userId, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

export function filterVisibleToUser<
  T extends { audienceUserIds?: number[] | null },
>(items: T[], userId: number | undefined): T[] {
  if (!userId) return [];
  return items.filter((item) => {
    const audience = item.audienceUserIds ?? [];
    if (audience.length === 0) return true;
    return audience.includes(userId);
  });
}
