import bcrypt from "bcrypt";
import type { CreateUserInput, UpdateUserInput, UserQuery } from "./users.dto.js";
import * as usersRepository from "./users.repository.js";
import { createAuditLog } from "@/lib/auditLog";

const SALT_ROUNDS = 12;

function requireAdmin(userRole: string | undefined) {
  if (userRole !== "admin") throw new ServiceError("Only administrators can manage users", 403);
}

export async function listUsers(query: UserQuery, userRole?: string) {
  requireAdmin(userRole);
  return usersRepository.findUsers(query);
}

export async function getUser(id: string, userRole?: string) {
  requireAdmin(userRole);
  const user = await usersRepository.findUserById(id);
  if (!user) throw new ServiceError("User not found", 404);
  return user;
}

export async function createUser(data: CreateUserInput, adminId: string, userRole?: string) {
  requireAdmin(userRole);

  const existing = await usersRepository.findUserByEmail(data.email);
  if (existing) throw new ServiceError("A user with this email already exists", 409);

  const role = await usersRepository.findRoleByName(data.role);
  if (!role) throw new ServiceError(`Role "${data.role}" not found`, 400);

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await usersRepository.createUserWithProfile(
    {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: role.id,
    },
    data.role === "student"
      ? { schoolName: data.schoolName, grade: data.grade }
      : data.role === "educator"
        ? {
            isIndependent: data.isIndependent,
            organizationName: data.organizationName ?? null,
            expertiseAreas: data.expertiseAreas,
            yearsOfExperience: data.yearsOfExperience ?? null,
            bio: data.bio ?? "",
          }
        : undefined,
  );

  createAuditLog({
    action: "user:create",
    entityType: "user",
    entityId: user.id,
    performedBy: adminId,
    details: { email: user.email, role: user.role.name },
    status: "success",
  }).catch(() => {});

  return user;
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
  adminId: string,
  adminRole?: string,
) {
  requireAdmin(adminRole);

  const user = await usersRepository.findUserById(id);
  if (!user) throw new ServiceError("User not found", 404);

  if (id === adminId && data.roleId !== undefined && data.roleId !== user.role.id) {
    throw new ServiceError("You cannot change your own role", 403);
  }

  if (id === adminId && data.isActive === false) {
    throw new ServiceError("You cannot deactivate your own account", 403);
  }

  if (data.email && data.email !== user.email) {
    const existing = await usersRepository.findUserByEmail(data.email);
    if (existing) throw new ServiceError("A user with this email already exists", 409);
  }

  const updated = await usersRepository.updateUser(id, data);

  if (updated.studentProfile && (data.schoolName !== undefined || data.grade !== undefined)) {
    await usersRepository.updateStudentProfileData(id, {
      schoolName: data.schoolName,
      grade: data.grade,
    });
  }

  if (
    updated.educatorProfile &&
    (data.isIndependent !== undefined ||
      data.expertiseAreas !== undefined ||
      data.bio !== undefined)
  ) {
    await usersRepository.updateEducatorProfileData(id, {
      isIndependent: data.isIndependent,
      organizationName: data.organizationName,
      expertiseAreas: data.expertiseAreas,
      yearsOfExperience: data.yearsOfExperience,
      bio: data.bio,
    });
  }

  createAuditLog({
    action: "user:update",
    entityType: "user",
    entityId: id,
    performedBy: adminId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return usersRepository.findUserById(id);
}

export async function deleteUser(id: string, adminId: string, adminRole?: string) {
  requireAdmin(adminRole);

  const user = await usersRepository.findUserById(id);
  if (!user) throw new ServiceError("User not found", 404);

  if (id === adminId) throw new ServiceError("You cannot delete your own account", 403);

  await usersRepository.deleteUser(id);

  createAuditLog({
    action: "user:delete",
    entityType: "user",
    entityId: id,
    performedBy: adminId,
    details: { email: user.email, role: user.role.name },
    status: "success",
  }).catch(() => {});

  return { message: "User deleted successfully" };
}

export async function toggleStatus(id: string, adminId: string, adminRole?: string) {
  requireAdmin(adminRole);

  const user = await usersRepository.findUserById(id);
  if (!user) throw new ServiceError("User not found", 404);

  if (id === adminId) throw new ServiceError("You cannot change your own account status", 403);

  const updated = await usersRepository.toggleUserStatus(id, !user.isActive);

  createAuditLog({
    action: updated.isActive ? "user:enable" : "user:disable",
    entityType: "user",
    entityId: id,
    performedBy: adminId,
    details: { email: updated.email },
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
