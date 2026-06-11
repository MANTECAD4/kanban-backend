import { NextFunction, Request, Response } from "express";

import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  AccessTokenPayloadSchema,
  LoginSchema,
  RefreshTokenPayloadSchema,
  RegisterUserSchema,
} from "../../application/dtos";
import {
  HasherService,
  RefreshTokenPersistencyService,
  TokenProvider,
} from "../../domain/services";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

import { verifyJwtError } from "../../domain/services/verify-jwt-error.service";

interface ClassDependencies {
  tokenProvider: TokenProvider;
  softHashService: HasherService;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class AuthMiddlewares {
  private readonly tokenProvider: TokenProvider;
  private readonly softHashService: HasherService;
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
  constructor(depedencies: ClassDependencies) {
    const { tokenProvider, softHashService, refreshTokenPersistencyService } =
      depedencies;

    this.tokenProvider = tokenProvider;
    this.softHashService = softHashService;
    this.refreshTokenPersistencyService = refreshTokenPersistencyService;
  }

  public loginDataValidation = dataValidationMiddlewareFactory(
    LoginSchema,
    "Invalid request data",
    RequestValidationTarget.BODY,
  );

  public registerDataValidation = dataValidationMiddlewareFactory(
    RegisterUserSchema,
    "Invalid request data",
    RequestValidationTarget.BODY,
  );

  public validateAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authorization = req.header("authorization");
    if (!authorization) {
      const error = CustomError.unauthorized({
        title: "Operation denied",
        message: "No token provided",
        code: ErrorCodes.UNAUTHORIZED,
        details: null,
      });
      return CustomError.handleError(error, req, res);
    }
    if (!authorization.startsWith("Bearer ")) {
      const error = CustomError.unauthorized({
        title: "Operation denied",
        message: "Invalid token",
        code: ErrorCodes.INVALID_TOKEN,
        details: null,
      });
      return CustomError.handleError(error, req, res);
    }

    const token = authorization.split(" ").at(1) ?? "";

    try {
      const payload = this.tokenProvider.validate(token);
      const result = AccessTokenPayloadSchema.safeParse(payload);
      if (!result.success) {
        const error = CustomError.unauthorized({
          title: "Operation denied",
          message: "Invalid token payload",
          code: ErrorCodes.INVALID_TOKEN,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }

      req.user = result.data;
      next();
    } catch (error) {
      if (verifyJwtError(error)) {
        const { message } = error;
        const customErrorInstance = CustomError.unauthorized({
          title: "Operation denied",
          message,
          code: ErrorCodes.INVALID_TOKEN,
          details: null,
        });
        return CustomError.handleError(customErrorInstance, req, res);
      }
      return CustomError.handleError(error, req, res);
    }
  };

  public validateRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const error = CustomError.unauthorized({
          title: "Logout failed",
          message: "Missing token",
          code: ErrorCodes.UNAUTHORIZED,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }

      const payload = this.tokenProvider.validate(refreshToken);

      const result = RefreshTokenPayloadSchema.safeParse(payload);

      if (!result.success) {
        const error = CustomError.unauthorized({
          title: "Operation denied",
          message: "Invalid token payload",
          code: ErrorCodes.INVALID_TOKEN,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }

      const { jti } = result.data;

      const tokenInDb = await this.refreshTokenPersistencyService.getByJti(jti);

      if (!tokenInDb)
        throw CustomError.notFound({
          title: "Logout failed",
          message: "Token not found in DB",
          code: ErrorCodes.NOT_FOUND,
          details: null,
        });

      if (tokenInDb.revokedAt)
        throw CustomError.unauthorized({
          title: "Logout failed",
          message: "Invalid token. It was already revoked",
          code: ErrorCodes.UNAUTHORIZED,
          details: null,
        });

      const hashMatches = await this.softHashService.compare(
        refreshToken,
        tokenInDb.hash,
      );
      if (!hashMatches)
        throw CustomError.unauthorized({
          title: "Logout failed",
          message: `Provided token doesn't match with DB`,
          code: ErrorCodes.UNAUTHORIZED,
          details: null,
        });

      req.user = result.data;
      next();
    } catch (error) {
      if (verifyJwtError(error)) {
        const { message } = error;
        const customErrorInstance = CustomError.unauthorized({
          title: "Operation denied",
          message,
          code: ErrorCodes.INVALID_TOKEN,
          details: null,
        });
        return CustomError.handleError(customErrorInstance, req, res);
      }
      return CustomError.handleError(error, req, res);
    }
  };
}
