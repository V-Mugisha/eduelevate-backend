import { z } from "zod";

export const createProfileSchema = z.object({
  topics: z.array(z.string().min(1).max(100)).min(1, "At least one topic is required"),
  bio: z.string().max(1000).optional(),
});

export const updateProfileSchema = createProfileSchema.partial();

export const createApplicationSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000),
  topic: z.string().max(200).optional(),
});

export const rejectApplicationSchema = z.object({
  rejectionReason: z.string().max(500).optional(),
});

export const endMentorshipSchema = z.object({
  endReason: z.string().max(500).optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>;
export type EndMentorshipInput = z.infer<typeof endMentorshipSchema>;
