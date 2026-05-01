import { AccessTokenPayload, TokenPayload } from "../../application/dtos";

export abstract class TokenProvider {
  abstract generate: (payload: TokenPayload, duration: number) => string;
  abstract validate: (token: string) => TokenPayload | null;
}
