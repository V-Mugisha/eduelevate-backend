import type { Request, Response, NextFunction } from "express";
import * as certificatesService from "./certificates.service.js";

export async function generateCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const certificate = await certificatesService.generateCertificate(
      userId,
      req.params.courseId as string,
    );
    res.status(201).json({ data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function getCertificateByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const certificate = await certificatesService.findByUserAndCourse(
      userId,
      req.params.courseId as string,
    );
    res.json({ data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function getCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const certificate = await certificatesService.getCertificate(
      req.params.id as string,
      userId,
      req.user?.role,
    );
    res.json({ data: certificate });
  } catch (error) {
    next(error);
  }
}

export async function listCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const certificates = await certificatesService.listCertificates(userId);
    res.json({ data: certificates });
  } catch (error) {
    next(error);
  }
}
