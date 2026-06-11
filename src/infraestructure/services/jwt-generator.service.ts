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
      const customErrorInstance = CustomError.unauthorized({
        title: "Invalid token",
        message,
        code: ErrorCodes.INVALID_TOKEN,
        details: null,
      });
      throw customErrorInstance;
    }
  };
}
