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
  name: z.string().min(3),
  description: z.string().nonempty(),
  icon: z.string().nonempty(),
  iconColor: z.enum(IconColor),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
