import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
  createQuestionSchema,
  updateQuestionSchema,
  submitAssessmentSchema,
} from "./assessments.dto.js";
import * as assessmentsService from "./assessments.service.js";

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.issues.map((i) => i.message).join(", ") });
    return;
  }
  next(error);
}

export async function getAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const assessment = await assessmentsService.getAssessment(req.params.lessonId as string);
    res.json({ data: assessment });
  } catch (error) {
    next(error);
  }
}

export async function createAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createAssessmentSchema.parse(req.body);
    const assessment = await assessmentsService.createAssessment(
      data,
      req.params.lessonId as string,
      userId,
      req.user?.role,
    );
    res.status(201).json({ data: assessment });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateAssessmentSchema.parse(req.body);
    const assessment = await assessmentsService.updateAssessment(
      req.params.id as string,
      data,
      userId,
      req.user?.role,
    );
    res.json({ data: assessment });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await assessmentsService.removeAssessment(req.params.id as string, userId, req.user?.role);
    res.json({ message: "Assessment deleted" });
  } catch (error) {
    next(error);
  }
}

export async function createQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = createQuestionSchema.parse(req.body);
    const question = await assessmentsService.createQuestion(
      data,
      req.params.id as string,
      userId,
      req.user?.role,
    );
    res.status(201).json({ data: question });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = updateQuestionSchema.parse(req.body);
    const question = await assessmentsService.updateQuestion(
      req.params.id as string,
      data,
      userId,
      req.user?.role,
    );
    res.json({ data: question });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    await assessmentsService.removeQuestion(req.params.id as string, userId, req.user?.role);
    res.json({ message: "Question deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const questions = await assessmentsService.getQuestionsForStudent(
      req.params.id as string,
      userId,
    );
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
}

export async function getQuestionsOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const questions = await assessmentsService.getQuestionsForOwner(
      req.params.id as string,
      userId,
      req.user?.role,
    );
    res.json({ data: questions });
  } catch (error) {
    next(error);
  }
}

export async function submitAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Auth required" });
      return;
    }
    const data = submitAssessmentSchema.parse(req.body);
    const result = await assessmentsService.submitAssessment(data, req.params.id as string, userId);
    res.json({ data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}
