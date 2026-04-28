import z from "zod";
export interface GetTasksDto {
  boardId: number;
}

export const CreateStatusColumnSchema = z.object({
  name: z.string().trim().normalize().min(3),
  description: z.string().trim().normalize().nonempty(),
});

export const UpdateStatusColumnSchema = CreateStatusColumnSchema.partial();

export type CreateStatusColumnDto = z.infer<typeof CreateStatusColumnSchema>;
export type UpdateStatusColumnDto = z.infer<typeof UpdateStatusColumnSchema>;
