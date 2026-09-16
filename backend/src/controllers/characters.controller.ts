import { Request, Response } from "express";
import {
  getMyCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  assignCharacterToCampaign,
  removeCharacterFromCampaign,
  deleteCharacter,
  grantCustomItemToCharacter,
  updateCharacterWallet,
  discardCharacterItem,
  transferCharacterItem,
} from "../services/characters.service";

function mapCharacterError(error: unknown, res: Response, fallback: string) {
  if (!(error instanceof Error)) {
    res.status(500).json({ error: fallback });
    return true;
  }

  switch (error.message) {
    case "CHARACTER_NOT_FOUND":
      res.status(404).json({ error: "Personagem não encontrado" });
      return true;
    case "CHARACTER_FORBIDDEN":
      res.status(403).json({ error: "Você não tem acesso a este personagem" });
      return true;
    case "NOT_CAMPAIGN_MEMBER":
      res.status(403).json({ error: "Você não pertence a esta campanha" });
      return true;
    case "CHARACTER_ALREADY_IN_CAMPAIGN":
      res.status(409).json({
        error: "Este personagem já está nesta campanha",
      });
      return true;
    case "ONE_CHARACTER_PER_CAMPAIGN":
      res.status(409).json({
        error:
          "Cada jogador só pode ter um personagem por mesa/campanha",
      });
      return true;
    case "CHARACTER_NOT_IN_CAMPAIGN":
      res.status(400).json({
        error: "Este personagem não está em nenhuma campanha",
      });
      return true;
    case "PLAYER_CANNOT_CREATE_FOR_OTHER":
      res.status(403).json({
        error: "Jogadores só podem criar personagens para si mesmos",
      });
      return true;
    case "TARGET_NOT_CAMPAIGN_MEMBER":
      res.status(400).json({
        error: "O jogador selecionado não pertence à campanha",
      });
      return true;
    case "MASTER_REQUIRED":
      res.status(403).json({
        error: "Apenas o mestre pode realizar esta ação",
      });
      return true;
    case "ITEM_NAME_REQUIRED":
      res.status(400).json({
        error: "Informe o nome do item",
      });
      return true;
    case "ITEM_NOT_FOUND":
      res.status(404).json({ error: "Item não encontrado no inventário" });
      return true;
    case "ITEM_QUANTITY_INVALID":
      res.status(400).json({ error: "Quantidade inválida para este item" });
      return true;
    case "TRANSFER_TARGET_INVALID":
      res.status(400).json({
        error: "Destinatário inválido para transferência",
      });
      return true;
    default:
      return false;
  }
}

export async function listCharacters(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const characters = await getMyCharacters(req.user.userId);
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar personagens" });
  }
}

export async function getCharacterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await getCharacterById(
      Number(req.params.id),
      req.user.userId
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao buscar personagem")) return;
    res.status(500).json({ error: "Erro ao buscar personagem" });
  }
}

export async function createCharacterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const {
      name,
      className,
      race,
      level,
      avatar,
      playerId,
      campaignId,
      sheet,
    } = req.body;

    if (!name || !className || !race || level == null) {
      res.status(400).json({
        error: "Dados obrigatórios não informados",
      });
      return;
    }

    const character = await createCharacter({
      name: String(name).trim(),
      className: String(className).trim(),
      race: String(race).trim(),
      level: Number(level),
        avatar: avatar ? String(avatar) : undefined,
      sheet: sheet ?? undefined,
      playerId: playerId != null ? Number(playerId) : undefined,
      campaignId:
        campaignId === undefined || campaignId === null || campaignId === ""
          ? null
          : Number(campaignId),
      authenticatedUserId: req.user.userId,
    });

    res.status(201).json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao criar personagem")) return;
    res.status(500).json({ error: "Erro ao criar personagem" });
  }
}

export async function assignCharacterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const campaignId = Number(req.body.campaignId);
    if (!campaignId) {
      res.status(400).json({ error: "Campanha não informada" });
      return;
    }

    const character = await assignCharacterToCampaign(
      Number(req.params.id),
      campaignId,
      req.user.userId
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao vincular personagem")) return;
    res.status(500).json({ error: "Erro ao vincular personagem" });
  }
}

export async function updateCharacterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await updateCharacter(
      Number(req.params.id),
      req.user.userId,
      {
        name: req.body.name,
        className: req.body.className,
        race: req.body.race,
        level:
          req.body.level != null ? Number(req.body.level) : undefined,
        avatar: req.body.avatar,
        sheet: req.body.sheet,
        playerId:
          req.body.playerId != null ? Number(req.body.playerId) : undefined,
        campaignId:
          req.body.campaignId === undefined
            ? undefined
            : req.body.campaignId === null
              ? null
              : Number(req.body.campaignId),
      }
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao atualizar personagem")) return;
    res.status(500).json({ error: "Erro ao atualizar personagem" });
  }
}

export async function removeCharacterFromCampaignController(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await removeCharacterFromCampaign(
      Number(req.params.id),
      req.user.userId
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao remover personagem da campanha"))
      return;
    res.status(500).json({ error: "Erro ao remover personagem da campanha" });
  }
}

export async function deleteCharacterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await deleteCharacter(Number(req.params.id), req.user.userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao excluir personagem")) return;
    res.status(500).json({ error: "Erro ao excluir personagem" });
  }
}

export async function grantCustomItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await grantCustomItemToCharacter(
      Number(req.params.id),
      req.user.userId,
      {
        name: req.body.name,
        description: req.body.description,
        quantity:
          req.body.quantity != null ? Number(req.body.quantity) : undefined,
        weight: req.body.weight != null ? Number(req.body.weight) : undefined,
      }
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao conceder item")) return;
    res.status(500).json({ error: "Erro ao conceder item" });
  }
}

export async function updateWalletController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await updateCharacterWallet(
      Number(req.params.id),
      req.user.userId,
      {
        pl: req.body.pl != null ? Number(req.body.pl) : undefined,
        po: req.body.po != null ? Number(req.body.po) : undefined,
        pp: req.body.pp != null ? Number(req.body.pp) : undefined,
      }
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao atualizar carteira")) return;
    res.status(500).json({ error: "Erro ao atualizar carteira" });
  }
}

export async function discardItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const character = await discardCharacterItem(
      Number(req.params.id),
      req.user.userId,
      {
        kind: req.body.kind,
        itemId: req.body.itemId,
        customItemId: req.body.customItemId,
        quantity:
          req.body.quantity != null ? Number(req.body.quantity) : undefined,
      }
    );

    res.json(character);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao remover item")) return;
    res.status(500).json({ error: "Erro ao remover item" });
  }
}

export async function transferItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const result = await transferCharacterItem(
      Number(req.params.id),
      req.user.userId,
      {
        kind: req.body.kind,
        itemId: req.body.itemId,
        customItemId: req.body.customItemId,
        quantity:
          req.body.quantity != null ? Number(req.body.quantity) : undefined,
        targetCharacterId: Number(req.body.targetCharacterId),
      }
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    if (mapCharacterError(error, res, "Erro ao transferir item")) return;
    res.status(500).json({ error: "Erro ao transferir item" });
  }
}
