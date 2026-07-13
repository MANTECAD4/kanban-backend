import z from "zod";
export interface GetTasksDto {
  boardId: number;
}

export const SubmitStatusColumnSchema = z.object({
  name: z.string().trim().min(3),
  icon: z.string().nonempty(),
});

export type SubmitStatusColumnDto = z.infer<typeof SubmitStatusColumnSchema>;
