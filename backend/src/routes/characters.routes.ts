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
  updateWalletController,
  updateAttunedSlotsController,
  updateActiveSlotsController,
  updateResourcesController,
  updateProgressController,
  discardItemController,
  transferItemController,
} from "../controllers/characters.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", listCharacters);
router.get("/:id", getCharacterController);
router.post("/", createCharacterController);
router.post("/:id/assign-campaign", assignCharacterController);
router.post("/:id/remove-campaign", removeCharacterFromCampaignController);
router.post("/:id/grant-item", grantCustomItemController);
router.patch("/:id/wallet", updateWalletController);
router.patch("/:id/attuned-slots", updateAttunedSlotsController);
router.patch("/:id/active-slots", updateActiveSlotsController);
router.patch("/:id/resources", updateResourcesController);
router.patch("/:id/progress", updateProgressController);
router.post("/:id/discard-item", discardItemController);
router.post("/:id/transfer-item", transferItemController);
router.patch("/:id", updateCharacterController);
router.delete("/:id", deleteCharacterController);

export default router;
