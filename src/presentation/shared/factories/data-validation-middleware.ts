import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";
import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";

export enum RequestValidationTarget {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
}

export const dataValidationMiddlewareFactory = (
  schema: ZodObject,
  mainErrorMsg: string,
  target: RequestValidationTarget,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetObject = req[target];

    const result = schema.safeParse(targetObject);
    if (!result.success) {
      const error = CustomError.badRequest({
        title: "Invalid data",
        message: mainErrorMsg,
        code: ErrorCodes.INVALID_DATA,
        details: {
          ...z.flattenError(result.error).fieldErrors,
          formErrors: z.flattenError(result.error).formErrors,
        },
      });

      return CustomError.handleError(error, req, res);
    }

    switch (target) {
      case RequestValidationTarget.BODY:
        req.validatedBody = { ...req.validatedBody, ...result.data };

        break;
      case RequestValidationTarget.PARAMS:
        req.validatedParams = { ...req.validatedParams, ...result.data };

        break;
      case RequestValidationTarget.QUERY:
        req.validatedQuery = { ...req.validatedQuery, ...result.data };

        break;

      default:
        req.validatedBody = { ...req.validatedBody, ...result.data };

        break;
    }
    next();
  };
};
