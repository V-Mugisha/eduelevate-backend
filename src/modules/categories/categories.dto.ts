import { z } from "zod";

export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
