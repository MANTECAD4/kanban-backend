import { CreateBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class BoardMiddlewares {
  public static createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
    RequestValidationTarget.BODY,
  );

  public static existingBoardId = dataValidationMiddlewareFactory(
    ParamsWithIdSchema,
    "Invalid board id provided. Board update failed.",
    RequestValidationTarget.PARAMS,
  );
}
