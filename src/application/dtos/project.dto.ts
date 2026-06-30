import z from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().nonempty(),
  icon: z.string().nonempty(),
  iconColor: z.string().nonempty(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;
