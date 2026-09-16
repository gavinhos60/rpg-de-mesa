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
    category?: string;
    imageUrl?: string;
  },
  options?: {
    /** Skip MASTER check when caller already validated (e.g. shop delivery). */
    skipMasterCheck?: boolean;
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

  if (!options?.skipMasterCheck) {
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
  }

  const name = String(item.name ?? "").trim();
  if (!name) {
    throw new Error("ITEM_NAME_REQUIRED");
  }

  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
  const description = String(item.description ?? "").trim() || undefined;
  const category = String(item.category ?? "").trim() || undefined;
  const imageUrl = String(item.imageUrl ?? "").trim() || undefined;
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

  const nameKey = name.toLowerCase();
  const categoryKey = (category ?? "").toLowerCase();
  const mergeIndex = existingCustom.findIndex((entry) => {
    const entryName = String(entry.name ?? "")
      .trim()
      .toLowerCase();
    const entryCategory = String(entry.category ?? "")
      .trim()
      .toLowerCase();
    return entryName === nameKey && entryCategory === categoryKey;
  });

  if (mergeIndex >= 0) {
    const previous = existingCustom[mergeIndex];
    const prevQty = Math.max(0, Math.floor(Number(previous.quantity) || 0));
    const merged: Record<string, unknown> = {
      ...previous,
      quantity: prevQty + quantity,
    };
    if (description) merged.description = description;
    if (weight != null) merged.weight = weight;
    if (category) merged.category = category;
    if (imageUrl) merged.imageUrl = imageUrl;
    if (master?.name) merged.grantedByName = master.name;
    const nextCustom = [...existingCustom];
    nextCustom[mergeIndex] = merged;
    equipment.customItems = nextCustom;
  } else {
    const customItem: Record<string, unknown> = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      quantity,
    };
    if (description) customItem.description = description;
    if (weight != null) customItem.weight = weight;
    if (category) customItem.category = category;
    if (imageUrl) customItem.imageUrl = imageUrl;
    if (master?.name) customItem.grantedByName = master.name;
    equipment.customItems = [...existingCustom, customItem];
  }

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

type SheetRoot = Record<string, unknown>;
type EquipmentStack = { itemId: string; quantity: number };
type CustomItem = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  weight?: number;
  category?: string;
  grantedByName?: string;
};

const characterInclude = {
  player: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  campaign: true,
} as const;

function asSheetRoot(sheet: unknown): SheetRoot {
  if (sheet && typeof sheet === "object" && !Array.isArray(sheet)) {
    return { ...(sheet as SheetRoot) };
  }
  return {};
}

function asEquipment(sheetRoot: SheetRoot): Record<string, unknown> {
  const equipmentRaw = sheetRoot.equipment;
  if (
    equipmentRaw &&
    typeof equipmentRaw === "object" &&
    !Array.isArray(equipmentRaw)
  ) {
    return { ...(equipmentRaw as Record<string, unknown>) };
  }
  return {
    classId: "",
    choiceSelections: {},
    manualItems: [],
    customItems: [],
    removedItems: [],
  };
}

function asStacks(value: unknown): EquipmentStack[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const itemId = String(row.itemId ?? "").trim();
      const quantity = Math.max(0, Math.floor(Number(row.quantity) || 0));
      if (!itemId || quantity <= 0) return null;
      return { itemId, quantity };
    })
    .filter((item): item is EquipmentStack => Boolean(item));
}

function asCustomItems(value: unknown): CustomItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const id = String(row.id ?? "").trim();
      const name = String(row.name ?? "").trim();
      const quantity = Math.max(0, Math.floor(Number(row.quantity) || 0));
      if (!id || !name || quantity <= 0) return null;
      const next: CustomItem = { id, name, quantity };
      const description = String(row.description ?? "").trim();
      if (description) next.description = description;
      const weight = Number(row.weight);
      if (Number.isFinite(weight) && weight >= 0) next.weight = weight;
      const category = String(row.category ?? "").trim();
      if (category) next.category = category;
      const grantedByName = String(row.grantedByName ?? "").trim();
      if (grantedByName) next.grantedByName = grantedByName;
      return next;
    })
    .filter((item): item is CustomItem => Boolean(item));
}

function normalizeWalletInput(raw: unknown): {
  pl: number;
  po: number;
  pp: number;
} {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    pl: Math.max(0, Math.floor(Number(source.pl) || 0)),
    po: Math.max(0, Math.floor(Number(source.po) || 0)),
    pp: Math.max(0, Math.floor(Number(source.pp) || 0)),
  };
}

