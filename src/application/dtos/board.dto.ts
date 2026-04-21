import z from "zod";

export const CreateBoardSchema = z.strictObject({
  name: z.string().trim().normalize(),
  description: z.string().trim().normalize(),
  userId: z.coerce.number().int().min(1),
});

export const GetBoardsSchema = z.strictObject({
  userId: z.coerce.number().int().min(1),
});

export type CreateBoardDto = z.infer<typeof CreateBoardSchema>;

export type UpdateBoardDto = Partial<Omit<CreateBoardDto, "userId">>;
