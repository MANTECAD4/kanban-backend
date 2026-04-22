export interface TokenPayload {
  sub: { id: number };
}

export type TokenReturn = TokenPayload & { iat: number; exp: number };

export abstract class TokenGenerator {
  abstract generate: (
    payload: TokenPayload,
    duration?: number,
  ) => Promise<string>;
  abstract validate: (token: string) => Promise<TokenReturn | null>;
}
