import * as z from "zod";
export const RegisterUserSchema = z.strictObject({
  name: z.string().trim().min(3),
  email: z.email().trim().normalize(),
  password: z
    .string()
    .trim()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{6,}$/,
      "Invalid password: must contain uppercase & lowercase letters and at least one digit.",
    ),
});

export const LoginSchema = RegisterUserSchema.omit({ name: true });
