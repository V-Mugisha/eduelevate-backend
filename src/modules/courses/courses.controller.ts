import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  createCourseSchema,
  updateCourseSchema,
  courseQuerySchema,
  publishCourseSchema,
} from "./courses.dto.js";
import * as coursesService from "./courses.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const query = courseQuerySchema.parse(req.query);
    const result = await coursesService.listCourses(query);
    res.json({ data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function getCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await coursesService.getCourse(req.params.id as string);
    res.json({ data: course });
  } catch (error) {
    next(error);
  }
}

export async function listMyCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const courses = await coursesService.listMyCourses(userId);
    res.json({ data: courses });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createCourseSchema.parse(req.body);
    const course = await coursesService.create(data, userId, req.user?.role);
    res.status(201).json({ data: course });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateCourseSchema.parse(req.body);
    const course = await coursesService.update(
      req.params.id as string,
      data,
      userId,
      req.user?.role,
    );
    res.json({ data: course });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function publishCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const { publish } = publishCourseSchema.parse(req.body);
    const course = await coursesService.setPublishStatus(
      userId,
      req.params.id as string,
      publish,
      req.user?.role,
    );
    res.json({ data: course });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await coursesService.remove(req.params.id as string, userId, req.user?.role);
    res.json({ message: "Course deleted" });
  } catch (error) {
    next(error);
  }
}
