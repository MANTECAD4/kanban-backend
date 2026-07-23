import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/shared-schemas";
import {
  CreateSubtaskSchema,
  UpdateSubtaskSchema,
} from "../../application/dtos/subtask.dto";

export class SubtaskMiddlewares {
  public subtaskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("subtaskId"),
    `Invalid subtask id`,
    RequestValidationTarget.PARAMS,
  );

  public createSubtaskDataValidation = dataValidationMiddlewareFactory(
    CreateSubtaskSchema,
    `Invalid data required to create a subtask`,
    RequestValidationTarget.BODY,
  );
  public updateSubtaskDataValidation = dataValidationMiddlewareFactory(
    UpdateSubtaskSchema,
    `Invalid data required to update a subtask`,
    RequestValidationTarget.BODY,
  );
}
