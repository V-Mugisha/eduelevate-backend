import type { CreateCourseInput, UpdateCourseInput, CourseQuery } from "./courses.dto.js";
import * as coursesRepository from "./courses.repository.js";
import { createAuditLog } from "@/lib/auditLog";

function authorize(userId: string, userRole: string | undefined, courseCreatorId: string): boolean {
  return userRole === "admin" || courseCreatorId === userId;
}

export async function listCourses(query: CourseQuery) {
  const [courses, total] = await Promise.all([
    coursesRepository.findCourses(query),
    coursesRepository.countCourses(query),
  ]);
  return { courses, total, page: query.page, limit: query.limit };
}

export async function getCourse(id: string) {
  const course = await coursesRepository.findCourseById(id);
  if (!course) throw new ServiceError("Course not found", 404);
  return course;
}

export async function listMyCourses(creatorId: string) {
  return coursesRepository.findMyCourses(creatorId);
}

export async function create(data: CreateCourseInput, creatorId: string, userRole?: string) {
  if (userRole !== "admin" && userRole !== "educator")
    throw new ServiceError("Only educators and admins can create courses", 403);
  const course = await coursesRepository.createCourse(data, creatorId);

  createAuditLog({
    action: "course:create",
    entityType: "course",
    entityId: course.id,
    performedBy: creatorId,
    details: { title: course.title, categoryId: data.categoryId, level: data.level },
    status: "success",
  }).catch(() => {});

  return course;
}

export async function update(
  id: string,
  data: UpdateCourseInput,
  userId: string,
  userRole?: string,
) {
  const course = await coursesRepository.findCourseById(id);
  if (!course) throw new ServiceError("Course not found", 404);
  if (!authorize(userId, userRole, course.creator.id))
    throw new ServiceError("Not authorized", 403);
  const updated = await coursesRepository.updateCourse(id, data);

  createAuditLog({
    action: "course:update",
    entityType: "course",
    entityId: id,
    performedBy: userId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return updated;
}

export async function remove(id: string, userId: string, userRole?: string) {
  const course = await coursesRepository.findCourseById(id);
  if (!course) throw new ServiceError("Course not found", 404);
  if (!authorize(userId, userRole, course.creator.id))
    throw new ServiceError("Not authorized", 403);
  const deleted = await coursesRepository.deleteCourse(id);

  createAuditLog({
    action: "course:delete",
    entityType: "course",
    entityId: id,
    performedBy: userId,
    details: { title: course.title },
    status: "success",
  }).catch(() => {});

  return deleted;
}

export async function setPublishStatus(
  userId: string,
  courseId: string,
  publish: boolean,
  userRole?: string,
) {
  const course = await coursesRepository.findCourseById(courseId);
  if (!course) throw new ServiceError("Course not found", 404);
  if (!authorize(userId, userRole, course.creator.id))
    throw new ServiceError("Not authorized", 403);
  const updated = await coursesRepository.setPublishStatus(courseId, publish);

  createAuditLog({
    action: publish ? "course:publish" : "course:unpublish",
    entityType: "course",
    entityId: courseId,
    performedBy: userId,
    details: { title: course.title },
    status: "success",
  }).catch(() => {});

  return updated;
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
