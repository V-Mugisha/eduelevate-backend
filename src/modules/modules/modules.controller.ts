import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createModuleSchema, updateModuleSchema } from "./modules.dto.js";
import * as modulesService from "./modules.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function listModules(req: Request, res: Response, next: NextFunction) {
  try {
    const mods = await modulesService.listModules(req.params.courseId as string);
    res.json({ data: mods });
  } catch (error) {
    next(error);
  }
}

export async function getModule(req: Request, res: Response, next: NextFunction) {
  try {
    const mod = await modulesService.getModule(req.params.id as string);
    res.json({ data: mod });
  } catch (error) {
    next(error);
  }
}

export async function createModule(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createModuleSchema.parse(req.body);
    const mod = await modulesService.create(data, req.params.courseId as string, userId);
    res.status(201).json({ data: mod });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateModule(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateModuleSchema.parse(req.body);
    const mod = await modulesService.update(req.params.id as string, data, userId);
    res.json({ data: mod });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteModule(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await modulesService.remove(req.params.id as string, userId);
    res.json({ message: "Module deleted" });
  } catch (error) {
    next(error);
  }
}
