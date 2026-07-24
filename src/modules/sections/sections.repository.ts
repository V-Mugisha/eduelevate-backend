import { prisma } from "@/lib/prisma";
import type { CreateSectionInput, UpdateSectionInput } from "./sections.dto.js";

const defaultSelect = { id: true, title: true, content: true, order: true };

export function createSection(lessonId: string, data: CreateSectionInput, order: number) {
  return prisma.section.create({
    data: { lessonId, title: data.title ?? null, content: data.content, order },
    select: defaultSelect,
  });
}

export function updateSection(id: string, data: UpdateSectionInput) {
  return prisma.section.update({ where: { id }, data, select: defaultSelect });
}

export function deleteSection(id: string) {
  return prisma.section.delete({ where: { id } });
}

export function findModuleByLessonId(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { course: { select: { createdBy: true } } } } },
  });
}

export function countSections(lessonId: string) {
  return prisma.section.count({ where: { lessonId } });
}
