import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  listCharacters,
  getCharacterController,
  createCharacterController,
  updateCharacterController,
  assignCharacterController,
} from "../controllers/characters.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", listCharacters);
router.get("/:id", getCharacterController);
router.post("/", createCharacterController);
router.post("/:id/assign-campaign", assignCharacterController);
router.patch("/:id", updateCharacterController);

export default router;
