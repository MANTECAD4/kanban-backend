import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  VerifyErrors,
} from "jsonwebtoken";

export const verifyJwtError = (error: any): error is VerifyErrors => {
  return (
    error instanceof TokenExpiredError ||
    error instanceof JsonWebTokenError ||
    error instanceof NotBeforeError
  );
};
