import z from "zod";

export const CreateKanbanTaskSchema = z.strictObject({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  order: z.coerce.number().int().min(1),
});

export const UpdateKanbanTaskSchema = CreateKanbanTaskSchema.omit({
  order: true,
}).partial();

export type CreateKanbanTaskDto = z.infer<typeof CreateKanbanTaskSchema>;
export type UpdateKanbanTaskDto = z.infer<typeof UpdateKanbanTaskSchema>;
