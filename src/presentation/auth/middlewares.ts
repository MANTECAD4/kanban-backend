import { NextFunction, Request, Response } from "express";

import { dataValidationMiddlewareFactory } from "../shared/factories/data-validation-middleware";
import { LoginSchema, RegisterUserSchema } from "./schemas";

export class AuthMiddlewares {
  constructor() {}

  public loginDataVaidation = dataValidationMiddlewareFactory(
    LoginSchema,
    "Invalid data recieved. Login denied",
  );

  public registerDataValidation = dataValidationMiddlewareFactory(
    RegisterUserSchema,
    "Invalid data recieved. Register failed",
  );
}
