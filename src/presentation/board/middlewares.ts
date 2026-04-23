import { CreateBoardSchema, UpdateBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class BoardsMiddlewares {
  public static createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
    RequestValidationTarget.BODY,
  );
  public static updateBoardDataValidation = dataValidationMiddlewareFactory(
    UpdateBoardSchema,
    "Invalid data recieved. Board update failed.",
    RequestValidationTarget.BODY,
  );

  public static boardIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("boardId"),
    "Invalid board id provided.",
    RequestValidationTarget.PARAMS,
  );
}
