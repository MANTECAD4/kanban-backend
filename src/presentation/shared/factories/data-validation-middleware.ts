import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";

export const dataValidationMiddlewareFactory = (
  schema: ZodObject,
  mainErrorMsg: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        message: mainErrorMsg,
        error: {
          prettify: z.prettifyError(result.error),
          flatten: z.flattenError(result.error),
        },
      });

    req.body = result.data;
    next();
  };
};
