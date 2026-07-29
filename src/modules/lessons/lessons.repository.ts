import { prisma } from "@/lib/prisma";
import type { CreateLessonInput, UpdateLessonInput } from "./lessons.dto.js";

const defaultSelect = {
  id: true,
  moduleId: true,
  title: true,
  subtitle: true,
  content: true,
  createdAt: true,
  updatedAt: true,
};

export function findLessonsByModuleId(moduleId: string) {
  return prisma.lesson.findMany({
    where: { moduleId },
    select: defaultSelect,
    orderBy: { createdAt: "asc" },
  });
}

export function findLessonById(id: string) {
  return prisma.lesson.findUnique({ where: { id }, select: defaultSelect });
}

export function createLesson(moduleId: string, data: CreateLessonInput) {
  return prisma.lesson.create({
    data: {
      moduleId,
      title: data.title,
      subtitle: data.subtitle ?? null,
      content: data.content ?? null,
    },
    select: defaultSelect,
  });
}

export function updateLesson(id: string, data: UpdateLessonInput) {
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
  if (data.content !== undefined) updateData.content = data.content;
  return prisma.lesson.update({ where: { id }, data: updateData, select: defaultSelect });
}

export function deleteLesson(id: string) {
  return prisma.lesson.delete({ where: { id } });
}

export function findModuleById(moduleId: string) {
  return prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { createdBy: true } } },
  });
}
