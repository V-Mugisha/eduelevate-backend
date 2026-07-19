import { prisma } from "@/lib/prisma";
import type { GradeLevel } from "../../../prisma/generated/client.js";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roleId: string;
}

export interface CreateStudentProfileInput {
  schoolName: string;
  grade: GradeLevel;
}

export interface CreateEducatorProfileInput {
  isIndependent: boolean;
  organizationName: string | null;
  expertiseAreas: string[];
  yearsOfExperience: number | null;
  bio: string;
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      firstName: true,
      lastName: true,
      isActive: true,
      role: {
        select: { id: true, name: true },
      },
    },
  });
}

export function findUserByIdForAuth(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      passwordHash: true,
      isActive: true,
    },
  });
}

export function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export function findRoleByName(name: string) {
  return prisma.role.findUnique({ where: { name } });
}

export function createUserWithStudentProfile(
  userData: CreateUserInput,
  profileData: CreateStudentProfileInput,
) {
  return prisma.user.create({
    data: {
      ...userData,
      studentProfile: {
        create: profileData,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: {
        select: { id: true, name: true },
      },
    },
  });
}

export function createUserWithEducatorProfile(
  userData: CreateUserInput,
  profileData: CreateEducatorProfileInput,
) {
  return prisma.user.create({
    data: {
      ...userData,
      educatorProfile: {
        create: profileData,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: {
        select: { id: true, name: true },
      },
    },
  });
}
