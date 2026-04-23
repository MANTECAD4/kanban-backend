import { NextFunction, Request, Response } from "express";

import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { LoginSchema, RegisterUserSchema } from "../../application/dtos";
import { TokenGenerator } from "../../domain/services";

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
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid bearer token" });

    const token = authorization.split(" ").at(1) ?? "";

    try {
      const payload = await this.tokenGenerator.validate(token);
      if (!payload) return res.status(401).json({ error: "Invalid token." });

      req.user = payload;
      next();
    } catch (error) {
      // console.log({ ERROR_TOKEN_VALIDATION: error });
      res.status(401).json({ error: "Invalid bearer token" });
    }
  };
}
