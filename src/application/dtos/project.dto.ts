import z from "zod";

export enum IconColor {
  RED = "RED",
  ORANGE = "ORANGE",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
  SKY = "SKY",
  CYAN = "CYAN",
  INDIGO = "INDIGO",
  PURPLE = "PURPLE",
  PINK = "PINK",
  GRAY = "GRAY",
}

export const SubmitProjectSchema = z.object({
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

export type SubmitProjectDto = z.infer<typeof SubmitProjectSchema>;
