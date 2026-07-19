import type {
  UpdateProfileInput,
  UpdateStudentProfileInput,
  UpdateEducatorProfileInput,
} from "./profile.dto.js";
import * as profileRepository from "./profile.repository.js";

export async function getProfile(userId: string) {
  const user = await profileRepository.findUserById(userId);
  if (!user) {
    throw new ServiceError("User not found", 404);
  }

  if (!user.isActive) {
    throw new ServiceError("This account has been deactivated.", 403);
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role.name,
    studentProfile: user.studentProfile ?? null,
    educatorProfile: user.educatorProfile ?? null,
  };
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await profileRepository.updateUser(userId, data);
  return user;
}

export async function updateStudentProfileData(userId: string, data: UpdateStudentProfileInput) {
  const profile = await profileRepository.updateStudentProfile(userId, data);
  return profile;
}

export async function updateEducatorProfileData(userId: string, data: UpdateEducatorProfileInput) {
  const profile = await profileRepository.updateEducatorProfile(userId, data);
  return profile;
}

export class ServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
