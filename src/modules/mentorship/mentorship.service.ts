import type {
  CreateProfileInput,
  UpdateProfileInput,
  CreateApplicationInput,
  RejectApplicationInput,
  EndMentorshipInput,
} from "./mentorship.dto.js";
import * as mentorshipRepository from "./mentorship.repository.js";
import { createAuditLog } from "@/lib/auditLog";

export async function createProfile(userId: string, data: CreateProfileInput) {
  const existing = await mentorshipRepository.findProfileByUserId(userId);
  if (existing) throw new ServiceError("Mentorship profile already exists", 409);
  const profile = await mentorshipRepository.createProfile(userId, data);

  createAuditLog({
    action: "mentorship:profile_create",
    entityType: "mentorship_profile",
    entityId: profile.id,
    performedBy: userId,
    details: { topics: data.topics },
    status: "success",
  }).catch(() => {});

  return profile;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const profile = await mentorshipRepository.findProfileByUserId(userId);
  if (!profile) throw new ServiceError("Mentorship profile not found", 404);
  const updated = await mentorshipRepository.updateProfile(userId, data);

  createAuditLog({
    action: "mentorship:profile_update",
    entityType: "mentorship_profile",
    entityId: profile.id,
    performedBy: userId,
    details: { ...data },
    status: "success",
  }).catch(() => {});

  return updated;
}

export async function removeProfile(userId: string) {
  const profile = await mentorshipRepository.findProfileByUserId(userId);
  if (!profile) throw new ServiceError("Mentorship profile not found", 404);
  const deleted = await mentorshipRepository.deleteProfile(userId);

  createAuditLog({
    action: "mentorship:profile_remove",
    entityType: "mentorship_profile",
    entityId: deleted.id,
    performedBy: userId,
    status: "success",
  }).catch(() => {});

  return deleted;
}

export async function getProfile(userId: string) {
  const profile = await mentorshipRepository.findProfileByUserId(userId);
  if (!profile) throw new ServiceError("Mentorship profile not found", 404);
  return profile;
}

export async function searchEducators(query?: string) {
  const educators = await mentorshipRepository.searchEducators(query);
  const result = [];
  for (const e of educators) {
    const rating = await mentorshipRepository.findAverageRatingByEducator(e.id);
    result.push({
      ...e,
      rating: {
        average: rating._avg.rating ? Math.round(rating._avg.rating * 10) / 10 : null,
        count: rating._count.rating,
      },
    });
  }
  return result;
}

export async function getEducator(userId: string) {
  const educator = await mentorshipRepository.findEducatorById(userId);
  if (!educator) throw new ServiceError("Educator not found or not available for mentorship", 404);
  return educator;
}

export async function applyForMentorship(
  studentId: string,
  educatorId: string,
  data: CreateApplicationInput,
) {
  const educator = await mentorshipRepository.findEducatorById(educatorId);
  if (!educator) throw new ServiceError("Educator not available for mentorship", 404);

  const student = await mentorshipRepository.findEducatorById(studentId);
  if (student) throw new ServiceError("Educators cannot apply for mentorship as students", 400);

  const pending = await mentorshipRepository.findPendingApplication(studentId, educatorId);
  if (pending) throw new ServiceError("You already have a pending application", 409);

  const active = await mentorshipRepository.findActiveMentorship(studentId, educatorId);
  if (active && !active.endedAt)
    throw new ServiceError("You are already being mentored by this educator", 409);

  const application = await mentorshipRepository.createApplication(studentId, educatorId, data);

  createAuditLog({
    action: "mentorship:apply",
    entityType: "mentorship_application",
    entityId: application.id,
    performedBy: studentId,
    details: { educatorId, topic: data.topic },
    status: "success",
  }).catch(() => {});

  return application;
}

export async function listMyApplications(userId: string) {
  return mentorshipRepository.findApplicationsByStudent(userId);
}

export async function listReceivedApplications(educatorId: string) {
  return mentorshipRepository.findApplicationsByEducator(educatorId);
}

