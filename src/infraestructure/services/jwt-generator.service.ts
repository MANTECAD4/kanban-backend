import jwt from "jsonwebtoken";
import { TokenProvider } from "../../domain/services";
import { TokenPayload } from "../../application/dtos";

export class JwtGenerator implements TokenProvider {
  constructor(private readonly secret: string) {}

  public generate = (payload: TokenPayload, duration: number): string => {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: 60 * duration,
    });
    return token;
  };

  public validate = (token: string): TokenPayload | null => {
    const tokenContent = jwt.verify(token, this.secret);
    return tokenContent as unknown as TokenPayload;
  };
}
