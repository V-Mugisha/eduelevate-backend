import * as enrollmentsRepository from "./enrollments.repository.js";
import * as coursesRepository from "@/modules/courses/courses.repository.js";
import { prisma } from "@/lib/prisma";

export async function enroll(userId: string, courseId: string) {
  const course = await coursesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (!course.isPublished) throw new ServiceError("This course is not yet available", 400);
  if (course.creator.id === userId)
    throw new ServiceError("You cannot enroll in your own course", 400);

  if (course.maxStudents !== null) {
    const enrolledCount = await coursesRepository.countEnrollments(courseId);
    if (enrolledCount >= course.maxStudents)
      throw new ServiceError("This course has reached its maximum number of students", 409);
  }

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

export async function listCourseStudents(userId: string, courseId: string, userRole?: string) {
  const course = await coursesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (userRole !== "admin" && course.creator.id !== userId)
    throw new ServiceError("Not authorized", 403);

  const enrollments = await enrollmentsRepository.findEnrollmentsByCourse(courseId);
  const liveLessons = await enrollmentsRepository.findCourseLessons(courseId);
  const liveLessonIds = new Set(liveLessons.map((l) => l.id));
  const totalLessons = liveLessons.length;

  return enrollments.map((e) => {
    const validCompletions = e.completedLessons.filter((cl) => liveLessonIds.has(cl.lessonId));
    const progress =
      totalLessons > 0 ? Math.round((validCompletions.length / totalLessons) * 100) : 0;
    return {
      id: e.id,
      enrolledAt: e.createdAt,
      completedCount: validCompletions.length,
      totalLessons,
      progress,
      user: {
        id: e.user.id,
        firstName: e.user.firstName,
        lastName: e.user.lastName,
        email: e.user.email,
        schoolName: e.user.studentProfile?.schoolName ?? null,
        grade: e.user.studentProfile?.grade ?? null,
      },
    };
  });
}

export async function getStudentDetail(
  educatorUserId: string,
  courseId: string,
  studentUserId: string,
  userRole?: string,
) {
  const course = await coursesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (userRole !== "admin" && course.creator.id !== educatorUserId)
    throw new ServiceError("Not authorized", 403);

  const enrollment = await enrollmentsRepository.findEnrollmentWithStudent(studentUserId, courseId);
  if (!enrollment) throw new ServiceError("Student not enrolled in this course", 404);

  const [liveLessons, modules] = await Promise.all([
    enrollmentsRepository.findCourseLessons(courseId),
    enrollmentsRepository.findModulesWithLessonTitles(courseId),
  ]);

  const liveLessonIds = new Set(liveLessons.map((l) => l.id));
  const validCompletions = enrollment.completedLessons.filter((cl) =>
    liveLessonIds.has(cl.lessonId),
  );
  const completedLessonIds = validCompletions.map((cl) => cl.lessonId);
  const totalLessons = liveLessons.length;
  const progress =
    totalLessons > 0 ? Math.round((validCompletions.length / totalLessons) * 100) : 0;

  return {
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.createdAt,
    progress,
    completedCount: validCompletions.length,
    totalLessons,
    completedLessonIds,
    user: {
      id: enrollment.user.id,
      firstName: enrollment.user.firstName,
      lastName: enrollment.user.lastName,
      email: enrollment.user.email,
      schoolName: enrollment.user.studentProfile?.schoolName ?? null,
      grade: enrollment.user.studentProfile?.grade ?? null,
    },
    course: {
      id: course.id,
      title: course.title,
    },
    modules,
  };
}

export async function completeLesson(userId: string, lessonId: string) {
  const mod = await prisma.module.findFirst({
    where: { lessons: { some: { id: lessonId } } },
    select: { courseId: true },
  });
  if (!mod) throw new ServiceError("Course not found for this lesson", 404);

  const enrollment = await enrollmentsRepository.findEnrollment(userId, mod.courseId);
  if (!enrollment) throw new ServiceError("Not enrolled in this course", 403);

  const assessment = await prisma.assessment.findUnique({
    where: { lessonId },
    select: { id: true, isGraded: true, _count: { select: { questions: true } } },
  });

  if (assessment && assessment.isGraded) {
    const submissionCount = await prisma.submission.count({
      where: { userId, question: { assessmentId: assessment.id } },
    });
    if (submissionCount < assessment._count.questions)
      throw new ServiceError("Complete the assessment before marking this lesson as complete", 400);
  }

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
