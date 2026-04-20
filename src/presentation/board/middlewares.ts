import { dataValidationMiddlewareFactory } from "../shared/factories/data-validation-middleware";
import { CreateBoardSchema } from "./schemas";

export class BoardMiddlewares {
  public static createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
  );
}
