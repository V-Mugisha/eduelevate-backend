import type { Request, Response, NextFunction } from "express";
import * as enrollmentsService from "./enrollments.service.js";

export async function enroll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const enrollment = await enrollmentsService.enroll(userId, req.params.courseId as string);
    res.status(201).json({ data: enrollment });
  } catch (error) {
    next(error);
  }
}

export async function getEnrollment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const enrollment = await enrollmentsService.getEnrollment(
      userId,
      req.params.courseId as string,
    );
    res.json({ data: enrollment });
  } catch (error) {
    next(error);
  }
}

export async function listMyEnrollments(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const enrollments = await enrollmentsService.listMyEnrollments(userId);
    res.json({ data: enrollments });
  } catch (error) {
    next(error);
  }
}

export async function listCourseStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const students = await enrollmentsService.listCourseStudents(
      userId,
      req.params.courseId as string,
    );
    res.json({ data: students });
  } catch (error) {
    next(error);
  }
}

export async function getStudentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const detail = await enrollmentsService.getStudentDetail(
      userId,
      req.params.courseId as string,
      req.params.userId as string,
    );
    res.json({ data: detail });
  } catch (error) {
    next(error);
  }
}

export async function completeLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const result = await enrollmentsService.completeLesson(userId, req.params.lessonId as string);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}
