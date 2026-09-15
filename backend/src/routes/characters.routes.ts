import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  listCharacters,
  getCharacterController,
  createCharacterController,
  updateCharacterController,
  assignCharacterController,
  removeCharacterFromCampaignController,
  deleteCharacterController,
  grantCustomItemController,
} from "../controllers/characters.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", listCharacters);
router.get("/:id", getCharacterController);
router.post("/", createCharacterController);
router.post("/:id/assign-campaign", assignCharacterController);
router.post("/:id/remove-campaign", removeCharacterFromCampaignController);
router.post("/:id/grant-item", grantCustomItemController);
router.patch("/:id", updateCharacterController);
router.delete("/:id", deleteCharacterController);

export default router;
