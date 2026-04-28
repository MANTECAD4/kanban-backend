import z from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  order: z.coerce.number().int().min(1),
});

export const UpdateDataInTaskSchema = CreateTaskSchema.omit({
  order: true,
}).partial();

export const UpdateColumnInTaskSchema = z.object({
  statusColumnId: z.coerce.number().int().min(1),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateDataInTaskDto = z.infer<typeof UpdateDataInTaskSchema>;
export type UpdateColumnInTaskDto = z.infer<typeof UpdateColumnInTaskSchema>;
