import * as z from "zod";

export const RegisterUserSchema = z.object({
  name: z.string().trim().min(3),
  email: z.email().trim(),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(/\d/, { error: "Must contain at least one number" })
    .regex(/[A-Z]/, {
      error: "Must contain at least one upper letter",
    })
    .regex(/[a-z]/, {
      error: "Must contain at least one lower letter",
    })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Must contain at least one special character",
    }),
});

export const LoginSchema = RegisterUserSchema.omit({ name: true });

export type LoginUserDto = z.infer<typeof LoginSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
