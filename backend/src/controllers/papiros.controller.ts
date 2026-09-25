import { Request, Response } from "express";
import {
  listPapyri,
  getPapyrus,
  createPapyrus,
  updatePapyrus,
  setPapyrusPublished,
  deletePapyrus,
} from "../services/papiros.service";

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
    case "PAPYRUS_NOT_FOUND":
      res.status(404).json({ error: "Papiro não encontrado" });
      return true;
    case "PAPYRUS_TITLE_REQUIRED":
      res.status(400).json({ error: "Título do papiro é obrigatório" });
      return true;
    case "PAPYRUS_BODY_REQUIRED":
      res.status(400).json({ error: "Texto do papiro é obrigatório" });
      return true;
    case "AUDIENCE_REQUIRED":
      res
        .status(400)
        .json({ error: "Selecione ao menos um jogador para exibir" });
      return true;
    default:
      return false;
  }
}

export async function listPapyriController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const items = await listPapyri(
      Number(req.params.campaignId),
      req.user.userId
    );
    res.json(items);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao listar papiros")) return;
    res.status(500).json({ error: "Erro ao listar papiros" });
  }
}

export async function getPapyrusController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await getPapyrus(
      Number(req.params.campaignId),
      Number(req.params.papyrusId),
      req.user.userId
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao buscar papiro")) return;
    res.status(500).json({ error: "Erro ao buscar papiro" });
  }
}

export async function createPapyrusController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await createPapyrus(
      Number(req.params.campaignId),
      req.user.userId,
      {
        title: req.body.title,
        body: req.body.body,
        imageUrl: req.body.imageUrl,
        published: req.body.published,
      }
    );
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao criar papiro")) return;
    res.status(500).json({ error: "Erro ao criar papiro" });
  }
}

export async function updatePapyrusController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await updatePapyrus(
      Number(req.params.campaignId),
      Number(req.params.papyrusId),
      req.user.userId,
      {
        title: req.body.title,
        body: req.body.body,
        imageUrl: req.body.imageUrl,
        published: req.body.published,
      }
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao atualizar papiro")) return;
    res.status(500).json({ error: "Erro ao atualizar papiro" });
  }
}

export async function publishPapyrusController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const published =
      req.body.published != null ? Boolean(req.body.published) : true;

    const item = await setPapyrusPublished(
      Number(req.params.campaignId),
      Number(req.params.papyrusId),
      req.user.userId,
      published,
      req.body.audienceUserIds
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao publicar papiro")) return;
    res.status(500).json({ error: "Erro ao publicar papiro" });
  }
}

export async function deletePapyrusController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await deletePapyrus(
      Number(req.params.campaignId),
      Number(req.params.papyrusId),
      req.user.userId
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao excluir papiro")) return;
    res.status(500).json({ error: "Erro ao excluir papiro" });
  }
}
