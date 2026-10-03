import { Request, Response } from "express";
import {
  createCustomMonster,
  deleteCustomMonster,
  getCustomMonsterById,
  getCustomMonstersForCampaign,
  getMyCustomMonsters,
  updateCustomMonster,
} from "../services/monsters.service";

function mapMonsterError(error: unknown, res: Response, fallback: string) {
  if (!(error instanceof Error)) {
    res.status(500).json({ error: fallback });
    return true;
  }
  switch (error.message) {
    case "MONSTER_NOT_FOUND":
      res.status(404).json({ error: "Monstro não encontrado" });
      return true;
    case "MONSTER_FORBIDDEN":
      res.status(403).json({ error: "Você não tem acesso a este monstro" });
      return true;
    case "NOT_CAMPAIGN_MEMBER":
      res.status(403).json({ error: "Você não pertence a esta campanha" });
      return true;
    case "MONSTER_NAME_REQUIRED":
      res.status(400).json({ error: "Informe o nome do monstro" });
      return true;
    default:
      return false;
  }
}

export async function listMyMonsters(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const monsters = await getMyCustomMonsters(req.user.userId);
    res.json(monsters);
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao listar monstros")) return;
    console.error(error);
    res.status(500).json({ error: "Erro ao listar monstros" });
  }
}

export async function listCampaignMonsters(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const campaignId = Number(req.params.campaignId);
    if (!Number.isFinite(campaignId)) {
      res.status(400).json({ error: "Campanha inválida" });
      return;
    }
    const monsters = await getCustomMonstersForCampaign(
      campaignId,
      req.user.userId
    );
    res.json(monsters);
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao listar monstros da campanha"))
      return;
    console.error(error);
    res.status(500).json({ error: "Erro ao listar monstros da campanha" });
  }
}

export async function getMonsterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Monstro inválido" });
      return;
    }
    const monster = await getCustomMonsterById(id, req.user.userId);
    res.json(monster);
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao carregar monstro")) return;
    console.error(error);
    res.status(500).json({ error: "Erro ao carregar monstro" });
  }
}

export async function createMonsterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const { name, avatar, sheet } = req.body ?? {};
    const monster = await createCustomMonster(req.user.userId, {
      name: String(name ?? ""),
      avatar: avatar ?? null,
      sheet,
    });
    res.status(201).json(monster);
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao criar monstro")) return;
    console.error(error);
    res.status(500).json({ error: "Erro ao criar monstro" });
  }
}

export async function updateMonsterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Monstro inválido" });
      return;
    }
    const { name, avatar, sheet } = req.body ?? {};
    const monster = await updateCustomMonster(id, req.user.userId, {
      ...(name !== undefined ? { name: String(name) } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
      ...(sheet !== undefined ? { sheet } : {}),
    });
    res.json(monster);
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao atualizar monstro")) return;
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar monstro" });
  }
}

export async function deleteMonsterController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Monstro inválido" });
      return;
    }
    await deleteCustomMonster(id, req.user.userId);
    res.status(204).send();
  } catch (error) {
    if (mapMonsterError(error, res, "Erro ao excluir monstro")) return;
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir monstro" });
  }
}
