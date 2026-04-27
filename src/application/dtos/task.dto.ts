import z from "zod";

export const CreateTaskSchema = z.strictObject({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  order: z.coerce.number().int().min(1),
  subtasks: z.array(z.string().normalize().nonempty()),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
