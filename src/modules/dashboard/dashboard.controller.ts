import type { Request, Response, NextFunction } from "express";
import * as dashboardService from "./dashboard.service.js";

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const stats = await dashboardService.getDashboardStats(userId, userRole);
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
}
