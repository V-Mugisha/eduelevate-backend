import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(300).optional(),
  description: z.string().min(1, "Description is required").max(5000),
  categoryId: z.string().uuid("Invalid category"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Level must be beginner, intermediate, or advanced",
  }),
  duration: z.string().max(100).optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const courseQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  createdBy: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CourseQuery = z.infer<typeof courseQuerySchema>;
