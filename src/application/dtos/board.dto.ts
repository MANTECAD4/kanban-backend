import z from "zod";

// This should not be here. No specific tecnologies should be used in domain or application layers
export const CreateBoardSchema = z.strictObject({
  name: z.string().trim().normalize(),
  description: z.string().trim().normalize(),
  userId: z.coerce.number().int().min(1),
});

export const GetBoardsSchema = z.strictObject({
  userId: z.coerce.number().int().min(1),
});

export const UpdateBoardSchema = CreateBoardSchema.omit({ userId: true })
  .partial()
  .and(z.object({ boardId: z.coerce.number().int().min(1) }));

// DTOS - These should be traditional interfaces/types according to clean architecture
export type CreateBoardDto = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardDto = z.infer<typeof UpdateBoardSchema>;
