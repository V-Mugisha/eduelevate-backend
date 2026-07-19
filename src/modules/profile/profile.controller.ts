import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  updateProfileSchema,
  updateStudentProfileSchema,
  updateEducatorProfileSchema,
} from "./profile.dto.js";
import * as profileService from "./profile.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({ message: messages });
    return;
  }
  next(error);
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const profile = await profileService.getProfile(userId);
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const data = updateProfileSchema.parse(req.body);
    const user = await profileService.updateProfile(userId, data);
    res.json({ message: "Profile updated", data: user });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function updateStudentProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const data = updateStudentProfileSchema.parse(req.body);
    const profile = await profileService.updateStudentProfileData(userId, data);
    res.json({ message: "Student profile updated", data: profile });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function updateEducatorProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const data = updateEducatorProfileSchema.parse(req.body);
    const profile = await profileService.updateEducatorProfileData(userId, data);
    res.json({ message: "Educator profile updated", data: profile });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
