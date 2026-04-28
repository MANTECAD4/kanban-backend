import z from "zod";

export const CreateKanbanTaskSchema = z.object({
  title: z.string().normalize().min(3),
  description: z.string().normalize().nonempty(),
  order: z.coerce.number().int().min(1),
});

export const UpdateDatainKanbanTaskSchema = CreateKanbanTaskSchema.omit({
  order: true,
}).partial();

export const UpdateColumnInKanbanTaskSchema = z.object({
  statusColumnId: z.coerce.number().int().min(1),
});

export type CreateKanbanTaskDto = z.infer<typeof CreateKanbanTaskSchema>;
export type UpdateDataInKanbanTaskDto = z.infer<
  typeof UpdateDatainKanbanTaskSchema
>;
export type UpdateColumnInKanbanTaskDto = z.infer<
  typeof UpdateColumnInKanbanTaskSchema
>;
