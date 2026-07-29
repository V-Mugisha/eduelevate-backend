import { Router } from "express";
import authRouter from "@/modules/auth/auth.routes";
import profileRouter from "@/modules/profile/profile.routes";
import categoriesRouter from "@/modules/categories/categories.routes";
import coursesRouter from "@/modules/courses/courses.routes";
import modulesRouter from "@/modules/modules/modules.routes";
import lessonsRouter from "@/modules/lessons/lessons.routes";
import enrollmentsRouter from "@/modules/enrollments/enrollments.routes";
import assessmentsRouter from "@/modules/assessments/assessments.routes";
import certificatesRouter from "@/modules/certificates/certificates.routes";
import mentorshipRouter from "@/modules/mentorship/mentorship.routes";
import usersRouter from "@/modules/users/users.routes";
import auditLogsRouter from "@/modules/audit-logs/audit-logs.routes";
import dashboardRouter from "@/modules/dashboard/dashboard.routes";
import uploadRouter from "@/modules/upload/upload.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/categories", categoriesRouter);
router.use("/courses", coursesRouter);
router.use("/courses/:courseId/modules", modulesRouter);
router.use("/modules/:moduleId/lessons", lessonsRouter);
router.use("/", assessmentsRouter);
router.use("/", certificatesRouter);
router.use("/", mentorshipRouter);
router.use("/", enrollmentsRouter);
router.use("/users", usersRouter);
router.use("/audit-logs", auditLogsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/upload", uploadRouter);

export default router;
