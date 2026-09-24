import { Request, Response } from "express";
import {
  listPlayerNotes,
  createPlayerNote,
  updatePlayerNote,
  deletePlayerNote,
} from "../services/notes.service";

function mapError(error: unknown, res: Response, fallback: string) {
  if (!(error instanceof Error)) {
    res.status(500).json({ error: fallback });
    return true;
  }

  switch (error.message) {
    case "NOT_CAMPAIGN_MEMBER":
      res.status(403).json({ error: "Você não pertence a esta campanha" });
      return true;
    case "NOTE_NOT_FOUND":
      res.status(404).json({ error: "Anotação não encontrada" });
      return true;
    case "NOTE_BODY_REQUIRED":
      res
        .status(400)
        .json({ error: "Informe texto ou imagem na anotação" });
      return true;
    default:
      return false;
  }
}

export async function listNotesController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const items = await listPlayerNotes(
      Number(req.params.campaignId),
      req.user.userId
    );
    res.json(items);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao listar anotações")) return;
    res.status(500).json({ error: "Erro ao listar anotações" });
  }
}

export async function createNoteController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await createPlayerNote(
      Number(req.params.campaignId),
      req.user.userId,
      {
        title: req.body.title,
        body: req.body.body,
        imageUrl: req.body.imageUrl,
      }
    );
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao criar anotação")) return;
    res.status(500).json({ error: "Erro ao criar anotação" });
  }
}

export async function updateNoteController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const item = await updatePlayerNote(
      Number(req.params.campaignId),
      Number(req.params.noteId),
      req.user.userId,
      {
        title: req.body.title,
        body: req.body.body,
        imageUrl: req.body.imageUrl,
      }
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao atualizar anotação")) return;
    res.status(500).json({ error: "Erro ao atualizar anotação" });
  }
}

export async function deleteNoteController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await deletePlayerNote(
      Number(req.params.campaignId),
      Number(req.params.noteId),
      req.user.userId
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao excluir anotação")) return;
    res.status(500).json({ error: "Erro ao excluir anotação" });
  }
}
