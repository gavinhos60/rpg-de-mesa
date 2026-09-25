import { Request, Response } from "express";
import {
  listShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  createShopItem,
  updateShopItem,
  deleteShopItem,
  deliverShopItem,
  listDeliveries,
} from "../services/mercado.service";

function mapError(error: unknown, res: Response, fallback: string) {
  if (!(error instanceof Error)) {
    res.status(500).json({ error: fallback });
    return true;
  }

  switch (error.message) {
    case "NOT_CAMPAIGN_MEMBER":
      res.status(403).json({ error: "Você não pertence a esta campanha" });
      return true;
    case "MASTER_REQUIRED":
      res.status(403).json({ error: "Apenas o mestre pode fazer isso" });
      return true;
    case "SHOP_NOT_FOUND":
      res.status(404).json({ error: "Loja não encontrada" });
      return true;
    case "SHOP_ITEM_NOT_FOUND":
      res.status(404).json({ error: "Item da loja não encontrado" });
      return true;
    case "SHOP_NAME_REQUIRED":
      res.status(400).json({ error: "Nome da loja é obrigatório" });
      return true;
    case "ITEM_NAME_REQUIRED":
      res.status(400).json({ error: "Nome do item é obrigatório" });
      return true;
    case "ITEM_CATEGORY_REQUIRED":
      res.status(400).json({ error: "Categoria do item é obrigatória" });
      return true;
    case "ITEM_UNAVAILABLE":
      res.status(400).json({ error: "Item indisponível" });
      return true;
    case "INSUFFICIENT_STOCK":
      res.status(400).json({ error: "Estoque insuficiente (ESGOTADO)" });
      return true;
    case "CHARACTER_NOT_FOUND":
      res.status(404).json({ error: "Personagem não encontrado" });
      return true;
    case "CHARACTER_NOT_IN_CAMPAIGN":
      res.status(400).json({ error: "Personagem não pertence a esta campanha" });
      return true;
    default:
      return false;
  }
}

export async function listShopsController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const shops = await listShops(
      Number(req.params.campaignId),
      req.user.userId
    );
    res.json(shops);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao listar lojas")) return;
    res.status(500).json({ error: "Erro ao listar lojas" });
  }
}

export async function getShopController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const shop = await getShop(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      req.user.userId
    );
    res.json(shop);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao buscar loja")) return;
    res.status(500).json({ error: "Erro ao buscar loja" });
  }
}

export async function createShopController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const shop = await createShop(
      Number(req.params.campaignId),
      req.user.userId,
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isOpen: req.body.isOpen,
      }
    );
    res.status(201).json(shop);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao criar loja")) return;
    res.status(500).json({ error: "Erro ao criar loja" });
  }
}

export async function updateShopController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const shop = await updateShop(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      req.user.userId,
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isOpen: req.body.isOpen,
      }
    );
    res.json(shop);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao atualizar loja")) return;
    res.status(500).json({ error: "Erro ao atualizar loja" });
  }
}

export async function deleteShopController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await deleteShop(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      req.user.userId
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao excluir loja")) return;
    res.status(500).json({ error: "Erro ao excluir loja" });
  }
}

export async function createShopItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await createShopItem(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      req.user.userId,
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        quantity: req.body.quantity,
        unlimitedStock: req.body.unlimitedStock,
        category: req.body.category,
        extraInfo: req.body.extraInfo,
        bonusStat: req.body.bonusStat,
        bonusValue: req.body.bonusValue,
        requiresAttunement: req.body.requiresAttunement,
        weight: req.body.weight,
        available: req.body.available,
      }
    );
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao criar item")) return;
    res.status(500).json({ error: "Erro ao criar item" });
  }
}

export async function updateShopItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await updateShopItem(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      Number(req.params.itemId),
      req.user.userId,
      {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        quantity: req.body.quantity,
        unlimitedStock: req.body.unlimitedStock,
        category: req.body.category,
        extraInfo: req.body.extraInfo,
        bonusStat: req.body.bonusStat,
        bonusValue: req.body.bonusValue,
        requiresAttunement: req.body.requiresAttunement,
        weight: req.body.weight,
        available: req.body.available,
      }
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao atualizar item")) return;
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
}

export async function deleteShopItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await deleteShopItem(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      Number(req.params.itemId),
      req.user.userId
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao excluir item")) return;
    res.status(500).json({ error: "Erro ao excluir item" });
  }
}

export async function deliverShopItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const result = await deliverShopItem(
      Number(req.params.campaignId),
      Number(req.params.shopId),
      Number(req.params.itemId),
      req.user.userId,
      {
        characterId: Number(req.body.characterId),
        quantity:
          req.body.quantity != null ? Number(req.body.quantity) : undefined,
      }
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao entregar item")) return;
    res.status(500).json({ error: "Erro ao entregar item" });
  }
}

export async function listDeliveriesController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const shopId =
      req.query.shopId != null ? Number(req.query.shopId) : undefined;

    const deliveries = await listDeliveries(
      Number(req.params.campaignId),
      req.user.userId,
      Number.isFinite(shopId) ? shopId : undefined
    );
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao listar entregas")) return;
    res.status(500).json({ error: "Erro ao listar entregas" });
  }
}
