import { TokenPayload, TokenReturnDto } from "../../application/dtos";

export abstract class TokenGenerator {
  abstract generate: (
    payload: TokenPayload,
    duration?: number,
  ) => Promise<string>;
  abstract validate: (token: string) => Promise<TokenReturnDto | null>;
}
