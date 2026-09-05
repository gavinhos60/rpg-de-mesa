import { Request, Response } from "express";

import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  deleteCampaign,
} from "../services/campaigns.service";

export async function listCampaigns(
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

    const campaigns = await getCampaigns(
      req.user.userId
    );

    res.json(campaigns);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar campanhas",
    });
  }
}

export async function getCampaignByIdController(
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

    const campaignId = Number(req.params.id);

    const campaign = await getCampaignById(
      campaignId,
      req.user.userId
    );

    if (!campaign) {
      res.status(404).json({
        error: "Campanha não encontrada",
      });

      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar campanha",
    });
  }
}

export async function createCampaignController(
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

    const name = req.body.name;

    if (!name || !name.trim()) {
      res.status(400).json({
        error: "Nome da campanha é obrigatório",
      });

      return;
    }

    const campaign = await createCampaign(
      name.trim(),
      req.user.userId
    );

    res.status(201).json(campaign);
  } catch (error) {
    console.error(
      "ERRO AO CRIAR CAMPANHA:",
      error
    );

    res.status(500).json({
      error: "Erro ao criar campanha",
    });
  }
}
export async function deleteCampaignController(
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

    const campaignId = Number(req.params.id);

    if (Number.isNaN(campaignId)) {
      res.status(400).json({
        error: "ID da campanha inválido",
      });

      return;
    }

    await deleteCampaign(
      campaignId,
      req.user.userId
    );

    res.status(204).send();
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
      error.message === "MASTER_REQUIRED"
    ) {
      res.status(403).json({
        error: "Somente o mestre pode excluir a campanha",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao excluir campanha",
    });
  }
}
