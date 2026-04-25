import jwt from "jsonwebtoken";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";
import { TokenGenerator } from "../../domain/services";
import { TokenPayload, TokenReturnDto } from "../../application/dtos";

export class JwtGenerator implements TokenGenerator {
  constructor(private readonly secret: string) {}

  public generate = async (
    payload: TokenPayload,
    duration?: number,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.secret,
        { expiresIn: 60 * (duration ?? 30) },
        (err, token) => {
          if (err || !token) {
            return reject(err);
          }
          return resolve(token);
        },
      );
    });
  };

  public validate = (token: string): Promise<TokenReturnDto | null> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          return reject(
            CustomError.unauthorized(`Invalid token`, ErrorCodes.UNAUTHORIZED),
          );
        }
        return resolve(decoded as unknown as TokenReturnDto);
      });
    });
  };
}
