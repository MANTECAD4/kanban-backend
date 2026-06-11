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

interface CustomErrorProps {
  statusCode: number;
  title: string;
  message: string;
  code: ErrorCodes;
  details: ErrorDetails | null;
}
export class CustomError extends Error {
  public readonly statusCode: number;
  public readonly title: string;
  public readonly message: string;
  public readonly code: ErrorCodes;
  private readonly details: ErrorDetails | null;
  private constructor(props: CustomErrorProps) {
    const { statusCode, title, message, code, details } = props;
    super(message);
    this.statusCode = statusCode;
    this.title = title;
    this.message = message;
    this.code = code;
    this.details = details;
  }

  public static badRequest(
    message: string,
    code: ErrorCodes,
    title: string,
    details: ErrorDetails,
  ) {
    return new CustomError({ statusCode: 400, message, code, title, details });
  }
  public static unauthorized(message: string, code: ErrorCodes, title: string) {
    return new CustomError({
      statusCode: 401,
      message,
      code,
      title,
      details: null,
    });
  }
  public static forbidden(message: string, code: ErrorCodes, title: string) {
    return new CustomError({
      statusCode: 403,
      message,
      code,
      title,
      details: null,
    });
  }
  public static notFound(message: string, code: ErrorCodes, title: string) {
    return new CustomError({
      statusCode: 404,
      message,
      code,
      title,
      details: null,
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
