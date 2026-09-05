import { Router } from "express";

import {
  listUsers,
  createUserController,
} from "../controllers/users.controller";

const router = Router();

router.get("/", listUsers);

router.post("/", createUserController);

export default router;