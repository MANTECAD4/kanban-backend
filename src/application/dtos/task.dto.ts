import z from "zod";

export const CreateKanbanTaskSchema = z.strictObject({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  order: z.coerce.number().int().min(1),
  // subtasks: z.array(z.string().normalize().nonempty()),
});

export const UpdateKanbanTaskSchema = z
  .strictObject({
    title: z.string().normalize().min(3),
    description: z.string().normalize().nonempty(),
    order: z.coerce.number().int().min(1),
    statusColumnId: z.coerce.number().int().min(1),
  })
  .partial();

export type CreateKanbanTaskDto = z.infer<typeof CreateKanbanTaskSchema>;
export type UpdateKanbanTaskDto = z.infer<typeof UpdateKanbanTaskSchema>;
