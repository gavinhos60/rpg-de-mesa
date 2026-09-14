import { Request, Response } from "express";

import {
  getMyCharacters,
  createCharacter,
  updateCharacter,
} from "../services/characters.service";

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
      avatar: avatar?.trim() || undefined,
      sheet,
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

    if (error instanceof Error && error.message === "NOT_CAMPAIGN_MEMBER") {
      res.status(403).json({ error: "Você não pertence a esta campanha" });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "PLAYER_CANNOT_CREATE_FOR_OTHER"
    ) {
      res.status(403).json({
        error: "Jogadores só podem criar personagens para si mesmos",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "TARGET_NOT_CAMPAIGN_MEMBER"
    ) {
      res.status(400).json({
        error: "O jogador selecionado não pertence à campanha",
      });
      return;
    }

    res.status(500).json({ error: "Erro ao criar personagem" });
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
    res.status(500).json({ error: "Erro ao atualizar personagem" });
  }
}
