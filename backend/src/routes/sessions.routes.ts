import { Router } from "express";
import {
  startSessionController,
  getActiveSessionController,
  closeSessionController,
} from "../controllers/sessions.controller";

const router = Router({ mergeParams: true });

router.post("/start", startSessionController);
router.get("/active", getActiveSessionController);
router.post("/:sessionId/close", closeSessionController);

export default router;
