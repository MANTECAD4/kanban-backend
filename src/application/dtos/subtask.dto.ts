import z from "zod";

export const SubmitSubtaskSchema = z.object({
  description: z.string().trim().normalize().nonempty(),
  isCompleted: z.boolean().optional(),
});
export const ChangeSubtaskStatusSchema = z.object({
  isCompleted: z.boolean(),
});

export type SubmitSubtaskDto = z.infer<typeof SubmitSubtaskSchema>;
export type ChangeSubtaskStatusDto = z.infer<typeof ChangeSubtaskStatusSchema>;
