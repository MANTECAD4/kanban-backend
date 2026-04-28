import {
  CreateKanbanTaskSchema,
  UpdateColumnInKanbanTaskSchema,
  UpdateDatainKanbanTaskSchema,
} from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class KanbanTaskMiddlewares {
  public static taskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("taskId"),
    `Invalid task id provided`,
    RequestValidationTarget.PARAMS,
  );

  public static createTaskDataValidation = dataValidationMiddlewareFactory(
    CreateKanbanTaskSchema,
    "Invalid data recieved. Task creation failed",
    RequestValidationTarget.BODY,
  );

  public static updateTaskDataValidation = dataValidationMiddlewareFactory(
    UpdateDatainKanbanTaskSchema,
    "Invalida data recieved. Task update failed",
    RequestValidationTarget.BODY,
  );

  public static updateTaskColumnDataValidation =
    dataValidationMiddlewareFactory(
      UpdateColumnInKanbanTaskSchema,
      `Invalid data recieved. TaskUpdate failed`,
      RequestValidationTarget.BODY,
    );
}
