import * as certificatesRepository from "./certificates.repository.js";
import * as enrollmentsRepository from "@/modules/enrollments/enrollments.repository.js";

export async function generateCertificate(userId: string, courseId: string) {
  const enrollment = await enrollmentsRepository.findEnrollment(userId, courseId);
  if (!enrollment) throw new ServiceError("Not enrolled in this course", 403);

  const liveLessons = await enrollmentsRepository.findCourseLessons(courseId);
  const liveLessonIds = new Set(liveLessons.map((l) => l.id));
  const validCompletions = enrollment.completedLessons.filter((cl) =>
    liveLessonIds.has(cl.lessonId),
  );

  const totalLessons = liveLessons.length;
  if (totalLessons === 0)
    throw new ServiceError("This course has no lessons yet", 400);
  if (validCompletions.length < totalLessons)
    throw new ServiceError("You must complete all lessons before generating a certificate", 400);

  const existing = await certificatesRepository.findCertificateByUserAndCourse(userId, courseId);
  if (existing) throw new ServiceError("Certificate already generated for this course", 409);

  return certificatesRepository.createCertificate(userId, courseId);
}

export async function getCertificate(id: string, userId: string, userRole?: string) {
  const certificate = await certificatesRepository.findCertificateById(id);
  if (!certificate) throw new ServiceError("Certificate not found", 404);

  if (certificate.user.id === userId || userRole === "admin") return certificate;

  if (userRole === "educator" && certificate.course.creator.id === userId) return certificate;

  throw new ServiceError("Not authorized", 403);
}

export async function findByUserAndCourse(userId: string, courseId: string) {
  return certificatesRepository.findCertificateByUserAndCourse(userId, courseId);
}

export async function listCertificates(userId: string) {
  return certificatesRepository.findCertificatesByUser(userId);
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
