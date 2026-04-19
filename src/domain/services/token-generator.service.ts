export interface TokenPayload {
  sub: number;
}

export abstract class TokenGenerator {
  abstract generate: (
    payload: TokenPayload,
    duration?: number,
  ) => Promise<unknown>;
  abstract validate: (token: string) => Promise<TokenPayload | null>;
}
