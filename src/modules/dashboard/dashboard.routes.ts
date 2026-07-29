import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns role-specific dashboard statistics for the authenticated user.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics by role
 *       401:
 *         description: Authentication required
 */
router.get("/stats", dashboardController.getDashboardStats);

export default router;
