import { z } from "zod";

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  subtitle: z.string().max(500).optional(),
  description: z.string().max(50000).optional(),
  prerequisites: z.array(z.string().max(200)).optional(),
});

export const updateModuleSchema = createModuleSchema.partial();

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
