import { Request, Response } from "express";

export enum ErrorCodes {
  "UNAUTHORIZED" = "UNAUTHORIZED",
  "FORBIDDEN" = "FORBIDDEN",
  "BAD_REQUEST" = "BAD_REQUEST",
  "NOT_FOUND" = "NOT_FOUND",
  "INTERNAL_ERROR" = "INTERNAL_ERROR",

  "MALFORMED_ENTITY" = "MALFORMED_ENTITY",

  "EXPIRED_TOKEN" = "EXPIRED_TOKEN",
  "INVALID_TOKEN" = "INVALID_TOKEN",

  "ALREADY_REGISTERED" = "ALREADY_REGISTERED",
  "INVALID_DATA" = "INVALID_DATA",
}

type ErrorDetails = Record<string, string[] | undefined>;

export class CustomError extends Error {
  private constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code: ErrorCodes,
    private readonly detals?: ErrorDetails,
  ) {
    super(message);
  }

  public static badRequest(
    message: string,
    code: ErrorCodes,
    details?: ErrorDetails,
  ) {
    return new CustomError(400, message, code, details);
  }
  public static unauthorized(message: string, code: ErrorCodes) {
    return new CustomError(401, message, code);
  }
  public static forbidden(message: string, code: ErrorCodes) {
    return new CustomError(403, message, code);
  }
  public static notFound(message: string, code: ErrorCodes) {
    return new CustomError(404, message, code);
  }
  public static internalServer(message: string, code: ErrorCodes) {
    return new CustomError(500, message, code);
  }

  public static handleError = (error: any, req: Request, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        ok: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.detals,
        },
      });
    }

    console.error({
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.sub.id,
      "validated-body": req.validatedBody,
      body: req.body,
      "validated-params": req.validatedParams,
      params: JSON.stringify(req.params),
    });

    return res.status(500).json({
      ok: false,
      error: {
        message: "Internal server error",
        code: ErrorCodes.INTERNAL_ERROR,
      },
    });
  };
}
