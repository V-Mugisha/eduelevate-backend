import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { studentRegisterSchema, educatorRegisterSchema, loginSchema } from "./auth.dto.js";
import * as authService from "./auth.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({ message: messages });
    return;
  }
  next(error);
}

export async function registerStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = studentRegisterSchema.parse(req.body);
    const result = await authService.registerStudent(data);
    res.status(201).json(result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function registerEducator(req: Request, res: Response, next: NextFunction) {
  try {
    const data = educatorRegisterSchema.parse(req.body);
    const result = await authService.registerEducator(data);
    res.status(201).json(result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.status(200).json(result);
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
