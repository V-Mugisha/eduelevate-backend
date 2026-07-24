import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createSectionSchema, updateSectionSchema } from "./sections.dto.js";
import * as sectionsService from "./sections.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function createSection(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createSectionSchema.parse(req.body);
    const section = await sectionsService.create(data, req.params.lessonId as string, userId);
    res.status(201).json({ data: section });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateSection(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateSectionSchema.parse(req.body);
    const section = await sectionsService.update(req.params.id as string, data, userId);
    res.json({ data: section });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteSection(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await sectionsService.remove(req.params.id as string, userId);
    res.json({ message: "Section deleted" });
  } catch (error) {
    next(error);
  }
}
