import z from "zod";

export const CreateBoardSchema = z.strictObject({
  name: z.string().trim().normalize(),
  description: z.string().trim().normalize(),
  userId: z.coerce.number().int().min(1),
});
