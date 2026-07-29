import type { CreateSectionInput, UpdateSectionInput } from "./sections.dto.js";
import * as sectionsRepository from "./sections.repository.js";
import { createAuditLog } from "@/lib/auditLog";

export async function create(data: CreateSectionInput, lessonId: string, userId: string) {
  const lesson = await sectionsRepository.findModuleByLessonId(lessonId);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  if (lesson.module.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const count = await sectionsRepository.countSections(lessonId);
  const section = await sectionsRepository.createSection(lessonId, data, count);

  createAuditLog({
    action: "section:create",
    entityType: "section",
    entityId: section.id,
    performedBy: userId,
    details: { lessonId },
    status: "success",
  }).catch(() => {});

  return section;
}

export async function update(id: string, data: UpdateSectionInput, userId: string) {
  const section = await sectionsRepository.findSectionById(id);
  if (!section) throw new ServiceError("Section not found", 404);
  if (section.lesson.module.course.createdBy !== userId)
    throw new ServiceError("Not authorized", 403);
  const updated = await sectionsRepository.updateSection(id, data);

  createAuditLog({
    action: "section:update",
    entityType: "section",
    entityId: id,
    performedBy: userId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return updated;
}

export async function remove(id: string, userId: string) {
  const section = await sectionsRepository.findSectionById(id);
  if (!section) throw new ServiceError("Section not found", 404);
  if (section.lesson.module.course.createdBy !== userId)
    throw new ServiceError("Not authorized", 403);
  const deleted = await sectionsRepository.deleteSection(id);

  createAuditLog({
    action: "section:delete",
    entityType: "section",
    entityId: id,
    performedBy: userId,
    details: { lessonId: section.lessonId },
    status: "success",
  }).catch(() => {});

  return deleted;
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
