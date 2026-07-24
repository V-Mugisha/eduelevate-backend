import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as enrollmentsController from "./enrollments.controller.js";

const router = Router({ mergeParams: true });

router.post("/courses/:courseId/enroll", authenticate, enrollmentsController.enroll);
router.get("/courses/:courseId/enrollment", authenticate, enrollmentsController.getEnrollment);
router.get("/courses/:courseId/students", authenticate, enrollmentsController.listCourseStudents);
router.get(
  "/courses/:courseId/students/:userId",
  authenticate,
  enrollmentsController.getStudentDetail,
);
router.get("/enrollments/mine", authenticate, enrollmentsController.listMyEnrollments);
router.post("/lessons/:lessonId/complete", authenticate, enrollmentsController.completeLesson);

export default router;
