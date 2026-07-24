import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as certificatesController from "./certificates.controller.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/courses/{courseId}/certificate:
 *   post:
 *     summary: Generate a certificate for completing a course
 *     description: Generates a certificate for the authenticated student. Requires 100% lesson completion and no duplicate certificate.
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Certificate generated
 *       400:
 *         description: Course has no lessons or not all lessons completed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not enrolled in this course
 *       404:
 *         description: Course not found
 *       409:
 *         description: Certificate already generated
 */
router.post(
  "/courses/:courseId/certificate",
  authenticate,
  certificatesController.generateCertificate,
);

/**
 * @swagger
 * /api/courses/{courseId}/certificate:
 *   get:
 *     summary: Get certificate for the current user in a course
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Certificate data or null
 *       401:
 *         description: Authentication required
 */
router.get(
  "/courses/:courseId/certificate",
  authenticate,
  certificatesController.getCertificateByCourse,
);

/**
 * @swagger
 * /api/certificates:
 *   get:
 *     summary: List certificates for the authenticated user
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates with course details
 *       401:
 *         description: Authentication required
 */
router.get("/certificates", authenticate, certificatesController.listCertificates);

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     summary: Get a certificate by ID
 *     description: Returns certificate details. Accessible by the certificate owner, the course educator, or an admin.
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Certificate with user, course, and educator details
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Certificate not found
 */
router.get("/certificates/:id", authenticate, certificatesController.getCertificate);

export default router;
