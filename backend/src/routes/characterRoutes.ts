import { Router } from "express";

import {
  listCharacters,
  createCharacterController,
} from "../controllers/characters.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  listCharacters
);

router.post(
  "/",
  authMiddleware,
  createCharacterController
);

export default router;