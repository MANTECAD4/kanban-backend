import jwt, { VerifyErrors } from "jsonwebtoken";
import { TokenProvider } from "../../domain/services";
import { TokenPayload } from "../../application/dtos";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

export class JwtGenerator implements TokenProvider {
  constructor(private readonly secret: string) {}

  public generate = (payload: TokenPayload, duration: number): string => {
    const token = jwt.sign(payload, this.secret, {
      expiresIn: 60 * duration,
    });
    return token;
  };

  public validate = (token: string): TokenPayload | null => {
    try {
      const tokenContent = jwt.verify(token, this.secret);
      return tokenContent as unknown as TokenPayload;
    } catch (error) {
      const { message } = error as VerifyErrors;
      let customErrorInstance;
      if (message.match(/expires/i)) {
        customErrorInstance = CustomError.unauthorized(
          "Token expired",
          ErrorCodes.EXPIRED_TOKEN,
        );
      } else {
        customErrorInstance = CustomError.unauthorized(
          "Invalid token",
          ErrorCodes.UNAUTHORIZED,
        );
      }
      throw customErrorInstance;
    }
  };
}
