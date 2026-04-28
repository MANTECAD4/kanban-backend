import {
  CreateTaskSchema,
  UpdateColumnInTaskSchema,
  UpdateDataInTaskSchema,
} from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class TaskMiddlewares {
  public static taskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("taskId"),
    `Invalid task id provided`,
    RequestValidationTarget.PARAMS,
  );

  public static createTaskDataValidation = dataValidationMiddlewareFactory(
    CreateTaskSchema,
    "Invalid data recieved. Task creation failed",
    RequestValidationTarget.BODY,
  );

  public static updateTaskDataValidation = dataValidationMiddlewareFactory(
    UpdateDataInTaskSchema,
    "Invalida data recieved. Task update failed",
    RequestValidationTarget.BODY,
  );

  public static updateTaskColumnDataValidation =
    dataValidationMiddlewareFactory(
      UpdateColumnInTaskSchema,
      `Invalid data recieved. TaskUpdate failed`,
      RequestValidationTarget.BODY,
    );
}
