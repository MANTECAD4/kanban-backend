import { CreateStatusColumnSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";

export class StatusColumnsMiddlewares {
  static createStatusColumnDataValidation = dataValidationMiddlewareFactory(
    CreateStatusColumnSchema,
    "Invalid data for status column. Creation failed",
    RequestValidationTarget.BODY,
  );
}
