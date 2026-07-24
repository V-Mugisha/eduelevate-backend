import { prisma } from "@/lib/prisma";

export function findEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { id: true, createdAt: true, completedLessons: { select: { lessonId: true } } },
  });
}

export function findEnrollmentsByUser(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          subtitle: true,
          level: true,
          duration: true,
          category: { select: { id: true, name: true } },
          creator: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      completedLessons: { select: { lessonId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: { userId, courseId },
    select: { id: true, createdAt: true, completedLessons: { select: { lessonId: true } } },
  });
}

export function completeLesson(enrollmentId: string, lessonId: string) {
  return prisma.lessonCompletion.upsert({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    create: { enrollmentId, lessonId },
    update: {},
  });
}

export function findCourseLessons(courseId: string) {
  return prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true },
  });
}
