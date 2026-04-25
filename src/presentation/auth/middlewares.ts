import { NextFunction, Request, Response } from "express";

import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  LoginSchema,
  RegisterUserSchema,
  TokenPayloadSchema,
  TokenReturnSchema,
} from "../../application/dtos";
import { TokenGenerator } from "../../domain/services";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

export class AuthMiddlewares {
  constructor(private readonly tokenGenerator: TokenGenerator) {}

  static loginDataValidation = dataValidationMiddlewareFactory(
    LoginSchema,
    "Invalid data recieved. Login denied",
    RequestValidationTarget.BODY,
  );

  static registerDataValidation = dataValidationMiddlewareFactory(
    RegisterUserSchema,
    "Invalid data recieved. Register failed",
    RequestValidationTarget.BODY,
  );
  public validateJwtToken = async (
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
        ErrorCodes.UNAUTHORIZED,
      );
      return CustomError.handleError(error, req, res);
    }

    const token = authorization.split(" ").at(1) ?? "";

    try {
      const payload = await this.tokenGenerator.validate(token);
      const result = TokenReturnSchema.safeParse(payload);
      if (!result.success) {
        const error = CustomError.unauthorized(
          "Invalid token",
          ErrorCodes.UNAUTHORIZED,
        );
        return CustomError.handleError(error, req, res);
      }

      req.user = result.data;
      next();
    } catch (error) {
      const errorInstance = CustomError.unauthorized(
        "Invalid token",
        ErrorCodes.UNAUTHORIZED,
      );
      return CustomError.handleError(errorInstance, req, res);
    }
  };
}
