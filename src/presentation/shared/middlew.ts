import { ZodObject } from "zod";

export class SharedMiddlewares {
  static dataValidation = (schema: ZodObject, mainErrorMsg: string) => {};
}
