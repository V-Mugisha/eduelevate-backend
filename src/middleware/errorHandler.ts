import type { Request, Response, NextFunction } from "express";
import { ServiceError } from "@/modules/auth/auth.service.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ServiceError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
}
