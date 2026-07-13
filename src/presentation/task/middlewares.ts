import { SubmitTaskSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class TaskMiddlewares {
  public taskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("taskId"),
    `Invalid task id provided`,
    RequestValidationTarget.PARAMS,
  );

  public submitTaskDataValidation = dataValidationMiddlewareFactory(
    SubmitTaskSchema,
    "Invalid data recieved. Task creation failed",
    RequestValidationTarget.BODY,
  );
}
