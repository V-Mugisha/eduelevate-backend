import { Router } from "express";
import authRouter from "@/modules/auth/auth.routes";
import profileRouter from "@/modules/profile/profile.routes";
import categoriesRouter from "@/modules/categories/categories.routes";
import coursesRouter from "@/modules/courses/courses.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/categories", categoriesRouter);
router.use("/courses", coursesRouter);

export default router;