function removeCatalogQuantity(
  equipment: Record<string, unknown>,
  itemId: string,
  quantity: number
) {
  let remaining = Math.max(1, Math.floor(quantity));
  const manual = asStacks(equipment.manualItems);
  const manualIndex = manual.findIndex((item) => item.itemId === itemId);
  if (manualIndex >= 0) {
    const take = Math.min(manual[manualIndex].quantity, remaining);
    manual[manualIndex] = {
      ...manual[manualIndex],
      quantity: manual[manualIndex].quantity - take,
    };
    remaining -= take;
    if (manual[manualIndex].quantity <= 0) {
      manual.splice(manualIndex, 1);
    }
  }
  equipment.manualItems = manual;

  if (remaining > 0) {
    const removed = asStacks(equipment.removedItems);
    const removedIndex = removed.findIndex((item) => item.itemId === itemId);
    if (removedIndex >= 0) {
      removed[removedIndex] = {
        ...removed[removedIndex],
        quantity: removed[removedIndex].quantity + remaining,
      };
    } else {
      removed.push({ itemId, quantity: remaining });
    }
    equipment.removedItems = removed;
  }
}

function addCatalogQuantity(
  equipment: Record<string, unknown>,
  itemId: string,
  quantity: number
) {
  const amount = Math.max(1, Math.floor(quantity));
  const manual = asStacks(equipment.manualItems);
  const index = manual.findIndex((item) => item.itemId === itemId);
  if (index >= 0) {
    manual[index] = {
      ...manual[index],
      quantity: manual[index].quantity + amount,
    };
  } else {
    manual.push({ itemId, quantity: amount });
  }
  equipment.manualItems = manual;
}

function removeCustomQuantity(
  equipment: Record<string, unknown>,
  customItemId: string,
  quantity: number
): CustomItem {
  const amount = Math.max(1, Math.floor(quantity));
  const customItems = asCustomItems(equipment.customItems);
  const index = customItems.findIndex((item) => item.id === customItemId);
  if (index < 0) {
    throw new Error("ITEM_NOT_FOUND");
  }
  const current = customItems[index];
  if (current.quantity < amount) {
    throw new Error("ITEM_QUANTITY_INVALID");
  }
  const moved: CustomItem = { ...current, quantity: amount };
  if (current.quantity === amount) {
    customItems.splice(index, 1);
  } else {
    customItems[index] = {
      ...current,
      quantity: current.quantity - amount,
    };
  }
  equipment.customItems = customItems;
  return moved;
}

function addCustomItem(equipment: Record<string, unknown>, item: CustomItem) {
  const customItems = asCustomItems(equipment.customItems);
  const same = customItems.find(
    (entry) =>
      entry.name === item.name &&
      (entry.description ?? "") === (item.description ?? "") &&
      (entry.weight ?? null) === (item.weight ?? null)
  );
  if (same) {
    same.quantity += item.quantity;
  } else {
    customItems.push({
      ...item,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    });
  }
  equipment.customItems = customItems;
}

async function requireOwnedCharacter(characterId: number, userId: number) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });
  if (!character) throw new Error("CHARACTER_NOT_FOUND");
  if (character.playerId !== userId) throw new Error("CHARACTER_FORBIDDEN");
  return character;
}

/** Dono da ficha ou mestre da campanha do personagem. */
async function requireOwnedOrCampaignMaster(
  characterId: number,
  userId: number
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });
  if (!character) throw new Error("CHARACTER_NOT_FOUND");
  if (character.playerId === userId) return character;

  if (character.campaignId == null) {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  const membership = await prisma.campaignMember.findUnique({
    where: {
      userId_campaignId: {
        userId,
        campaignId: character.campaignId,
      },
    },
  });

  if (membership?.role !== "MASTER") {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  return character;
}

export async function updateCharacterWallet(
  characterId: number,
  authenticatedUserId: number,
  walletInput: {
    pl?: number;
    po?: number;
    pp?: number;
  }
) {
  const character = await requireOwnedOrCampaignMaster(
    characterId,
    authenticatedUserId
  );
  const sheetRoot = asSheetRoot(character.sheet);
  sheetRoot.wallet = normalizeWalletInput(walletInput);

  return prisma.character.update({
    where: { id: characterId },
    data: { sheet: sheetRoot as Prisma.InputJsonValue },
    include: characterInclude,
  });
}

/** Dono ou mestre da campanha pode atualizar recursos (descanso / gasto). */
export async function updateCharacterResources(
  characterId: number,
  authenticatedUserId: number,
  resources: {
    pools?: Record<string, number>;
    spellSlotsSpent?: number[];
    pactSlotsSpent?: number;
  }
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });
  if (!character) throw new Error("CHARACTER_NOT_FOUND");

  const isOwner = character.playerId === authenticatedUserId;
  let isMaster = false;
  if (character.campaignId != null) {
    const membership = await prisma.campaignMember.findUnique({
      where: {
        userId_campaignId: {
          userId: authenticatedUserId,
          campaignId: character.campaignId,
        },
      },
    });
    isMaster = membership?.role === "MASTER";
  }

  if (!isOwner && !isMaster) {
    throw new Error("CHARACTER_FORBIDDEN");
  }

  const sheetRoot = asSheetRoot(character.sheet);
  const prev =
    sheetRoot.resources &&
    typeof sheetRoot.resources === "object" &&
    !Array.isArray(sheetRoot.resources)
      ? (sheetRoot.resources as Record<string, unknown>)
      : {};

  const poolsRaw =
    resources.pools && typeof resources.pools === "object"
      ? resources.pools
      : (prev.pools as Record<string, number> | undefined) ?? {};

  const pools: Record<string, number> = {};
  for (const [key, value] of Object.entries(poolsRaw)) {
    pools[key] = Math.max(0, Math.floor(Number(value) || 0));
  }

  const spentSrc = Array.isArray(resources.spellSlotsSpent)
    ? resources.spellSlotsSpent
    : Array.isArray(prev.spellSlotsSpent)
      ? (prev.spellSlotsSpent as unknown[])
      : [];
  const spellSlotsSpent = Array.from({ length: 9 }, (_, index) =>
    Math.max(0, Math.floor(Number(spentSrc[index]) || 0))
  );

  const pactSlotsSpent = Math.max(
    0,
    Math.floor(
      Number(
        resources.pactSlotsSpent != null
          ? resources.pactSlotsSpent
          : prev.pactSlotsSpent
      ) || 0
    )
  );

  sheetRoot.resources = { pools, spellSlotsSpent, pactSlotsSpent };

  return prisma.character.update({
    where: { id: characterId },
    data: { sheet: sheetRoot as Prisma.InputJsonValue },
    include: characterInclude,
  });
}

