import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import * as coursesController from "./courses.controller.js";

const router = Router();

router.get("/", coursesController.listCourses);
router.get("/my-courses", authenticate, coursesController.listMyCourses);
router.get("/:id", coursesController.getCourse);
router.post("/", authenticate, coursesController.createCourse);
router.put("/:id", authenticate, coursesController.updateCourse);
router.delete("/:id", authenticate, coursesController.deleteCourse);

export default router;
