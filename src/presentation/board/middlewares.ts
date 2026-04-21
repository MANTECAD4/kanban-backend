import { CreateBoardSchema, GetBoardsSchema } from "../../application/dtos";
import { dataValidationMiddlewareFactory } from "../shared/factories/data-validation-middleware";

export class BoardMiddlewares {
  public static createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
  );

  public static getBoardsDataValidation = dataValidationMiddlewareFactory(
    GetBoardsSchema,
    "Provided User id is not valid.",
  );
}
