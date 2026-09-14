import { Request, Response } from "express";
import {
  getMyCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  assignCharacterToCampaign,
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
      avatar: avatar ? String(avatar).trim() : undefined,
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
