import { prisma } from "@/lib/prisma";
import type { UpdateUserInput, UserQuery } from "./users.dto.js";

export function findRoleById(roleId: string) {
  return prisma.role.findUnique({ where: { id: roleId } });
}

export function findRoleByName(name: string) {
  return prisma.role.findUnique({ where: { name } });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: { select: { id: true, name: true } },
      studentProfile: {
        select: { id: true, schoolName: true, grade: true },
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

export async function findUsers(query: UserQuery) {
  const where: Record<string, unknown> = {};
  if (query.q) {
    where.OR = [
      { firstName: { contains: query.q, mode: "insensitive" } },
      { lastName: { contains: query.q, mode: "insensitive" } },
      { email: { contains: query.q, mode: "insensitive" } },
    ];
  }
  if (query.role) {
    where.role = { name: query.role };
  }
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
        studentProfile: { select: { schoolName: true, grade: true } },
        educatorProfile: { select: { organizationName: true, expertiseAreas: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export function createUserWithProfile(
  userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleId: string;
  },
  profileData?: {
    schoolName?: string;
    grade?: "S4" | "S5" | "S6";
    isIndependent?: boolean;
    organizationName?: string | null;
    expertiseAreas?: string[];
    yearsOfExperience?: number | null;
    bio?: string;
  },
) {
  return prisma.user.create({
    data: {
      email: userData.email,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roleId: userData.roleId,
      ...(profileData?.schoolName !== undefined || profileData?.grade !== undefined
        ? {
            studentProfile: {
              create: { schoolName: profileData.schoolName!, grade: profileData.grade! },
            },
          }
        : {}),
      ...(profileData?.isIndependent !== undefined
        ? {
            educatorProfile: {
              create: {
                isIndependent: profileData.isIndependent!,
                organizationName: profileData.organizationName ?? null,
                expertiseAreas: profileData.expertiseAreas ?? [],
                yearsOfExperience: profileData.yearsOfExperience ?? null,
                bio: profileData.bio ?? "",
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
      studentProfile: { select: { id: true, schoolName: true, grade: true } },
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

export function updateUser(userId: string, data: UpdateUserInput) {
  const userUpdate: Record<string, unknown> = {};
  if (data.email !== undefined) userUpdate.email = data.email;
  if (data.firstName !== undefined) userUpdate.firstName = data.firstName;
  if (data.lastName !== undefined) userUpdate.lastName = data.lastName;
  if (data.roleId !== undefined) userUpdate.roleId = data.roleId;
  if (data.isActive !== undefined) userUpdate.isActive = data.isActive;

  return prisma.user.update({
    where: { id: userId },
    data: userUpdate,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: { select: { id: true, name: true } },
      studentProfile: { select: { id: true, schoolName: true, grade: true } },
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

export function updateStudentProfileData(
  userId: string,
  data: { schoolName?: string; grade?: "S4" | "S5" | "S6" },
) {
  return prisma.studentProfile.update({
    where: { userId },
    data,
  });
}

export function updateEducatorProfileData(
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

export function deleteUser(userId: string) {
  return prisma.user.delete({ where: { id: userId } });
}

export function toggleUserStatus(userId: string, isActive: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      role: { select: { id: true, name: true } },
    },
  });
}
