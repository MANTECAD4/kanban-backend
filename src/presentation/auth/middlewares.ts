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
import { UserRepository } from "../../domain/repositories";

interface ClassDependencies {
  userRepository: UserRepository;
  tokenProvider: TokenProvider;
  softHashService: HasherService;
  refreshTokenPersistencyService: RefreshTokenPersistencyService;
}

export class AuthMiddlewares {
  private readonly tokenProvider: TokenProvider;
  private readonly userRepository: UserRepository;
  private readonly softHashService: HasherService;
  private readonly refreshTokenPersistencyService: RefreshTokenPersistencyService;
  constructor(depedencies: ClassDependencies) {
    const {
      tokenProvider,
      userRepository,
      softHashService,
      refreshTokenPersistencyService,
    } = depedencies;

    this.tokenProvider = tokenProvider;
    this.userRepository = userRepository;
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

      const existingUser = await this.userRepository.getById(
        result.data.sub.id,
      );

      if (!existingUser) {
        const error = CustomError.badRequest({
          title: "Not Found",
          message: "User not found",
          code: ErrorCodes.NOT_FOUND,
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
    const errorTitle = "Sign in";

    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        const error = CustomError.unauthorized({
          title: errorTitle,
          message: "Session not found",
          code: ErrorCodes.MISSING_SESSION,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }

      const payload = this.tokenProvider.validate(refreshToken);

      const result = RefreshTokenPayloadSchema.safeParse(payload);

      if (!result.success) {
        const error = CustomError.unauthorized({
          title: errorTitle,
          message: "Something went wrong with your credentials.",
          code: ErrorCodes.BAD_SESSION,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }

      const { jti } = result.data;

      const tokenInDb = await this.refreshTokenPersistencyService.getByJti(jti);

      if (!tokenInDb)
        throw CustomError.notFound({
          title: errorTitle,
          message: "Something went wrong with your credentials",
          code: ErrorCodes.MISSING_SESSION,
          details: null,
        });

      if (tokenInDb.revokedAt)
        throw CustomError.unauthorized({
          title: errorTitle,
          message: "Session closed",
          code: ErrorCodes.SESSION_REVOKED,
          details: null,
        });

      const hashMatches = await this.softHashService.compare(
        refreshToken,
        tokenInDb.hash,
      );
      if (!hashMatches)
        throw CustomError.unauthorized({
          title: errorTitle,
          message: `Something went wrong with your credentials`,
          code: ErrorCodes.BAD_SESSION,
          details: null,
        });

      const existingUser = await this.userRepository.getById(
        result.data.sub.id,
      );

      if (!existingUser) {
        const error = CustomError.badRequest({
          title: "Not Found",
          message: "User not found",
          code: ErrorCodes.NOT_FOUND,
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
          code: ErrorCodes.BAD_SESSION,
          details: null,
        });
        return CustomError.handleError(customErrorInstance, req, res);
      }
      return CustomError.handleError(error, req, res);
    }
  };
}
