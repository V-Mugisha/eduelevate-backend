import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as assessmentsController from "./assessments.controller.js";

const router = Router({ mergeParams: true });

router.post("/lessons/:lessonId/assessment", authenticate, assessmentsController.createAssessment);
router.get("/lessons/:lessonId/assessment", authenticate, assessmentsController.getAssessment);

router.put("/assessments/:id", authenticate, assessmentsController.updateAssessment);
router.delete("/assessments/:id", authenticate, assessmentsController.deleteAssessment);

router.post("/assessments/:id/questions", authenticate, assessmentsController.createQuestion);
router.put("/questions/:id", authenticate, assessmentsController.updateQuestion);
router.delete("/questions/:id", authenticate, assessmentsController.deleteQuestion);

router.get(
  "/assessments/:id/questions/student",
  authenticate,
  assessmentsController.getQuestionsStudent,
);
router.get(
  "/assessments/:id/questions/owner",
  authenticate,
  assessmentsController.getQuestionsOwner,
);

router.post("/assessments/:id/submit", authenticate, assessmentsController.submitAssessment);

export default router;
