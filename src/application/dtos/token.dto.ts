import z from "zod";

export const TokenTimersSchema = z.object({
  iat: z.number(),
  exp: z.number(),
});
export type TokenTimers = z.infer<typeof TokenTimersSchema>;

export const AccessTokenPayloadSchema = z.object({
  sub: z.object({ id: z.coerce.number().int().min(1) }),
  type: z.enum(["access"]),
});
export const RefreshTokenPayloadSchema = z.object({
  sub: z.object({ id: z.coerce.number().int().min(1) }),
  type: z.enum(["refresh"]),
  jti: z.uuidv4(),
});

export const RefreshTokenEntitySchema = z.object({
  jti: z.uuidv4(),
  hash: z.hash("sha256", { enc: "hex" }),
  expiresAt: z.date(),
  userId: z.number().int().min(1),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;
export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

export type RefreshTokenEntityDto = z.infer<typeof RefreshTokenEntitySchema>;
