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
 *     responses:
 *       201:
 *         description: Lesson created
 *       401:
 *         description: Authentication required
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
 *     responses:
 *       200:
 *         description: Lesson updated
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
 */
router.delete("/:id", authenticate, lessonsController.deleteLesson);

export default router;
