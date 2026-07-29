import type { CreateModuleInput, UpdateModuleInput } from "./modules.dto.js";
import * as modulesRepository from "./modules.repository.js";
import { createAuditLog } from "@/lib/auditLog";

export async function listModules(courseId: string) {
  return modulesRepository.findModulesByCourseId(courseId);
}

export async function getModule(id: string) {
  const mod = await modulesRepository.findModuleById(id);
  if (!mod) throw new ServiceError("Module not found", 404);
  return mod;
}

export async function create(data: CreateModuleInput, courseId: string, userId: string) {
  const course = await modulesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (course.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const mod = await modulesRepository.createModule(courseId, data);

  createAuditLog({
    action: "module:create",
    entityType: "module",
    entityId: mod.id,
    performedBy: userId,
    details: { title: mod.title, courseId },
    status: "success",
  }).catch(() => {});

  return mod;
}

export async function update(id: string, data: UpdateModuleInput, userId: string) {
  const mod = await modulesRepository.findModuleById(id);
  if (!mod) throw new ServiceError("Module not found", 404);
  const course = await modulesRepository.findCourseById(mod.courseId);
  if (course?.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const updated = await modulesRepository.updateModule(id, data);

  createAuditLog({
    action: "module:update",
    entityType: "module",
    entityId: id,
    performedBy: userId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return updated;
}

export async function remove(id: string, userId: string) {
  const mod = await modulesRepository.findModuleById(id);
  if (!mod) throw new ServiceError("Module not found", 404);
  const course = await modulesRepository.findCourseById(mod.courseId);
  if (course?.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  const deleted = await modulesRepository.deleteModule(id);

  createAuditLog({
    action: "module:delete",
    entityType: "module",
    entityId: id,
    performedBy: userId,
    details: { title: mod.title, courseId: mod.courseId },
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
