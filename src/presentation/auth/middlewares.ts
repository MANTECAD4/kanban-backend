import { NextFunction, Request, Response } from "express";

import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  AccessTokenPayloadSchema,
  LoginSchema,
  RegisterUserSchema,
} from "../../application/dtos";
import { TokenProvider } from "../../domain/services";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";
import { VerifyErrors } from "jsonwebtoken";

export class AuthMiddlewares {
  constructor(private readonly tokenGenerator: TokenProvider) {}

  public loginDataValidation = dataValidationMiddlewareFactory(
    LoginSchema,
    "Invalid data recieved. Login denied",
    RequestValidationTarget.BODY,
  );

  public registerDataValidation = dataValidationMiddlewareFactory(
    RegisterUserSchema,
    "Invalid data recieved. Register failed",
    RequestValidationTarget.BODY,
  );

  public validateAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authorization = req.header("authorization");
    if (!authorization) {
      const error = CustomError.unauthorized(
        "No token provided",
        ErrorCodes.UNAUTHORIZED,
      );
      return CustomError.handleError(error, req, res);
    }
    if (!authorization.startsWith("Bearer ")) {
      const error = CustomError.unauthorized(
        "Invalid token",
        ErrorCodes.INVALID_TOKEN,
      );
      return CustomError.handleError(error, req, res);
    }

    const token = authorization.split(" ").at(1) ?? "";

    try {
      const payload = this.tokenGenerator.validate(token);
      const result = AccessTokenPayloadSchema.safeParse(payload);
      if (!result.success) {
        const error = CustomError.unauthorized(
          "Invalid token payload",
          ErrorCodes.INVALID_TOKEN,
        );
        return CustomError.handleError(error, req, res);
      }
      if (result.data.type !== "access") {
        const error = CustomError.unauthorized(
          "Invalid token type",
          ErrorCodes.INVALID_TOKEN,
        );
        return CustomError.handleError(error, req, res);
      }

      req.user = result.data;
      next();
    } catch (error) {
      // console.log(error);
      const { message } = error as VerifyErrors;

      let customErrorInstance;
      if (message.match(/expired/i)) {
        customErrorInstance = CustomError.unauthorized(
          "Expired token",
          ErrorCodes.EXPIRED_TOKEN,
        );
        return CustomError.handleError(customErrorInstance, req, res);
      }

      customErrorInstance = CustomError.unauthorized(
        "Invalid token",
        ErrorCodes.INVALID_TOKEN,
      );
      return CustomError.handleError(customErrorInstance, req, res);
    }
  };
}
