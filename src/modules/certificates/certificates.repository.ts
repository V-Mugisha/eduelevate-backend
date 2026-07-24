import { prisma } from "@/lib/prisma";

const defaultSelect = {
  id: true,
  issuedAt: true,
  user: { select: { id: true, firstName: true, lastName: true } },
  course: {
    select: {
      id: true,
      title: true,
      description: true,
      creator: { select: { id: true, firstName: true, lastName: true } },
    },
  },
};

export function createCertificate(userId: string, courseId: string) {
  return prisma.certificate.create({
    data: { userId, courseId },
    select: defaultSelect,
  });
}

export function findCertificateById(id: string) {
  return prisma.certificate.findUnique({ where: { id }, select: defaultSelect });
}

export function findCertificateByUserAndCourse(userId: string, courseId: string) {
  return prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: defaultSelect,
  });
}

export function findCertificatesByUser(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    select: defaultSelect,
    orderBy: { issuedAt: "desc" },
  });
}

export function findCertificatesByCourse(courseId: string) {
  return prisma.certificate.findMany({
    where: { courseId },
    select: defaultSelect,
    orderBy: { issuedAt: "desc" },
  });
}
