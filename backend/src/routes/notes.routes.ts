import { Router } from "express";
import {
  listNotesController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} from "../controllers/notes.controller";

const router = Router({ mergeParams: true });

router.get("/", listNotesController);
router.post("/", createNoteController);
router.patch("/:noteId", updateNoteController);
router.delete("/:noteId", deleteNoteController);

export default router;
