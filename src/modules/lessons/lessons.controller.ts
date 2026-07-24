import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createLessonSchema, updateLessonSchema } from "./lessons.dto.js";
import * as lessonsService from "./lessons.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function listLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const lessons = await lessonsService.listLessons(req.params.moduleId as string);
    res.json({ data: lessons });
  } catch (error) {
    next(error);
  }
}

export async function getLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const lesson = await lessonsService.getLesson(req.params.id as string);
    res.json({ data: lesson });
  } catch (error) {
    next(error);
  }
}

export async function createLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createLessonSchema.parse(req.body);
    const lesson = await lessonsService.create(data, req.params.moduleId as string, userId);
    res.status(201).json({ data: lesson });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateLessonSchema.parse(req.body);
    const lesson = await lessonsService.update(req.params.id as string, data, userId);
    res.json({ data: lesson });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await lessonsService.remove(req.params.id as string, userId);
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    next(error);
  }
}
