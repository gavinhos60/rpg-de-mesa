import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createMonsterController,
  deleteMonsterController,
  getMonsterController,
  listCampaignMonsters,
  listMyMonsters,
  updateMonsterController,
} from "../controllers/monsters.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", listMyMonsters);
router.get("/campaign/:campaignId", listCampaignMonsters);
router.get("/:id", getMonsterController);
router.post("/", createMonsterController);
router.patch("/:id", updateMonsterController);
router.delete("/:id", deleteMonsterController);

export default router;
