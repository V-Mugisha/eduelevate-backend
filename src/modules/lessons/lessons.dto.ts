import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  subtitle: z.string().max(500).optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
