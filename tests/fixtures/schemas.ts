import z from "zod";

export const testBodySchema = z.object({
  id: z.number().int().min(1),
  name: z.string().trim().nonempty(),
});

export const testQuerySchema = z.object({
  page: z.number().min(1),
  sort: z.string().trim().nonempty(),
});

export const testParamsSchema = z.object({
  userId: z.number().int().min(1),
  slug: z.string().trim().nonempty(),
});
