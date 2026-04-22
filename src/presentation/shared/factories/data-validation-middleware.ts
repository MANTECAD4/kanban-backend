import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";
import { TokenPayload } from "../../../domain/services";

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
    let targetObject: Record<string, any>;

    switch (target) {
      case RequestValidationTarget.BODY:
        targetObject = req.body;
        break;
      case RequestValidationTarget.PARAMS:
        targetObject = req.params;
        break;
      case RequestValidationTarget.QUERY:
        targetObject = req.query;
        break;
      case RequestValidationTarget.USER:
        targetObject = req.user!;
        break;

      default:
        targetObject = req.body;
        break;
    }

    const result = schema.safeParse(targetObject);
    if (!result.success)
      return res.status(400).json({
        message: mainErrorMsg,
        error: {
          prettify: z.prettifyError(result.error),
          flatten: z.flattenError(result.error),
        },
      });

    req[target] = result.data;
    next();
  };
};
