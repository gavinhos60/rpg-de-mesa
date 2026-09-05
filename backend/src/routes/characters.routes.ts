import { Router } from "express";

import {
  listCharacters,
  createCharacterController,
  updateCharacterController,
} from "../controllers/characters.controller";

const router = Router();

router.get("/", listCharacters);

router.post("/", createCharacterController);

router.patch("/:id", updateCharacterController);

export default router;