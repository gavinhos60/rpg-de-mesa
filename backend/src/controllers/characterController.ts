import { Request, Response } from "express";

import {
  getCharacters,
  createCharacter,
  updateCharacter,
} from "../services/characters.service";

export async function listCharacters(
  req: Request,
  res: Response
) {
  try {
    const characters = await getCharacters();

    res.json(characters);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar personagens",
    });
  }
}

export async function createCharacterController(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      res.status(401).json({
        error: "Usuário não autenticado",
      });

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
    } = req.body;

    if (
      !name ||
      !className ||
      !race ||
      !level ||
      !playerId ||
      !campaignId
    ) {
      res.status(400).json({
        error: "Dados obrigatórios não informados",
      });

      return;
    }

    const character = await createCharacter({
      name: name.trim(),
      className: className.trim(),
      race: race.trim(),
      level: Number(level),
      avatar: avatar?.trim() || undefined,
      playerId: Number(playerId),
      campaignId: Number(campaignId),
      authenticatedUserId: req.user.userId,
    });

    res.status(201).json(character);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "NOT_CAMPAIGN_MEMBER"
    ) {
      res.status(403).json({
        error: "Você não pertence a esta campanha",
      });

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

    res.status(500).json({
      error: "Erro ao criar personagem",
    });
  }
}