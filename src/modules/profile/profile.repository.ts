import { prisma } from "@/lib/prisma";

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      role: {
        select: { id: true, name: true },
      },
      studentProfile: {
        select: {
          id: true,
          schoolName: true,
          grade: true,
        },
      },
      educatorProfile: {
        select: {
          id: true,
          isIndependent: true,
          organizationName: true,
          expertiseAreas: true,
          yearsOfExperience: true,
          bio: true,
        },
      },
    },
  });
}

export function updateUser(userId: string, data: { firstName?: string; lastName?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: { select: { id: true, name: true } },
    },
  });
}

export function updateStudentProfile(
  userId: string,
  data: { schoolName?: string; grade?: "S4" | "S5" | "S6" },
) {
  return prisma.studentProfile.update({
    where: { userId },
    data,
  });
}

export function updateEducatorProfile(
  userId: string,
  data: {
    isIndependent?: boolean;
    organizationName?: string | null;
    expertiseAreas?: string[];
    yearsOfExperience?: number | null;
    bio?: string;
  },
) {
  return prisma.educatorProfile.update({
    where: { userId },
    data,
  });
}
