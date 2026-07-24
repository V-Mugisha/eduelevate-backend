import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as certificatesController from "./certificates.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/courses/:courseId/certificate",
  authenticate,
  certificatesController.generateCertificate,
);
router.get(
  "/courses/:courseId/certificate",
  authenticate,
  certificatesController.getCertificateByCourse,
);
router.get("/certificates", authenticate, certificatesController.listCertificates);
router.get("/certificates/:id", authenticate, certificatesController.getCertificate);

export default router;
