import type {
  CreateProfileInput,
  UpdateProfileInput,
  CreateApplicationInput,
  RejectApplicationInput,
  EndMentorshipInput,
} from "./mentorship.dto.js";
import * as mentorshipRepository from "./mentorship.repository.js";

export async function createProfile(userId: string, data: CreateProfileInput) {
  const existing = await mentorshipRepository.findProfileByUserId(userId);
  if (existing) throw new ServiceError("Mentorship profile already exists", 409);
  return mentorshipRepository.createProfile(userId, data);
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const profile = await mentorshipRepository.findProfileByUserId(userId);
  if (!profile) throw new ServiceError("Mentorship profile not found", 404);
  return mentorshipRepository.updateProfile(userId, data);
}

export async function removeProfile(userId: string) {
  const profile = await mentorshipRepository.findProfileByUserId(userId);
  if (!profile) throw new ServiceError("Mentorship profile not found", 404);
  return mentorshipRepository.deleteProfile(userId);
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

  return mentorshipRepository.createApplication(studentId, educatorId, data);
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
  return mentorshipRepository.createMentorship(app.studentId, app.educatorId);
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

  return mentorshipRepository.rejectApplication(applicationId, data.rejectionReason);
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

export async function endMentorship(
  id: string,
  userId: string,
  data: EndMentorshipInput,
) {
  const mentorship = await mentorshipRepository.findMentorshipById(id);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== userId && mentorship.educatorId !== userId)
    throw new ServiceError("Not authorized", 403);
  if (mentorship.endedAt) throw new ServiceError("Mentorship has already ended", 400);

  const endedBy = mentorship.studentId === userId ? "student" : "educator";
  return mentorshipRepository.endMentorship(id, endedBy, data.endReason);
}

export async function sendMessage(mentorshipId: string, senderId: string, content: string) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== senderId && mentorship.educatorId !== senderId)
    throw new ServiceError("Not authorized", 403);
  if (mentorship.endedAt) throw new ServiceError("Mentorship has ended", 400);
  return mentorshipRepository.createMessage(mentorshipId, senderId, content);
}

export async function listMessages(mentorshipId: string, userId: string) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== userId && mentorship.educatorId !== userId)
    throw new ServiceError("Not authorized", 403);
  return mentorshipRepository.findMessagesByMentorship(mentorshipId);
}

export async function rateEducator(
  mentorshipId: string,
  studentId: string,
  rating: number,
) {
  const mentorship = await mentorshipRepository.findMentorshipById(mentorshipId);
  if (!mentorship) throw new ServiceError("Mentorship not found", 404);
  if (mentorship.studentId !== studentId)
    throw new ServiceError("Only the student can rate the educator", 403);
  if (!mentorship.endedAt) throw new ServiceError("Mentorship must be ended before rating", 400);

  const existing = await mentorshipRepository.findRatingByMentorship(mentorshipId);
  if (existing) throw new ServiceError("Already rated", 409);

  return mentorshipRepository.createRating(
    mentorshipId,
    studentId,
    mentorship.educatorId,
    rating,
  );
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
