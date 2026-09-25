import { prisma } from "../lib/prisma";
import { grantCustomItemToCharacter } from "./characters.service";
import { emitToCampaignSessions } from "../socket/io";

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

const shopInclude = {
  items: {
    orderBy: { createdAt: "asc" as const },
  },
};

const VALID_BONUS_STATS = new Set([
  "ac",
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
]);

function parseShopItemBonus(
  statRaw: unknown,
  valueRaw: unknown
): { bonusStat: string; bonusValue: number } | null {
  const bonusStat = String(statRaw ?? "").trim();
  const bonusValue = Math.floor(Number(valueRaw));
  if (!VALID_BONUS_STATS.has(bonusStat)) return null;
  if (!Number.isFinite(bonusValue) || bonusValue < 1 || bonusValue > 10) {
    return null;
  }
  return { bonusStat, bonusValue };
}

function parseItemWeight(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value == null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

async function broadcastShops(campaignId: number) {
  const shops = await prisma.shop.findMany({
    where: { campaignId, isOpen: true },
    include: {
      items: {
        where: { available: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  await emitToCampaignSessions(campaignId, "mercado:shops", shops);
}

export async function listShops(
  campaignId: number,
  authenticatedUserId: number
) {
  const member = await ensureCampaignMember(authenticatedUserId, campaignId);

  if (member.role === "MASTER") {
    return prisma.shop.findMany({
      where: { campaignId },
      include: shopInclude,
      orderBy: { updatedAt: "desc" },
    });
  }

  return prisma.shop.findMany({
    where: { campaignId, isOpen: true },
    include: {
      items: {
        where: { available: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getShop(
  campaignId: number,
  shopId: number,
  authenticatedUserId: number
) {
  const member = await ensureCampaignMember(authenticatedUserId, campaignId);

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
    include: shopInclude,
  });

  if (!shop) throw new Error("SHOP_NOT_FOUND");

  if (member.role !== "MASTER") {
    if (!shop.isOpen) throw new Error("SHOP_NOT_FOUND");
    return {
      ...shop,
      items: shop.items.filter((item) => item.available),
    };
  }

  return shop;
}

export async function createShop(
  campaignId: number,
  authenticatedUserId: number,
  data: {
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    isOpen?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const name = String(data.name ?? "").trim();
  if (!name) throw new Error("SHOP_NAME_REQUIRED");

  const shop = await prisma.shop.create({
    data: {
      campaignId,
      name,
      description:
        data.description != null
          ? String(data.description).trim() || null
          : null,
      imageUrl:
        data.imageUrl != null ? String(data.imageUrl).trim() || null : null,
      isOpen: Boolean(data.isOpen),
    },
    include: shopInclude,
  });

  if (shop.isOpen) {
    await broadcastShops(campaignId);
  }

  return shop;
}

export async function updateShop(
  campaignId: number,
  shopId: number,
  authenticatedUserId: number,
  data: {
    name?: string;
    description?: string | null;
    imageUrl?: string | null;
    isOpen?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!existing) throw new Error("SHOP_NOT_FOUND");

  const update: {
    name?: string;
    description?: string | null;
    imageUrl?: string | null;
    isOpen?: boolean;
  } = {};

  if (data.name != null) {
    const name = String(data.name).trim();
    if (!name) throw new Error("SHOP_NAME_REQUIRED");
    update.name = name;
  }
  if (data.description !== undefined) {
    update.description =
      data.description == null
        ? null
        : String(data.description).trim() || null;
  }
  if (data.imageUrl !== undefined) {
    update.imageUrl =
      data.imageUrl == null ? null : String(data.imageUrl).trim() || null;
  }
  if (data.isOpen != null) {
    update.isOpen = Boolean(data.isOpen);
  }

  const shop = await prisma.shop.update({
    where: { id: shopId },
    data: update,
    include: shopInclude,
  });

  if (existing.isOpen || shop.isOpen || data.isOpen != null) {
    await broadcastShops(campaignId);
  }

  return shop;
}

export async function deleteShop(
  campaignId: number,
  shopId: number,
  authenticatedUserId: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const existing = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!existing) throw new Error("SHOP_NOT_FOUND");

  await prisma.shop.delete({ where: { id: shopId } });

  if (existing.isOpen) {
    await broadcastShops(campaignId);
  }

  return { ok: true as const };
}

export async function createShopItem(
  campaignId: number,
  shopId: number,
  authenticatedUserId: number,
  data: {
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    price: string;
    quantity?: number | null;
    unlimitedStock?: boolean;
    category: string;
    extraInfo?: string | null;
    bonusStat?: string | null;
    bonusValue?: number | null;
    requiresAttunement?: boolean;
    weight?: number | null;
    available?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!shop) throw new Error("SHOP_NOT_FOUND");

  const name = String(data.name ?? "").trim();
  if (!name) throw new Error("ITEM_NAME_REQUIRED");

  const category = String(data.category ?? "").trim();
  if (!category) throw new Error("ITEM_CATEGORY_REQUIRED");

  const price = String(data.price ?? "").trim() || "—";
  const unlimitedStock = Boolean(data.unlimitedStock);
  let quantity: number | null = null;
  if (!unlimitedStock) {
    const qty =
      data.quantity != null ? Math.floor(Number(data.quantity)) : 0;
    quantity = Number.isFinite(qty) && qty >= 0 ? qty : 0;
  }

  const weight = parseItemWeight(data.weight);
  const bonus = parseShopItemBonus(data.bonusStat, data.bonusValue);

  const item = await prisma.shopItem.create({
    data: {
      shopId,
      name,
      description:
        data.description != null
          ? String(data.description).trim() || null
          : null,
      imageUrl:
        data.imageUrl != null ? String(data.imageUrl).trim() || null : null,
      price,
      quantity,
      unlimitedStock,
      category,
      extraInfo:
        data.extraInfo != null
          ? String(data.extraInfo).trim() || null
          : null,
      bonusStat: bonus?.bonusStat ?? null,
      bonusValue: bonus?.bonusValue ?? null,
      requiresAttunement: Boolean(data.requiresAttunement),
      ...(weight !== undefined ? { weight } : {}),
      available: data.available != null ? Boolean(data.available) : true,
    },
  });

  if (shop.isOpen) {
    await broadcastShops(campaignId);
  }

  return item;
}

export async function updateShopItem(
  campaignId: number,
  shopId: number,
  itemId: number,
  authenticatedUserId: number,
  data: {
    name?: string;
    description?: string | null;
    imageUrl?: string | null;
    price?: string;
    quantity?: number | null;
    unlimitedStock?: boolean;
    category?: string;
    extraInfo?: string | null;
    bonusStat?: string | null;
    bonusValue?: number | null;
    requiresAttunement?: boolean;
    weight?: number | null;
    available?: boolean;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!shop) throw new Error("SHOP_NOT_FOUND");

  const existing = await prisma.shopItem.findFirst({
    where: { id: itemId, shopId },
  });
  if (!existing) throw new Error("SHOP_ITEM_NOT_FOUND");

  const update: Record<string, unknown> = {};

  if (data.name != null) {
    const name = String(data.name).trim();
    if (!name) throw new Error("ITEM_NAME_REQUIRED");
    update.name = name;
  }
  if (data.description !== undefined) {
    update.description =
      data.description == null
        ? null
        : String(data.description).trim() || null;
  }
  if (data.imageUrl !== undefined) {
    update.imageUrl =
      data.imageUrl == null ? null : String(data.imageUrl).trim() || null;
  }
  if (data.price != null) {
    update.price = String(data.price).trim() || "—";
  }
  if (data.category != null) {
    const category = String(data.category).trim();
    if (!category) throw new Error("ITEM_CATEGORY_REQUIRED");
    update.category = category;
  }
  if (data.extraInfo !== undefined) {
    update.extraInfo =
      data.extraInfo == null ? null : String(data.extraInfo).trim() || null;
  }
  if (data.bonusStat !== undefined || data.bonusValue !== undefined) {
    const bonus = parseShopItemBonus(
      data.bonusStat ?? null,
      data.bonusValue ?? null
    );
    update.bonusStat = bonus?.bonusStat ?? null;
    update.bonusValue = bonus?.bonusValue ?? null;
  }
  if (data.weight !== undefined) {
    update.weight = parseItemWeight(data.weight);
  }
  if (data.requiresAttunement != null) {
    update.requiresAttunement = Boolean(data.requiresAttunement);
  }
  if (data.available != null) {
    update.available = Boolean(data.available);
  }
  if (data.unlimitedStock != null) {
    update.unlimitedStock = Boolean(data.unlimitedStock);
    if (data.unlimitedStock) {
      update.quantity = null;
    }
  }
  if (data.quantity !== undefined && !Boolean(update.unlimitedStock ?? existing.unlimitedStock)) {
    if (data.quantity == null) {
      update.quantity = 0;
    } else {
      const qty = Math.floor(Number(data.quantity));
      update.quantity = Number.isFinite(qty) && qty >= 0 ? qty : 0;
    }
  }

  const item = await prisma.shopItem.update({
    where: { id: itemId },
    data: update,
  });

  if (shop.isOpen) {
    await broadcastShops(campaignId);
  }

  return item;
}

export async function deleteShopItem(
  campaignId: number,
  shopId: number,
  itemId: number,
  authenticatedUserId: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!shop) throw new Error("SHOP_NOT_FOUND");

  const existing = await prisma.shopItem.findFirst({
    where: { id: itemId, shopId },
  });
  if (!existing) throw new Error("SHOP_ITEM_NOT_FOUND");

  await prisma.shopItem.delete({ where: { id: itemId } });

  if (shop.isOpen) {
    await broadcastShops(campaignId);
  }

  return { ok: true as const };
}

export async function deliverShopItem(
  campaignId: number,
  shopId: number,
  itemId: number,
  authenticatedUserId: number,
  data: {
    characterId: number;
    quantity?: number;
  }
) {
  await ensureMaster(authenticatedUserId, campaignId);

  const shop = await prisma.shop.findFirst({
    where: { id: shopId, campaignId },
  });
  if (!shop) throw new Error("SHOP_NOT_FOUND");

  const item = await prisma.shopItem.findFirst({
    where: { id: itemId, shopId },
  });
  if (!item) throw new Error("SHOP_ITEM_NOT_FOUND");
  if (!item.available) throw new Error("ITEM_UNAVAILABLE");

  const quantity = Math.max(1, Math.floor(Number(data.quantity) || 1));

  if (!item.unlimitedStock) {
    const stock = item.quantity ?? 0;
    if (stock < quantity) {
      throw new Error("INSUFFICIENT_STOCK");
    }
  }

  const character = await prisma.character.findUnique({
    where: { id: Number(data.characterId) },
    include: {
      player: { select: { id: true, name: true } },
    },
  });

  if (!character) throw new Error("CHARACTER_NOT_FOUND");
  if (character.campaignId !== campaignId) {
    throw new Error("CHARACTER_NOT_IN_CAMPAIGN");
  }

  const master = await prisma.user.findUnique({
    where: { id: authenticatedUserId },
    select: { name: true },
  });

  const updatedCharacter = await grantCustomItemToCharacter(
    character.id,
    authenticatedUserId,
    {
      name: item.name,
      description: item.description ?? undefined,
      quantity,
      category: item.category,
      imageUrl: item.imageUrl ?? undefined,
      ...(item.weight != null ? { weight: item.weight } : {}),
      ...(item.bonusStat && item.bonusValue
        ? {
            itemBonus: {
              stat: item.bonusStat as
                | "ac"
                | "strength"
                | "dexterity"
                | "constitution"
                | "intelligence"
                | "wisdom"
                | "charisma",
              value: item.bonusValue,
            },
          }
        : {}),
      ...(item.requiresAttunement ? { requiresAttunement: true } : {}),
    },
    { skipMasterCheck: true }
  );

  let updatedItem = item;
  if (!item.unlimitedStock) {
    const nextQty = Math.max(0, (item.quantity ?? 0) - quantity);
    updatedItem = await prisma.shopItem.update({
      where: { id: item.id },
      data: {
        quantity: nextQty,
        available: nextQty > 0 ? item.available : false,
      },
    });
  }

  const delivery = await prisma.shopDelivery.create({
    data: {
      campaignId,
      shopId: shop.id,
      shopItemId: item.id,
      shopItemName: item.name,
      shopName: shop.name,
      characterId: character.id,
      characterName: character.name,
      playerId: character.playerId,
      playerName: character.player?.name ?? null,
      quantity,
      deliveredById: authenticatedUserId,
      deliveredByName: master?.name ?? "Mestre",
    },
  });

  if (shop.isOpen) {
    await broadcastShops(campaignId);
  }

  return {
    item: updatedItem,
    character: updatedCharacter,
    delivery,
  };
}

export async function listDeliveries(
  campaignId: number,
  authenticatedUserId: number,
  shopId?: number
) {
  await ensureMaster(authenticatedUserId, campaignId);

  return prisma.shopDelivery.findMany({
    where: {
      campaignId,
      ...(shopId != null ? { shopId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
