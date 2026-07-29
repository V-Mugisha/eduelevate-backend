import type { CreateLessonInput, UpdateLessonInput } from "./lessons.dto.js";
import * as lessonsRepository from "./lessons.repository.js";
import { createAuditLog } from "@/lib/auditLog";

export async function listLessons(moduleId: string) {
  return lessonsRepository.findLessonsByModuleId(moduleId);
}

export async function getLesson(id: string) {
  const lesson = await lessonsRepository.findLessonById(id);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  return lesson;
}

export async function create(data: CreateLessonInput, moduleId: string, userId: string) {
  const mod = await lessonsRepository.findModuleById(moduleId);
  if (!mod) throw new ServiceError("Module not found", 404);
  if (mod.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const lesson = await lessonsRepository.createLesson(moduleId, data);

  createAuditLog({
    action: "lesson:create",
    entityType: "lesson",
    entityId: lesson.id,
    performedBy: userId,
    details: { title: lesson.title, moduleId },
    status: "success",
  }).catch(() => {});

  return lesson;
}

export async function update(id: string, data: UpdateLessonInput, userId: string) {
  const lesson = await lessonsRepository.findLessonById(id);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  const mod = await lessonsRepository.findModuleById(lesson.moduleId);
  if (mod?.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const updated = await lessonsRepository.updateLesson(id, data);

  createAuditLog({
    action: "lesson:update",
    entityType: "lesson",
    entityId: id,
    performedBy: userId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return updated;
}

export async function remove(id: string, userId: string) {
  const lesson = await lessonsRepository.findLessonById(id);
  if (!lesson) throw new ServiceError("Lesson not found", 404);
  const mod = await lessonsRepository.findModuleById(lesson.moduleId);
  if (mod?.course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const deleted = await lessonsRepository.deleteLesson(id);

  createAuditLog({
    action: "lesson:delete",
    entityType: "lesson",
    entityId: id,
    performedBy: userId,
    details: { title: lesson.title, moduleId: lesson.moduleId },
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
