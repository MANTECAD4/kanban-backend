import jwt from "jsonwebtoken";
import { CustomError } from "../../domain/errors/custom-error";
import {
  TokenGenerator,
  type TokenReturn,
  type TokenPayload,
} from "../../domain/services";

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
            return reject(
              CustomError.internalServer(
                "Internal server error (error in jwt generator). Check logs.",
              ),
            );
          }
          return resolve(token);
        },
      );
    });
  };

  public validate = (token: string): Promise<TokenReturn | null> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          // console.log(err);
          reject(CustomError.unauthorized(`Invalid token`));
        }
        return resolve(decoded as unknown as TokenReturn);
      });
    });
  };
}
