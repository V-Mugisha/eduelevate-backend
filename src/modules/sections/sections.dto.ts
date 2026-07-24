import { z } from "zod";

export const createSectionSchema = z.object({
  title: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
});

export const updateSectionSchema = createSectionSchema.partial();

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
