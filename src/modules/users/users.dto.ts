import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit");

const baseUserSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: passwordSchema,
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

const studentProfileSchema = z.object({
  schoolName: z.string().min(1, "School name is required").max(200),
  grade: z.enum(["S4", "S5", "S6"]),
});

const educatorProfileSchema = z.object({
  isIndependent: z.boolean(),
  organizationName: z.string().max(200).nullable().optional(),
  expertiseAreas: z.array(z.string().min(1).max(200)).min(1, "At least one expertise area is required"),
  yearsOfExperience: z.number().int().min(0).nullable().optional(),
  bio: z.string().max(2000).optional(),
});

export const createUserSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("student"), ...baseUserSchema.shape, ...studentProfileSchema.shape }),
  z.object({
    role: z.literal("educator"),
    ...baseUserSchema.shape,
    ...educatorProfileSchema.shape,
  }),
  z.object({
    role: z.literal("admin"),
    ...baseUserSchema.shape,
  }),
]);

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(255).optional(),
  firstName: z.string().min(1, "First name is required").max(100).optional(),
  lastName: z.string().min(1, "Last name is required").max(100).optional(),
  roleId: z.string().uuid("Invalid role ID").optional(),
  isActive: z.boolean().optional(),
  schoolName: z.string().min(1, "School name is required").max(200).optional(),
  grade: z.enum(["S4", "S5", "S6"]).optional(),
  isIndependent: z.boolean().optional(),
  organizationName: z.string().max(200).nullable().optional(),
  expertiseAreas: z.array(z.string().min(1).max(200)).optional(),
  yearsOfExperience: z.number().int().min(0).nullable().optional(),
  bio: z.string().min(1).max(2000).optional(),
});

export const userQuerySchema = z.object({
  q: z.string().optional(),
  role: z.enum(["student", "educator", "admin"]).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
