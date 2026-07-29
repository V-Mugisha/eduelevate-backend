import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import { uploadImage as uploadImageMiddleware } from "./upload.middleware.js";
import * as uploadController from "./upload.controller.js";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image
 *     description: Uploads an image to Cloudinary and returns the public URL. Authenticated users only.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file or invalid file type
 *       401:
 *         description: Authentication required
 */
router.post("/image", uploadImageMiddleware.single("file"), uploadController.uploadImage);

export default router;
