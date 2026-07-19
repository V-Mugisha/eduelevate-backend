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
 *     description: Update the authenticated user's first name and last name.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Authentication required
 */
router.put("/", profileController.updateProfile);

/**
 * @swagger
 * /api/profile/student:
 *   put:
 *     summary: Update student profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile updated
 */
router.put("/student", profileController.updateStudentProfile);

/**
 * @swagger
 * /api/profile/educator:
 *   put:
 *     summary: Update educator profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Educator profile updated
 */
router.put("/educator", profileController.updateEducatorProfile);

export default router;
