import jwt from "jsonwebtoken";
import { CustomError } from "../../domain/errors/custom-error";
import { TokenGenerator, type TokenPayload } from "../../domain/services";
export class JwtGenerator implements TokenGenerator {
  constructor(private readonly seed: string) {}

  public generate = async (payload: TokenPayload, duration?: number) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.seed,
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

  public validate = (token: string): Promise<TokenPayload | null> => {
    return new Promise((resolve) => {
      jwt.verify(token, this.seed, (err, decoded) => {
        if (err) {
          // console.log(err);
          throw CustomError.unauthorized(`Invalid token`);
        }
        return resolve(decoded as unknown as TokenPayload);
      });
    });
  };
}
