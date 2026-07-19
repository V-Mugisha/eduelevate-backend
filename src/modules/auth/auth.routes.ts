import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as authController from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register/student:
 *   post:
 *     summary: Register a new student account
 *     description: Creates a student user account along with a student profile. Returns the new user and a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - schoolName
 *               - grade
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: de Dieu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: StrongPass1
 *               schoolName:
 *                 type: string
 *                 example: Lycee de Kigali
 *               grade:
 *                 type: string
 *                 enum: [S4, S5, S6]
 *                 example: S5
 *     responses:
 *       201:
 *         description: Student account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AuthUser'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
router.post("/register/student", authController.registerStudent);

/**
 * @swagger
 * /api/auth/register/educator:
 *   post:
 *     summary: Register a new educator account
 *     description: Creates an educator user account along with an educator profile. Returns the new user and a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - expertiseAreas
 *               - bio
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Marie
 *               lastName:
 *                 type: string
 *                 example: Uwimana
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marie@school.rw
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: StrongPass1
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
 *                 example: Passionate educator with 5 years of experience teaching programming to high school students.
 *     responses:
 *       201:
 *         description: Educator account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AuthUser'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
router.post("/register/educator", authController.registerEducator);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in to an existing account
 *     description: Authenticates a user with email and password. Returns the user profile and a JWT token valid for 7 days.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@eduelevate.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/AuthUser'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account deactivated
 */
router.post("/login", authController.login);

router.put("/change-password", authenticate, authController.changePassword);

export default router;
