import { Router } from "express";
import {
  listPapyriController,
  getPapyrusController,
  createPapyrusController,
  updatePapyrusController,
  publishPapyrusController,
  deletePapyrusController,
} from "../controllers/papiros.controller";

const router = Router({ mergeParams: true });

router.get("/", listPapyriController);
router.get("/:papyrusId", getPapyrusController);
router.post("/", createPapyrusController);
router.patch("/:papyrusId", updatePapyrusController);
router.post("/:papyrusId/publish", publishPapyrusController);
router.delete("/:papyrusId", deletePapyrusController);

export default router;
