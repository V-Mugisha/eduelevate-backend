import { prisma } from "@/lib/prisma";
import type {
  CreateAssessmentInput,
  UpdateAssessmentInput,
  CreateQuestionInput,
  UpdateQuestionInput,
} from "./assessments.dto.js";

export function findAssessmentByLessonId(lessonId: string) {
  return prisma.assessment.findUnique({
    where: { lessonId },
    select: {
      id: true,
      lessonId: true,
      title: true,
      instructions: true,
      isGraded: true,
      createdAt: true,
      updatedAt: true,
      questions: {
        select: {
          id: true,
          title: true,
          answerOptions: true,
          correctAnswers: true,
          grade: true,
          order: true,
        },
        orderBy: { order: "asc" as const },
      },
    },
  });
}

export function findAssessmentById(id: string) {
  return prisma.assessment.findUnique({
    where: { id },
    select: { id: true, lessonId: true, isGraded: true },
  });
}

export function createAssessment(lessonId: string, data: CreateAssessmentInput) {
  return prisma.assessment.create({
    data: {
      lessonId,
      title: data.title ?? null,
      instructions: data.instructions ?? null,
      isGraded: data.isGraded,
    },
    select: {
      id: true,
      lessonId: true,
      title: true,
      instructions: true,
      isGraded: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function updateAssessment(id: string, data: UpdateAssessmentInput) {
  return prisma.assessment.update({
    where: { id },
    data,
    select: {
      id: true,
      lessonId: true,
      title: true,
      instructions: true,
      isGraded: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function deleteAssessment(id: string) {
  return prisma.assessment.delete({ where: { id } });
}

export function countQuestionsByAssessment(assessmentId: string) {
  return prisma.question.count({ where: { assessmentId } });
}

export function createQuestion(assessmentId: string, data: CreateQuestionInput, order: number) {
  return prisma.question.create({
    data: { assessmentId, ...data, order },
    select: {
      id: true,
      title: true,
      answerOptions: true,
      correctAnswers: true,
      grade: true,
      order: true,
    },
  });
}

export function updateQuestion(id: string, data: UpdateQuestionInput) {
  return prisma.question.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      answerOptions: true,
      correctAnswers: true,
      grade: true,
      order: true,
    },
  });
}

export function deleteQuestion(id: string) {
  return prisma.question.delete({ where: { id } });
}

export function findQuestionsByAssessment(assessmentId: string) {
  return prisma.question.findMany({
    where: { assessmentId },
    select: {
      id: true,
      title: true,
      answerOptions: true,
      correctAnswers: true,
      grade: true,
      order: true,
    },
    orderBy: { order: "asc" as const },
  });
}

export function findQuestionsByAssessmentForStudent(assessmentId: string) {
  return prisma.question.findMany({
    where: { assessmentId },
    select: {
      id: true,
      title: true,
      answerOptions: true,
      grade: true,
      order: true,
      correctAnswers: true,
    },
    orderBy: { order: "asc" as const },
  });
}

export function findQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    select: {
      id: true,
      assessmentId: true,
      correctAnswers: true,
      answerOptions: true,
      grade: true,
    },
  });
}

export function findUserSubmissionsForAssessment(userId: string, assessmentId: string) {
  return prisma.submission.findMany({
    where: { userId, question: { assessmentId } },
    select: { questionId: true, isCorrect: true, providedAnswers: true, correctAnswers: true },
  });
}

export function createSubmission(
  userId: string,
  questionId: string,
  providedAnswers: string[],
  correctAnswers: string[],
  isCorrect: boolean,
) {
  return prisma.submission.create({
    data: { userId, questionId, providedAnswers, correctAnswers, isCorrect },
    select: {
      id: true,
      questionId: true,
      isCorrect: true,
      providedAnswers: true,
      correctAnswers: true,
    },
  });
}

export function findLessonOwner(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { course: { select: { createdBy: true } } } } },
  });
}

export function countSubmissionsForAssessment(userId: string, assessmentId: string) {
  return prisma.submission.count({
    where: { userId, question: { assessmentId } },
  });
}

export function findCourseIdByLessonId(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { module: { select: { courseId: true } } },
  });
}

export function findEnrollmentForLesson(userId: string, lessonId: string) {
  return prisma.enrollment.findFirst({
    where: { userId, course: { modules: { some: { lessons: { some: { id: lessonId } } } } } },
    select: { id: true },
  });
}
