import type { CreateModuleInput, UpdateModuleInput } from "./modules.dto.js";
import * as modulesRepository from "./modules.repository.js";

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
  return modulesRepository.createModule(courseId, data);
}

export async function update(id: string, data: UpdateModuleInput, userId: string) {
  const mod = await modulesRepository.findModuleById(id);
  if (!mod) throw new ServiceError("Module not found", 404);
  const course = await modulesRepository.findCourseById(mod.courseId);
  if (course?.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  return modulesRepository.updateModule(id, data);
}

export async function remove(id: string, userId: string) {
  const mod = await modulesRepository.findModuleById(id);
  if (!mod) throw new ServiceError("Module not found", 404);
  const course = await modulesRepository.findCourseById(mod.courseId);
  if (course?.createdBy !== userId) throw new ServiceError("Not authorized", 403);
  return modulesRepository.deleteModule(id);
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