export async function discardCharacterItem(
  characterId: number,
  authenticatedUserId: number,
  payload: {
    kind: "catalog" | "custom";
    itemId?: string;
    customItemId?: string;
    quantity?: number;
  }
) {
  const character = await requireOwnedOrCampaignMaster(
    characterId,
    authenticatedUserId
  );
  const quantity = Math.max(1, Math.floor(Number(payload.quantity) || 1));
  const sheetRoot = asSheetRoot(character.sheet);
  const equipment = asEquipment(sheetRoot);

  if (payload.kind !== "catalog" && payload.kind !== "custom") {
    throw new Error("ITEM_NOT_FOUND");
  }

  if (payload.kind === "catalog") {
    const itemId = String(payload.itemId ?? "").trim();
    if (!itemId) throw new Error("ITEM_NOT_FOUND");
    removeCatalogQuantity(equipment, itemId, quantity);
  } else {
    const customItemId = String(payload.customItemId ?? "").trim();
    if (!customItemId) throw new Error("ITEM_NOT_FOUND");
    removeCustomQuantity(equipment, customItemId, quantity);
  }

  sheetRoot.equipment = equipment;
  return prisma.character.update({
    where: { id: characterId },
    data: { sheet: sheetRoot as Prisma.InputJsonValue },
    include: characterInclude,
  });
}

export async function transferCharacterItem(
  characterId: number,
  authenticatedUserId: number,
  payload: {
    kind: "catalog" | "custom";
    itemId?: string;
    customItemId?: string;
    quantity?: number;
    targetCharacterId: number;
  }
) {
  const source = await requireOwnedOrCampaignMaster(
    characterId,
    authenticatedUserId
  );
  if (source.campaignId == null) {
    throw new Error("CHARACTER_NOT_IN_CAMPAIGN");
  }

  const targetId = Number(payload.targetCharacterId);
  if (!Number.isFinite(targetId) || targetId === characterId) {
    throw new Error("TRANSFER_TARGET_INVALID");
  }

  const target = await prisma.character.findUnique({
    where: { id: targetId },
  });
  if (!target) throw new Error("CHARACTER_NOT_FOUND");
  if (target.campaignId !== source.campaignId) {
    throw new Error("TRANSFER_TARGET_INVALID");
  }

  const quantity = Math.max(1, Math.floor(Number(payload.quantity) || 1));
  const sourceSheet = asSheetRoot(source.sheet);
  const targetSheet = asSheetRoot(target.sheet);
  const sourceEquipment = asEquipment(sourceSheet);
  const targetEquipment = asEquipment(targetSheet);

  if (payload.kind === "catalog") {
    const itemId = String(payload.itemId ?? "").trim();
    if (!itemId) throw new Error("ITEM_NOT_FOUND");
    removeCatalogQuantity(sourceEquipment, itemId, quantity);
    addCatalogQuantity(targetEquipment, itemId, quantity);
  } else {
    const customItemId = String(payload.customItemId ?? "").trim();
    if (!customItemId) throw new Error("ITEM_NOT_FOUND");
    const moved = removeCustomQuantity(
      sourceEquipment,
      customItemId,
      quantity
    );
    addCustomItem(targetEquipment, moved);
  }

  sourceSheet.equipment = sourceEquipment;
  targetSheet.equipment = targetEquipment;

  const [from, to] = await prisma.$transaction([
    prisma.character.update({
      where: { id: source.id },
      data: { sheet: sourceSheet as Prisma.InputJsonValue },
      include: characterInclude,
    }),
    prisma.character.update({
      where: { id: target.id },
      data: { sheet: targetSheet as Prisma.InputJsonValue },
      include: characterInclude,
    }),
  ]);

  return { from, to };
}
