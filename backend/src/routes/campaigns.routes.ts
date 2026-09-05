import { Router } from "express";

import {
  listCampaigns,
  getCampaignByIdController,
  createCampaignController,
  deleteCampaignController,
} from "../controllers/campaigns.controller";

const router = Router();

router.get(
  "/",
  listCampaigns
);

router.get(
  "/:id",
  getCampaignByIdController
);

router.post(
  "/",
  createCampaignController
);

router.delete(
  "/:id",
  deleteCampaignController
);

export default router;