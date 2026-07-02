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

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .transform((value) => value.replace(/\s+/g, " ")),
  description: z
    .string()
    .trim()
    .nonempty()
    .transform((value) => value.replace(/\s+/g, " ")),
  icon: z.string().nonempty(),
  iconColor: z.enum(IconColor),
  slug: z.string().nonempty(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
