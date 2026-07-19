import { z } from "zod";

export const studentRegisterSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  schoolName: z
    .string()
    .min(1, "School name is required")
    .max(200, "School name must be at most 200 characters"),
  grade: z.enum(["S4", "S5", "S6"], {
    message: "Grade must be S4, S5, or S6",
  }),
});

export const educatorRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name must be at most 100 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name must be at most 100 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    isIndependent: z.boolean(),
    organizationName: z.string().max(200).optional(),
    expertiseAreas: z
      .array(z.string().min(1).max(200))
      .min(1, "At least one area of expertise is required"),
    yearsOfExperience: z.number().int().min(0).optional(),
    bio: z.string().min(1, "Bio is required").max(2000, "Bio must be at most 2000 characters"),
  })
  .refine(
    (data: { isIndependent: boolean; organizationName?: string | null }) =>
      data.isIndependent || (data.organizationName && data.organizationName.length > 0),
    {
      message: "Organization name is required when not independent",
      path: ["organizationName"],
    },
  );

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type EducatorRegisterInput = z.infer<typeof educatorRegisterSchema>;
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: AuthUserResponse;
    token: string;
  };
}
