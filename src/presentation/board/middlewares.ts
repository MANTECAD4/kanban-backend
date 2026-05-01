import { CreateBoardSchema, UpdateBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class BoardMiddlewares {
  public createBoardDataValidation = dataValidationMiddlewareFactory(
    CreateBoardSchema,
    "Invalid data recieved. Board creation failed.",
    RequestValidationTarget.BODY,
  );
  public updateBoardDataValidation = dataValidationMiddlewareFactory(
    UpdateBoardSchema,
    "Invalid data recieved. Board update failed.",
    RequestValidationTarget.BODY,
  );

  public boardIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("boardId"),
    "Invalid board id provided.",
    RequestValidationTarget.PARAMS,
  );
}
