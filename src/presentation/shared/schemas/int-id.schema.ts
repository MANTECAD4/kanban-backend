import z from "zod";

export const ParamsWithIdSchema = z.object({
  id: z.coerce.number().int().min(1),
});
