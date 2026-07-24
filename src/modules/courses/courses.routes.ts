import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as coursesController from "./courses.controller.js";

const router = Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: List published courses
 *     description: Returns a paginated list of published courses. Supports search, category, and level filters.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search term for title and description
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by course level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Number of courses per page
 *     responses:
 *       200:
 *         description: Paginated list of courses
 */
router.get("/", coursesController.listCourses);

/**
 * @swagger
 * /api/courses/my-courses:
 *   get:
 *     summary: List courses created by the authenticated user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses created by the user
 *       401:
 *         description: Authentication required
 */
router.get("/my-courses", authenticate, coursesController.listMyCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get("/:id", coursesController.getCourse);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - categoryId
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 example: Introduction to Web Development
 *               subtitle:
 *                 type: string
 *                 maxLength: 300
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: beginner
 *               duration:
 *                 type: string
 *                 example: 6 weeks
 *               maxStudents:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Course created (draft)
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only educators and admins can create courses
 */
router.post("/", authenticate, coursesController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               duration:
 *                 type: string
 *               maxStudents:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Course updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.put("/:id", authenticate, coursesController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}/publish:
 *   patch:
 *     summary: Toggle course publish status
 *     tags: [Courses]
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
 *             required:
 *               - publish
 *             properties:
 *               publish:
 *                 type: boolean
 *                 description: Set true to publish, false to unpublish
 *     responses:
 *       200:
 *         description: Publish status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.patch("/:id/publish", authenticate, coursesController.publishCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.delete("/:id", authenticate, coursesController.deleteCourse);

export default router;
