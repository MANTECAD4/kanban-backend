import { CreateBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../global/factories/data-validation-middleware";

export class BoardMiddlewares {
  public static createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
    RequestValidationTarget.BODY,
  );
}