export async function acceptApplication(applicationId: string, educatorId: string) {
  const app = await mentorshipRepository.findApplicationById(applicationId);
  if (!app) throw new ServiceError("Application not found", 404);
  if (app.educatorId !== educatorId) throw new ServiceError("Not authorized", 403);
  if (app.status !== "pending") throw new ServiceError("Application is no longer pending", 400);

  const active = await mentorshipRepository.findActiveMentorship(app.studentId, app.educatorId);
  if (active && !active.endedAt)
    throw new ServiceError("Active mentorship already exists with this student", 409);

  await mentorshipRepository.acceptApplication(applicationId);
  const mentorship = await mentorshipRepository.createMentorship(app.studentId, app.educatorId);

  createAuditLog({
    action: "mentorship:accept_application",
    entityType: "mentorship",
    entityId: mentorship.id,
    performedBy: educatorId,
    details: { applicationId, studentId: app.studentId },
    status: "success",
  }).catch(() => {});

  return mentorship;
}

export async function rejectApplication(
  applicationId: string,
  educatorId: string,
  data: RejectApplicationInput,
) {
  const app = await mentorshipRepository.findApplicationById(applicationId);
  if (!app) throw new ServiceError("Application not found", 404);
  if (app.educatorId !== educatorId) throw new ServiceError("Not authorized", 403);
  if (app.status !== "pending") throw new ServiceError("Application is no longer pending", 400);

  const rejected = await mentorshipRepository.rejectApplication(
    applicationId,
    data.rejectionReason,
  );

  createAuditLog({
    action: "mentorship:reject_application",
    entityType: "mentorship_application",
    entityId: applicationId,
    performedBy: educatorId,
    details: { rejectionReason: data.rejectionReason, studentId: app.studentId },
    status: "success",
  }).catch(() => {});

  return rejected;
}

export async function listMentorships(userId: string) {
  return mentorshipRepository.findMentorshipsByUser(userId);
}

export async function getMentorship(id: string, userId: string) {
  const mentorship = await mentorshipRepository.findMentorshipById(id);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== userId && mentorship.educatorId !== userId)
    throw new ServiceError("Not authorized", 403);
  return mentorship;
}

export async function endMentorship(id: string, userId: string, data: EndMentorshipInput) {
  const mentorship = await mentorshipRepository.findMentorshipById(id);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== userId && mentorship.educatorId !== userId)
    throw new ServiceError("Not authorized", 403);
  if (mentorship.endedAt) throw new ServiceError("Mentorship has already ended", 400);

  const endedBy = mentorship.studentId === userId ? "student" : "educator";
  const ended = await mentorshipRepository.endMentorship(id, endedBy, data.endReason);

  createAuditLog({
    action: "mentorship:end",
    entityType: "mentorship",
    entityId: id,
    performedBy: userId,
    details: { endedBy, endReason: data.endReason },
    status: "success",
  }).catch(() => {});

  return ended;
}

export async function sendMessage(mentorshipId: string, senderId: string, content: string) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== senderId && mentorship.educatorId !== senderId)
    throw new ServiceError("Not authorized", 403);
  if (mentorship.endedAt) throw new ServiceError("Mentorship has ended", 400);
  const message = await mentorshipRepository.createMessage(mentorshipId, senderId, content);

  createAuditLog({
    action: "mentorship:send_message",
    entityType: "mentorship_message",
    entityId: message.id,
    performedBy: senderId,
    details: { mentorshipId },
    status: "success",
  }).catch(() => {});

  return message;
}

export async function listMessages(mentorshipId: string, userId: string) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== userId && mentorship.educatorId !== userId)
    throw new ServiceError("Not authorized", 403);
  return mentorshipRepository.findMessagesByMentorship(mentorshipId);
}

export async function rateEducator(mentorshipId: string, studentId: string, rating: number) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== studentId)
    throw new ServiceError("Only the student can rate the educator", 403);
  if (!mentorship.endedAt) throw new ServiceError("Mentorship must be ended before rating", 400);

  const existing = await mentorshipRepository.findRatingByMentorship(mentorshipId);
  if (existing) throw new ServiceError("Already rated", 409);

  const ratingResult = await mentorshipRepository.createRating(
    mentorshipId,
    studentId,
    mentorship.educatorId,
    rating,
  );

  createAuditLog({
    action: "mentorship:rate_educator",
    entityType: "mentorship_rating",
    entityId: ratingResult.id,
    performedBy: studentId,
    details: { mentorshipId, educatorId: mentorship.educatorId, rating },
    status: "success",
  }).catch(() => {});

  return ratingResult;
}

export async function getEducatorRating(educatorId: string) {
  const result = await mentorshipRepository.findAverageRatingByEducator(educatorId);
  return {
    average: result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : null,
    count: result._count.rating,
  };
}

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ServiceError";
  }
}
