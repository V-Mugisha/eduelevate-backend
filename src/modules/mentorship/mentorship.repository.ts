import { prisma } from "@/lib/prisma";
import type {
  CreateProfileInput,
  UpdateProfileInput,
  CreateApplicationInput,
} from "./mentorship.dto.js";

const profileSelect = { id: true, userId: true, topics: true, bio: true, createdAt: true };

const educatorSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  mentorshipProfile: { select: profileSelect },
};

export function findProfileByUserId(userId: string) {
  return prisma.mentorshipProfile.findUnique({ where: { userId }, select: profileSelect });
}

export function createProfile(userId: string, data: CreateProfileInput) {
  return prisma.mentorshipProfile.create({
    data: { userId, topics: data.topics, bio: data.bio ?? null },
    select: profileSelect,
  });
}

export function updateProfile(userId: string, data: UpdateProfileInput) {
  return prisma.mentorshipProfile.update({ where: { userId }, data, select: profileSelect });
}

export function deleteProfile(userId: string) {
  return prisma.mentorshipProfile.delete({ where: { userId } });
}

export function searchEducators(query?: string) {
  const where: Record<string, unknown> = {
    role: { name: { in: ["educator", "admin"] } },
    mentorshipProfile: { isNot: null },
  };

  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: "insensitive" as const } },
      { lastName: { contains: query, mode: "insensitive" as const } },
      { mentorshipProfile: { topics: { hasSome: [query] } } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: educatorSelect,
    orderBy: { lastName: "asc" },
  });
}

export function findEducatorById(userId: string) {
  return prisma.user.findFirst({
    where: {
      id: userId,
      role: { name: { in: ["educator", "admin"] } },
      mentorshipProfile: { isNot: null },
    },
    select: educatorSelect,
  });
}

export function createApplication(
  studentId: string,
  educatorId: string,
  data: CreateApplicationInput,
) {
  return prisma.mentorshipApplication.create({
    data: {
      studentId,
      educatorId,
      message: data.message,
      topic: data.topic ?? null,
    },
    select: {
      id: true,
      studentId: true,
      educatorId: true,
      message: true,
      topic: true,
      status: true,
      createdAt: true,
    },
  });
}

export function findPendingApplication(studentId: string, educatorId: string) {
  return prisma.mentorshipApplication.findFirst({
    where: { studentId, educatorId, status: "pending" },
    select: { id: true },
  });
}

export function findApplicationById(id: string) {
  return prisma.mentorshipApplication.findUnique({
    where: { id },
    select: {
      id: true,
      studentId: true,
      educatorId: true,
      message: true,
      topic: true,
      status: true,
      rejectionReason: true,
      createdAt: true,
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
      educator: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export function findApplicationsByStudent(studentId: string) {
  return prisma.mentorshipApplication.findMany({
    where: { studentId },
    select: {
      id: true,
      educatorId: true,
      message: true,
      topic: true,
      status: true,
      rejectionReason: true,
      createdAt: true,
      educator: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findApplicationsByEducator(educatorId: string) {
  return prisma.mentorshipApplication.findMany({
    where: { educatorId },
    select: {
      id: true,
      studentId: true,
      message: true,
      topic: true,
      status: true,
      rejectionReason: true,
      createdAt: true,
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function acceptApplication(id: string) {
  return prisma.mentorshipApplication.update({
    where: { id },
    data: { status: "accepted" },
  });
}

export function rejectApplication(id: string, reason?: string) {
  return prisma.mentorshipApplication.update({
    where: { id },
    data: { status: "rejected", rejectionReason: reason ?? null },
  });
}

export function createMentorship(studentId: string, educatorId: string) {
  return prisma.mentorship.create({
    data: { studentId, educatorId },
    select: {
      id: true,
      studentId: true,
      educatorId: true,
      startedAt: true,
      endedAt: true,
      endedBy: true,
      endReason: true,
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
      educator: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export function findActiveMentorship(studentId: string, educatorId: string) {
  return prisma.mentorship.findUnique({
    where: { studentId_educatorId: { studentId, educatorId } },
    select: { id: true, endedAt: true },
  });
}

export function findMentorshipById(id: string) {
  return prisma.mentorship.findUnique({
    where: { id },
    select: {
      id: true,
      studentId: true,
      educatorId: true,
      startedAt: true,
      endedAt: true,
      endedBy: true,
      endReason: true,
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
      educator: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export function endMentorship(id: string, endedBy: string, endReason?: string) {
  return prisma.mentorship.update({
    where: { id },
    data: { endedAt: new Date(), endedBy, endReason: endReason ?? null },
  });
}

export function findMentorshipsByUser(userId: string) {
  return prisma.mentorship.findMany({
    where: {
      OR: [{ studentId: userId }, { educatorId: userId }],
    },
    select: {
      id: true,
      studentId: true,
      educatorId: true,
      startedAt: true,
      endedAt: true,
      endedBy: true,
      endReason: true,
      student: { select: { id: true, firstName: true, lastName: true, email: true } },
      educator: { select: { id: true, firstName: true, lastName: true } },
      rating: { select: { id: true, rating: true } },
    },
    orderBy: { startedAt: "desc" },
  });
}

export function createMessage(mentorshipId: string, senderId: string, content: string) {
  return prisma.mentorshipMessage.create({
    data: { mentorshipId, senderId, content },
    select: { id: true, mentorshipId: true, senderId: true, content: true, createdAt: true },
  });
}

export function findMessagesByMentorship(mentorshipId: string) {
  return prisma.mentorshipMessage.findMany({
    where: { mentorshipId },
    select: {
      id: true,
      mentorshipId: true,
      senderId: true,
      content: true,
      createdAt: true,
      sender: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function createRating(
  mentorshipId: string,
  studentId: string,
  educatorId: string,
  rating: number,
) {
  return prisma.mentorshipRating.create({
    data: { mentorshipId, studentId, educatorId, rating },
    select: { id: true, mentorshipId: true, rating: true, createdAt: true },
  });
}

export function findRatingByMentorship(mentorshipId: string) {
  return prisma.mentorshipRating.findUnique({
    where: { mentorshipId },
    select: { id: true, rating: true, createdAt: true },
  });
}

export function findAverageRatingByEducator(educatorId: string) {
  return prisma.mentorshipRating.aggregate({
    where: { educatorId },
    _avg: { rating: true },
    _count: { rating: true },
  });
}
