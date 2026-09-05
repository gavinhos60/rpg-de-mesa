import { Router } from "express";

import {
  listCampaignMembers,
  createCampaignMember,
  addPlayerByEmailController,
  updateCampaignMemberController,
  removeCampaignMemberController,
} from "../controllers/campaign-members.controller";

const router = Router();

router.get(
  "/:campaignId/members",
  listCampaignMembers
);

router.post(
  "/:campaignId/members",
  createCampaignMember
);

router.post(
  "/:campaignId/members/player",
  addPlayerByEmailController
);

router.patch(
  "/:campaignId/members/:userId",
  updateCampaignMemberController
);

router.delete(
  "/:campaignId/members/:userId",
  removeCampaignMemberController
);

export default router;