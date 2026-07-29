import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as auditLogsController from "./audit-logs.controller.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: List audit logs
 *     description: Returns paginated audit log entries with optional filters. Admin only.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action (e.g. "course:create")
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [success, failure]
 *         description: Filter by status
 *       - in: query
 *         name: performedBy
 *         schema:
 *           type: string
 *         description: Filter by performer user ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs from this date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs up to this date
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search across action, entity type, and performer name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated audit log list
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/", auditLogsController.listAuditLogs);

/**
 * @swagger
 * /api/audit-logs/{id}:
 *   get:
 *     summary: Get audit log detail
 *     description: Returns full details of a single audit log entry. Admin only.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log detail
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Not found
 */
router.get("/:id", auditLogsController.getAuditLog);

/**
 * @swagger
 * /api/audit-logs/filters/actions:
 *   get:
 *     summary: List distinct audit log actions
 *     description: Returns all distinct action values for filter dropdowns. Admin only.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of distinct actions
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/filters/actions", auditLogsController.listActions);

/**
 * @swagger
 * /api/audit-logs/filters/entity-types:
 *   get:
 *     summary: List distinct audit log entity types
 *     description: Returns all distinct entity type values for filter dropdowns. Admin only.
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of distinct entity types
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/filters/entity-types", auditLogsController.listEntityTypes);

export default router;
