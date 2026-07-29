import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as usersController from "./users.controller.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     description: Returns a paginated list of users with optional search and filter. Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, educator, admin]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by active status
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
 *         description: Paginated user list
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/", usersController.listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user details
 *     description: Returns full details of a user including role and profile. Admin only.
 *     tags: [Users]
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
 *         description: User details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.get("/:id", usersController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a user of any role with role-specific profile data. Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role, email, password, firstName, lastName]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, educator, admin]
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               schoolName:
 *                 type: string
 *               grade:
 *                 type: string
 *                 enum: [S4, S5, S6]
 *               isIndependent:
 *                 type: boolean
 *               organizationName:
 *                 type: string
 *               expertiseAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *               yearsOfExperience:
 *                 type: integer
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Email already exists
 */
router.post("/", usersController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Updates user details including role, status, and profile data. Admin only.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roleId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               schoolName:
 *                 type: string
 *               grade:
 *                 type: string
 *               expertiseAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required or self-modification attempt
 *       404:
 *         description: User not found
 */
router.put("/:id", usersController.updateUser);

/**
 * @swagger
 * /api/users/{id}/toggle-status:
 *   put:
 *     summary: Enable or disable a user
 *     description: Toggles the active status of a user. Admin only.
 *     tags: [Users]
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
 *         description: Status toggled
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required or self-modification attempt
 *       404:
 *         description: User not found
 */
router.put("/:id/toggle-status", usersController.toggleStatus);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Permanently deletes a user account. Admin only. Cannot delete self.
 *     tags: [Users]
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
 *         description: User deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required or self-deletion attempt
 *       404:
 *         description: User not found
 */
router.delete("/:id", usersController.deleteUser);

export default router;
