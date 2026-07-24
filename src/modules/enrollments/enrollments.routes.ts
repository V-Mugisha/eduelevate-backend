import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as enrollmentsController from "./enrollments.controller.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     description: Enrolls the authenticated student in a published course. Cannot enroll in own course.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Enrollment created
 *       400:
 *         description: Course not published or cannot enroll in own course
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Course not found
 *       409:
 *         description: Already enrolled or course is full
 */
router.post("/courses/:courseId/enroll", authenticate, enrollmentsController.enroll);

/**
 * @swagger
 * /api/courses/{courseId}/enrollment:
 *   get:
 *     summary: Get enrollment for the current user
 *     description: Returns the authenticated user's enrollment for a specific course, or null if not enrolled.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Enrollment data or null
 *       401:
 *         description: Authentication required
 */
router.get("/courses/:courseId/enrollment", authenticate, enrollmentsController.getEnrollment);

/**
 * @swagger
 * /api/courses/{courseId}/students:
 *   get:
 *     summary: List students enrolled in a course
 *     description: Returns all students enrolled in the course with their progress. Course owner or admin only.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of enrolled students with progress
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.get("/courses/:courseId/students", authenticate, enrollmentsController.listCourseStudents);

/**
 * @swagger
 * /api/courses/{courseId}/students/{userId}:
 *   get:
 *     summary: Get student detail for a course
 *     description: Returns detailed enrollment data for a specific student including module/lesson progress. Course owner or admin only.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Student enrollment details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course or student not found
 */
router.get(
  "/courses/:courseId/students/:userId",
  authenticate,
  enrollmentsController.getStudentDetail,
);

/**
 * @swagger
 * /api/enrollments/mine:
 *   get:
 *     summary: List all of the current user's enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's enrollments with progress
 *       401:
 *         description: Authentication required
 */
router.get("/enrollments/mine", authenticate, enrollmentsController.listMyEnrollments);

/**
 * @swagger
 * /api/lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark a lesson as complete
 *     description: Marks the lesson as complete for the authenticated student. If the lesson has a graded assessment, all questions must be submitted first.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson marked as complete
 *       400:
 *         description: Assessment not yet completed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not enrolled in this course
 *       404:
 *         description: Course or lesson not found
 */
router.post("/lessons/:lessonId/complete", authenticate, enrollmentsController.completeLesson);

export default router;
