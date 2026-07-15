import z from "zod";
export interface GetTasksDto {
  boardId: number;
}

export const SubmitCategorySchema = z.object({
  name: z.string().trim().min(3),
  icon: z.string().nonempty(),
});

export type SubmitCategoryDto = z.infer<typeof SubmitCategorySchema>;
