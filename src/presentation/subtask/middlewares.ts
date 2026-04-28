import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";
import {
  CreateSubtaskSchema,
  UpdateSubtaskSchema,
} from "../../application/dtos/subtask.dto";

export class KanbanSubtaskMiddlewares {
  public static subtaskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("subtaskId"),
    `Invalid subtask id`,
    RequestValidationTarget.PARAMS,
  );

  public static createSubtaskDataValidation = dataValidationMiddlewareFactory(
    CreateSubtaskSchema,
    `Invalid data required to create a subtask`,
    RequestValidationTarget.BODY,
  );
  public static updateSubtaskDataValidation = dataValidationMiddlewareFactory(
    UpdateSubtaskSchema,
    `Invalid data required to update a subtask`,
    RequestValidationTarget.BODY,
  );
}
