import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters")
    .optional(),
});

export const updateStudentProfileSchema = z.object({
  schoolName: z
    .string()
    .min(1, "School name is required")
    .max(200, "School name must be at most 200 characters")
    .optional(),
  grade: z.enum(["S4", "S5", "S6"]).optional(),
});

export const updateEducatorProfileSchema = z.object({
  isIndependent: z.boolean().optional(),
  organizationName: z.string().max(200).optional(),
  expertiseAreas: z.array(z.string().min(1).max(200)).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  bio: z.string().min(1, "Bio is required").max(2000).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
export type UpdateEducatorProfileInput = z.infer<typeof updateEducatorProfileSchema>;
