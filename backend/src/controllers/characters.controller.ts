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
    const character = await createCharacter({
      name: req.body.name,
      className: req.body.className,
      race: req.body.race,
      level: req.body.level,
      avatar: req.body.avatar,
      playerId: req.body.playerId,
      campaignId: req.body.campaignId,
    });

    res.status(201).json(character);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar personagem",
    });
  }
}

export async function updateCharacterController(
  req: Request,
  res: Response
) {
  try {
    const character = await updateCharacter(
      Number(req.params.id),
      {
        playerId: req.body.playerId,
        campaignId: req.body.campaignId,
      }
    );

    res.json(character);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao atualizar personagem",
    });
  }
}