import z from "zod";
import { IconColor } from "./project.dto";

export const SubmitBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .transform((value) => value.replace(/\s+/g, " ")),
  slug: z.string().nonempty(),
  description: z
    .string()
    .trim()
    .nonempty()
    .transform((value) => value.replace(/\s+/g, " ")),
  icon: z.string().nonempty(),
  iconColor: z.enum(IconColor),
});

export type SubmitBoardDto = z.infer<typeof SubmitBoardSchema>;

// .refine(
//   (data) => {
//     return Object.values(data).some((value) => value !== undefined);
//   },
//   {
//     error: "At least one field must be provided",
//   },
