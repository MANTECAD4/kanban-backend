import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";

export enum RequestValidationTarget {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
  USER = "user",
}

export const dataValidationMiddlewareFactory = (
  schema: ZodObject,
  mainErrorMsg: string,
  target: RequestValidationTarget,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetObject = req[target];

    const result = schema.safeParse(targetObject);
    if (!result.success)
      return res.status(400).json({
        message: mainErrorMsg,
        error: {
          prettify: z.prettifyError(result.error),
          flatten: z.flattenError(result.error),
        },
      });

    switch (target) {
      case RequestValidationTarget.BODY:
        req.validatedBody = result.data;
        break;
      case RequestValidationTarget.PARAMS:
        req.validatedParams = result.data;
        break;
      case RequestValidationTarget.QUERY:
        req.validatedQuery = result.data;
        break;
      case RequestValidationTarget.USER:
        req.validatedUser = result.data;
        break;

      default:
        req.validatedBody = result.data;
        break;
    }
    next();
  };
};
