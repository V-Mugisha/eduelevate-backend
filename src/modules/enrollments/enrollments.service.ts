import * as enrollmentsRepository from "./enrollments.repository.js";
import * as coursesRepository from "@/modules/courses/courses.repository.js";
import { prisma } from "@/lib/prisma";

export async function enroll(userId: string, courseId: string) {
  const course = await coursesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (course.creator.id === userId)
    throw new ServiceError("You cannot enroll in your own course", 400);

  const existing = await enrollmentsRepository.findEnrollment(userId, courseId);
  if (existing) throw new ServiceError("Already enrolled in this course", 409);

  return enrollmentsRepository.createEnrollment(userId, courseId);
}

export async function getEnrollment(userId: string, courseId: string) {
  const enrollment = await enrollmentsRepository.findEnrollment(userId, courseId);
  if (!enrollment) return null;

  const liveLessons = await enrollmentsRepository.findCourseLessons(courseId);
  const liveLessonIds = new Set(liveLessons.map((l) => l.id));
  const validCompletions = enrollment.completedLessons.filter((cl) =>
    liveLessonIds.has(cl.lessonId),
  );

  const totalLessons = liveLessons.length;
  const progress =
    totalLessons > 0 ? Math.round((validCompletions.length / totalLessons) * 100) : 0;

  return { ...enrollment, completedLessons: validCompletions, totalLessons, progress };
}

export async function listMyEnrollments(userId: string) {
  const enrollments = await enrollmentsRepository.findEnrollmentsByUser(userId);
  const result = [];
  for (const e of enrollments) {
    const liveLessons = await enrollmentsRepository.findCourseLessons(e.course.id);
    const liveLessonIds = new Set(liveLessons.map((l) => l.id));
    const validCompletions = e.completedLessons.filter((cl) => liveLessonIds.has(cl.lessonId));

    const totalLessons = liveLessons.length;
    const progress =
      totalLessons > 0 ? Math.round((validCompletions.length / totalLessons) * 100) : 0;

    result.push({ ...e, completedLessons: validCompletions, totalLessons, progress });
  }
  return result;
}

export async function completeLesson(userId: string, lessonId: string) {
  const mod = await prisma.module.findFirst({
    where: { lessons: { some: { id: lessonId } } },
    select: { courseId: true },
  });
  if (!mod) throw new ServiceError("Course not found for this lesson", 404);

  const enrollment = await enrollmentsRepository.findEnrollment(userId, mod.courseId);
  if (!enrollment) throw new ServiceError("Not enrolled in this course", 403);

  await enrollmentsRepository.completeLesson(enrollment.id, lessonId);
  return { message: "Lesson marked as complete" };
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
