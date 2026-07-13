import { SubmitStatusColumnSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class StatusColumnMiddlewares {
  public submitStatusColumnDataValidation = dataValidationMiddlewareFactory(
    SubmitStatusColumnSchema,
    "Invalid data for status column. Creation failed",
    RequestValidationTarget.BODY,
  );

  public columnIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("columnId"),
    "Invalid status column id provided.",
    RequestValidationTarget.PARAMS,
  );
}
