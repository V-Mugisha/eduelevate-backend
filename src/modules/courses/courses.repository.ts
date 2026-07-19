import { prisma } from "@/lib/prisma";
import type { CreateCourseInput, UpdateCourseInput, CourseQuery } from "./courses.dto.js";

const defaultSelect = {
  id: true,
  title: true,
  subtitle: true,
  description: true,
  level: true,
  duration: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
  creator: { select: { id: true, firstName: true, lastName: true } },
};

export function findCourses(query: CourseQuery) {
  const where: Record<string, unknown> = { isPublished: true };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.level) where.level = query.level;

  return prisma.course.findMany({
    where,
    select: defaultSelect,
    orderBy: { createdAt: "desc" },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });
}

export function countCourses(query: CourseQuery) {
  const where: Record<string, unknown> = { isPublished: true };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.level) where.level = query.level;
  return prisma.course.count({ where });
}

export function findCourseById(id: string) {
  return prisma.course.findUnique({ where: { id }, select: defaultSelect });
}

export function findMyCourses(creatorId: string) {
  return prisma.course.findMany({
    where: { createdBy: creatorId },
    select: defaultSelect,
    orderBy: { createdAt: "desc" },
  });
}

export function createCourse(data: CreateCourseInput, creatorId: string) {
  return prisma.course.create({
    data: { ...data, createdBy: creatorId, isPublished: true },
    select: defaultSelect,
  });
}

export function updateCourse(id: string, data: UpdateCourseInput) {
  return prisma.course.update({ where: { id }, data, select: defaultSelect });
}

export function deleteCourse(id: string) {
  return prisma.course.delete({ where: { id } });
}
