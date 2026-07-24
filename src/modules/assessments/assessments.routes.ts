import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as assessmentsController from "./assessments.controller.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/lessons/{lessonId}/assessment:
 *   post:
 *     summary: Create an assessment for a lesson
 *     description: Creates one assessment per lesson. Only the course owner or admin can create it.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               instructions:
 *                 type: string
 *               isGraded:
 *                 type: boolean
 *                 default: true
 *                 description: Whether the assessment is required to complete the lesson
 *     responses:
 *       201:
 *         description: Assessment created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       409:
 *         description: Assessment already exists for this lesson
 */
router.post("/lessons/:lessonId/assessment", authenticate, assessmentsController.createAssessment);

/**
 * @swagger
 * /api/lessons/{lessonId}/assessment:
 *   get:
 *     summary: Get assessment for a lesson
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Assessment data or null if none exists
 *       401:
 *         description: Authentication required
 */
router.get("/lessons/:lessonId/assessment", authenticate, assessmentsController.getAssessment);

/**
 * @swagger
 * /api/assessments/{id}:
 *   put:
 *     summary: Update assessment metadata
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               instructions:
 *                 type: string
 *               isGraded:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Assessment updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Assessment not found
 */
router.put("/assessments/:id", authenticate, assessmentsController.updateAssessment);

/**
 * @swagger
 * /api/assessments/{id}:
 *   delete:
 *     summary: Delete an assessment
 *     description: Deletes the assessment and all its questions and submissions.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Assessment deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Assessment not found
 */
router.delete("/assessments/:id", authenticate, assessmentsController.deleteAssessment);

/**
 * @swagger
 * /api/assessments/{id}/questions:
 *   post:
 *     summary: Add a question to an assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Assessment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - answerOptions
 *               - correctAnswers
 *             properties:
 *               title:
 *                 type: string
 *               answerOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *               correctAnswers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 1
 *                 description: Must be a subset of answerOptions
 *               grade:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       201:
 *         description: Question created
 *       400:
 *         description: Validation error or correct answers not in options
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
router.post("/assessments/:id/questions", authenticate, assessmentsController.createQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               answerOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Must be a subset of answerOptions
 *               grade:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Question updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Question not found
 */
router.put("/questions/:id", authenticate, assessmentsController.updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Question deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Question not found
 */
router.delete("/questions/:id", authenticate, assessmentsController.deleteQuestion);

/**
 * @swagger
 * /api/assessments/{id}/questions/student:
 *   get:
 *     summary: Get assessment questions for a student
 *     description: Returns questions without correct answers. Includes submission status per question.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Assessment ID
 *     responses:
 *       200:
 *         description: Questions (correctAnswers hidden)
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not enrolled
 */
router.get(
  "/assessments/:id/questions/student",
  authenticate,
  assessmentsController.getQuestionsStudent,
);

/**
 * @swagger
 * /api/assessments/{id}/questions/owner:
 *   get:
 *     summary: Get assessment questions for the course owner
 *     description: Returns questions including correct answers.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Assessment ID
 *     responses:
 *       200:
 *         description: Questions with correctAnswers visible
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
router.get(
  "/assessments/:id/questions/owner",
  authenticate,
  assessmentsController.getQuestionsOwner,
);

/**
 * @swagger
 * /api/assessments/{id}/submit:
 *   post:
 *     summary: Submit assessment answers
 *     description: Submits answers for all questions at once. Auto-grades and returns results. Cannot re-submit.
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Assessment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - providedAnswers
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: uuid
 *                     providedAnswers:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Assessment graded with results, totalScore, and totalPossible
 *       400:
 *         description: Invalid answers or already submitted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not enrolled in this course
 */
router.post("/assessments/:id/submit", authenticate, assessmentsController.submitAssessment);

export default router;
