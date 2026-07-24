import type { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  statusCode?: number;
}

export function errorHandler(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode >= 500 ? "An unexpected error occurred. Please try again later." : error.message;

  if (statusCode >= 500) {
    console.error("Unhandled error:", error);
  }

  res.locals.error = error;
  res.status(statusCode).json({ message });
}
