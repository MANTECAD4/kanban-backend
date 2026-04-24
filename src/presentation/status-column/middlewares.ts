import {
  CreateStatusColumnSchema,
  UpdateStatusColumnSchema,
} from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class StatusColumnsMiddlewares {
  static createStatusColumnDataValidation = dataValidationMiddlewareFactory(
    CreateStatusColumnSchema,
    "Invalid data for status column. Creation failed",
    RequestValidationTarget.BODY,
  );

  static updateStatusCOlumnDataValidation = dataValidationMiddlewareFactory(
    UpdateStatusColumnSchema,
    "Invalid data for updating status column",
    RequestValidationTarget.BODY,
  );
  static columnIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("columnId"),
    "Invalid status column id provided.",
    RequestValidationTarget.PARAMS,
  );
}
