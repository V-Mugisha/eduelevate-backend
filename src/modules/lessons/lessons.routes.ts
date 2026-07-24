import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as lessonsController from "./lessons.controller.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/modules/{moduleId}/lessons:
 *   get:
 *     summary: List lessons for a module
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get("/", lessonsController.listLessons);

/**
 * @swagger
 * /api/modules/{moduleId}/lessons/{id}:
 *   get:
 *     summary: Get a single lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson details
 *       404:
 *         description: Lesson not found
 */
router.get("/:id", lessonsController.getLesson);

/**
 * @swagger
 * /api/modules/{moduleId}/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: HTML Document Structure
 *               subtitle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lesson created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
router.post("/", authenticate, lessonsController.createLesson);

/**
 * @swagger
 * /api/modules/{moduleId}/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: string }
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
 *               subtitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */
router.put("/:id", authenticate, lessonsController.updateLesson);

/**
 * @swagger
 * /api/modules/{moduleId}/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lesson deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */
router.delete("/:id", authenticate, lessonsController.deleteLesson);

export default router;
