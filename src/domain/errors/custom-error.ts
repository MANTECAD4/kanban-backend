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

  MISSING_SESSION = "MISSING_SESSION",
  BAD_SESSION = "BAD_SESSION",
  SESSION_REVOKED = "SESSION_REVOKED",
}

type ErrorDetails = Record<string, string[] | undefined>;

interface ErrorProps {
  statusCode: number;
  title: string;
  message: string;
  code: ErrorCodes;
  details: ErrorDetails | null;
}

type VariableErrorProps = Omit<ErrorProps, "statusCode">;

export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly title: string;
  public readonly message: string;
  public readonly code: ErrorCodes;
  private readonly details: ErrorDetails | null;
  private constructor(props: ErrorProps) {
    const { statusCode, title, message, code, details } = props;
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    this.message = message;
    this.code = code;
    this.details = details;
  }

  public static badRequest(props: VariableErrorProps) {
    const { title, message, details, code } = props;
    return new CustomError({ statusCode: 400, message, code, title, details });
  }
  public static unauthorized(props: VariableErrorProps) {
    const { title, message, details, code } = props;
    return new CustomError({
      statusCode: 401,
      message,
      code,
      title,
      details,
    });
  }
  public static forbidden(props: VariableErrorProps) {
    const { title, message, details, code } = props;
    return new CustomError({
      statusCode: 403,
      message,
      code,
      title,
      details,
    });
  }
  public static notFound(props: VariableErrorProps) {
    const { title, message, details, code } = props;
    return new CustomError({
      statusCode: 404,
      message,
      code,
      title,
      details,
    });
  }
  // public static internalServerr(message: string, code: ErrorCodes) {
  //   return new CustomError(500, message, code);
  // }

  public static handleError = (error: any, req: Request, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        ok: false,
        error: {
          title: error.title,
          message: error.message,
          code: error.code,
          details: error.details,
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
