import type { CreateSectionInput, UpdateSectionInput } from "./sections.dto.js";
import * as sectionsRepository from "./sections.repository.js";

export async function create(data: CreateSectionInput, lessonId: string, userId: string) {
  const lesson = await sectionsRepository.findModuleByLessonId(lessonId);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  if (lesson.module.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const count = await sectionsRepository.countSections(lessonId);
  return sectionsRepository.createSection(lessonId, data, count);
}

export async function update(id: string, data: UpdateSectionInput, userId: string) {
  const lesson = await sectionsRepository.findModuleByLessonId(id);
  if (!lesson) throw new ServiceError("Section not found", 404);
  if (lesson.module.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  return sectionsRepository.updateSection(id, data);
}

export async function remove(id: string, userId: string) {
  const lesson = await sectionsRepository.findModuleByLessonId(id);
  if (!lesson) throw new ServiceError("Section not found", 404);
  if (lesson.module.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  return sectionsRepository.deleteSection(id);
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
