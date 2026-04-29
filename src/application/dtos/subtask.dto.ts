import z from "zod";

export const CreateSubtaskSchema = z.object({
  description: z.string().trim().normalize().nonempty(),
});

export const UpdateSubtaskSchema = z
  .object({
    description: z.string().trim().normalize().nonempty(),
    isCompleted: z.boolean(),
  })
  .partial();

export type CreateSubtaskDto = z.infer<typeof CreateSubtaskSchema>;
export type UpdateSubtaskDto = z.infer<typeof UpdateSubtaskSchema>;
