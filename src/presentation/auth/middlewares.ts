import { NextFunction, Request, Response } from "express";

import { dataValidationMiddlewareFactory } from "../shared/factories/data-validation-middleware";
import { LoginSchema, RegisterUserSchema } from "../../application/dtos";

export class AuthMiddlewares {
  // constructor() {}

  static loginDataValidation = dataValidationMiddlewareFactory(
    LoginSchema,
    "Invalid data recieved. Login denied",
  );

  static registerDataValidation = dataValidationMiddlewareFactory(
    RegisterUserSchema,
    "Invalid data recieved. Register failed",
  );
}
