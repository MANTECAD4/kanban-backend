import { SubmitBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class BoardMiddlewares {
  public submitBoardDataValidation = dataValidationMiddlewareFactory(
    SubmitBoardSchema,
    "Invalid data recieved",
    RequestValidationTarget.BODY,
  );

  public boardIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("boardId"),
    "Invalid board id provided.",
    RequestValidationTarget.PARAMS,
  );
}
