import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as profileController from "./profile.controller.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile including role-specific data.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Authentication required
 */
router.get("/", profileController.getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's first name and last name.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: de Dieu
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put("/", profileController.updateProfile);

/**
 * @swagger
 * /api/profile/student:
 *   put:
 *     summary: Update student profile
 *     description: Updates school name and grade for the authenticated student.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schoolName:
 *                 type: string
 *                 example: Lycee de Kigali
 *               grade:
 *                 type: string
 *                 enum: [S4, S5, S6]
 *                 example: S5
 *     responses:
 *       200:
 *         description: Student profile updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put("/student", profileController.updateStudentProfile);

/**
 * @swagger
 * /api/profile/educator:
 *   put:
 *     summary: Update educator profile
 *     description: Updates educator-specific fields like bio, expertise areas, and organization.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isIndependent:
 *                 type: boolean
 *                 example: false
 *               organizationName:
 *                 type: string
 *                 example: Green Hills Academy
 *               expertiseAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Web Development", "Python"]
 *               yearsOfExperience:
 *                 type: integer
 *                 example: 5
 *               bio:
 *                 type: string
 *                 example: Passionate educator with 5 years of experience.
 *     responses:
 *       200:
 *         description: Educator profile updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put("/educator", profileController.updateEducatorProfile);

export default router;
