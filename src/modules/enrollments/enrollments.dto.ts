import { z } from "zod";

export const enrollmentResponseSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  completedLessons: z.array(z.object({ lessonId: z.string() })),
  progress: z.number().optional(),
});

export type EnrollmentResponse = z.infer<typeof enrollmentResponseSchema>;
