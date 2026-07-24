import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().max(500).optional(),
  instructions: z.string().max(2000).optional(),
  isGraded: z.boolean().default(true),
});

export const updateAssessmentSchema = createAssessmentSchema.partial();

export const createQuestionSchema = z.object({
  title: z.string().min(1, "Question title is required").max(1000),
  answerOptions: z.array(z.string().min(1)).min(2, "At least two answer options are required"),
  correctAnswers: z.array(z.string().min(1)).min(1, "At least one correct answer is required"),
  grade: z.number().int().min(1).default(1),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const submitAssessmentSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        providedAnswers: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1, "At least one answer is required"),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
