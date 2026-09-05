import { Request, Response } from "express";

import {
  getCampaignMembers,
  addCampaignMember,
  addPlayerByEmail,
  updateCampaignMember,
  removeCampaignMember,
} from "../services/campaign-members.service";

export async function listCampaignMembers(
  req: Request,
  res: Response
) {
  try {
    const campaignId = Number(
      req.params.campaignId
    );

    const members =
      await getCampaignMembers(campaignId);

    res.json(members);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar membros da campanha",
    });
  }
}

export async function createCampaignMember(
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

    const campaignId = Number(
      req.params.campaignId
    );

    const { userId, role } = req.body;

    const member = await addCampaignMember({
      userId,
      campaignId,
      role,
      authenticatedUserId: req.user.userId,
    });

    res.status(201).json(member);
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
        error: "Somente o mestre pode gerenciar os membros",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao adicionar membro",
    });
  }
}

export async function addPlayerByEmailController(
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

    const campaignId = Number(
      req.params.campaignId
    );

    const email = req.body.email?.trim();

    if (!email) {
      res.status(400).json({
        error: "Email é obrigatório",
      });

      return;
    }

    const member = await addPlayerByEmail(
      campaignId,
      email,
      req.user.userId
    );

    res.status(201).json(member);
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
        error: "Somente o mestre pode adicionar jogadores",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      res.status(404).json({
        error: "Usuário não encontrado",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_MEMBER"
    ) {
      res.status(409).json({
        error: "Usuário já faz parte desta campanha",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao adicionar jogador",
    });
  }
}

export async function updateCampaignMemberController(
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

    const userId = Number(req.params.userId);

    const campaignId = Number(
      req.params.campaignId
    );

    const { role } = req.body;

    const member = await updateCampaignMember(
      userId,
      campaignId,
      role,
      req.user.userId
    );

    res.json(member);
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
        error: "Somente o mestre pode gerenciar os membros",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao atualizar membro",
    });
  }
}

export async function removeCampaignMemberController(
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

    const userId = Number(req.params.userId);

    const campaignId = Number(
      req.params.campaignId
    );

    await removeCampaignMember(
      userId,
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
        error: "Somente o mestre pode gerenciar os membros",
      });

      return;
    }

    res.status(500).json({
      error: "Erro ao remover membro",
    });
  }
}