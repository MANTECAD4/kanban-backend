import z from "zod";

// This should not be here. No specific tecnologies should be used in domain or application layers
export const CreateBoardSchema = z.object({
  name: z.string().trim().normalize().min(3),
  description: z.string().trim().normalize().nonempty(),
});

export const UpdateBoardSchema = CreateBoardSchema.partial();
// .refine(
//   (data) => {
//     return Object.values(data).some((value) => value !== undefined);
//   },
//   {
//     error: "At least one field must be provided",
//   },
// );

// DTOS - These should be traditional interfaces/types according to clean architecture
export type CreateBoardDto = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardDto = z.infer<typeof UpdateBoardSchema>;
