import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as sectionsController from "./sections.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authenticate, sectionsController.createSection);
router.put("/:id", authenticate, sectionsController.updateSection);
router.delete("/:id", authenticate, sectionsController.deleteSection);

export default router;
