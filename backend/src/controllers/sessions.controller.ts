import { Request, Response } from "express";
import {
  startGameSession,
  getActiveGameSession,
  closeGameSession,
} from "../services/sessions.service";

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
    case "SESSION_NOT_FOUND":
      res.status(404).json({ error: "Sessão não encontrada" });
      return true;
    default:
      return false;
  }
}

export async function startSessionController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const session = await startGameSession(
      Number(req.params.campaignId),
      req.user.userId
    );

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao iniciar sessão")) return;
    res.status(500).json({ error: "Erro ao iniciar sessão" });
  }
}

export async function getActiveSessionController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const session = await getActiveGameSession(
      Number(req.params.campaignId),
      req.user.userId
    );

    res.json(session);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao buscar sessão")) return;
    res.status(500).json({ error: "Erro ao buscar sessão" });
  }
}

export async function closeSessionController(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const session = await closeGameSession(
      Number(req.params.campaignId),
      Number(req.params.sessionId),
      req.user.userId
    );

    res.json(session);
  } catch (error) {
    console.error(error);
    if (mapError(error, res, "Erro ao encerrar sessão")) return;
    res.status(500).json({ error: "Erro ao encerrar sessão" });
  }
}
