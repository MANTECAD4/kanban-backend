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

export const TokenPayloadSchema = z.object({
  sub: z.object({ id: z.coerce.number().int().min(1) }),
});

export const TokenTimersSchema = z.object({
  iat: z.number(),
  exp: z.number(),
});

export const TokenReturnSchema = TokenPayloadSchema.and(TokenTimersSchema);

export const LoginSchema = RegisterUserSchema.omit({ name: true });

export type LoginUserDto = z.infer<typeof LoginSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type TokenTimers = z.infer<typeof TokenTimersSchema>;
export type TokenReturnDto = z.infer<typeof TokenReturnSchema>;
