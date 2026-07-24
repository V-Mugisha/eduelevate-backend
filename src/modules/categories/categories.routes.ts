import { Router } from "express";
import * as categoriesController from "./categories.controller.js";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all course categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                         nullable: true
 */
router.get("/", categoriesController.listCategories);

export default router;
