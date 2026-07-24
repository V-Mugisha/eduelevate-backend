import { prisma } from "@/lib/prisma";
import type { CreateModuleInput, UpdateModuleInput } from "./modules.dto.js";

const defaultSelect = {
  id: true,
  courseId: true,
  title: true,
  subtitle: true,
  description: true,
  prerequisites: true,
  createdAt: true,
  updatedAt: true,
  lessons: {
    select: {
      id: true,
      title: true,
      subtitle: true,
      createdAt: true,
      updatedAt: true,
      sections: {
        select: { id: true, title: true, content: true, order: true },
        orderBy: { order: "asc" as const },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

export function findModulesByCourseId(courseId: string) {
  return prisma.module.findMany({
    where: { courseId },
    select: defaultSelect,
    orderBy: { createdAt: "asc" },
  });
}

export function findModuleById(id: string) {
  return prisma.module.findUnique({ where: { id }, select: defaultSelect });
}

export function createModule(courseId: string, data: CreateModuleInput) {
  return prisma.module.create({
    data: { ...data, courseId, prerequisites: data.prerequisites ?? [] },
    select: defaultSelect,
  });
}

export function updateModule(id: string, data: UpdateModuleInput) {
  return prisma.module.update({ where: { id }, data, select: defaultSelect });
}

export function deleteModule(id: string) {
  return prisma.module.delete({ where: { id } });
}

export function findCourseById(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, createdBy: true },
  });
}
