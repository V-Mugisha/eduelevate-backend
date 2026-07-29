import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { auditLogQuerySchema } from "./audit-logs.dto.js";
import * as auditLogsService from "./audit-logs.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({ message: messages });
    return;
  }
  next(error);
}

export async function listAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const query = auditLogQuerySchema.parse(req.query);
    const result = await auditLogsService.listAuditLogs(query, userRole);
    res.json({ data: result.logs, total: result.total, page: query.page, limit: query.limit });
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getAuditLog(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const log = await auditLogsService.getAuditLog(req.params.id as string, userRole);
    res.json({ data: log });
  } catch (error) {
    next(error);
  }
}

export async function listActions(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    if (!req.user?.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const actions = await auditLogsService.listActions(userRole);
    res.json({ data: actions });
  } catch (error) {
    next(error);
  }
}

export async function listEntityTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    if (!req.user?.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const types = await auditLogsService.listEntityTypes(userRole);
    res.json({ data: types });
  } catch (error) {
    next(error);
  }
}
