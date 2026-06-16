import z from "zod";
import { Priority } from "../../domain/entities";

export const CreateTaskSchema = z.object({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  dueDate: z.date(),
  priority: z.enum(Priority),
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
