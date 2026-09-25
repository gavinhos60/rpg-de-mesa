import { Router } from "express";
import {
  listNotesController,
  listPublishedNotesController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
  publishNoteController,
} from "../controllers/notes.controller";

const router = Router({ mergeParams: true });

router.get("/published", listPublishedNotesController);
router.get("/", listNotesController);
router.post("/", createNoteController);
router.patch("/:noteId", updateNoteController);
router.post("/:noteId/publish", publishNoteController);
router.delete("/:noteId", deleteNoteController);

export default router;
