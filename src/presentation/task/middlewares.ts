import { GetTasksSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";

export class TaskMiddlewares {
  static getTasksDataValidation = dataValidationMiddlewareFactory(
    GetTasksSchema,
    "Invalid board Id specified. Tasks query failed.",
    RequestValidationTarget.PARAMS,
  );
}
