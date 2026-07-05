import { SubmitProjectSchema } from "../../application/dtos/project.dto";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  ParamsWithIdSchema,
  ParamsWithSlugSchema,
} from "../shared/schemas/int-id.schema";

export class ProjectMiddlewares {
  constructor() {}
  public submitProjectDataValidation = dataValidationMiddlewareFactory(
    SubmitProjectSchema,
    "Invalid data recieved",
    RequestValidationTarget.BODY,
  );

  public validateProjectSlug = dataValidationMiddlewareFactory(
    ParamsWithSlugSchema("projectSlug"),
    "Invalid project slug provided",
    RequestValidationTarget.PARAMS,
  );

  public validateProjectId = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("projectId"),
    "Invalid project id referenced",
    RequestValidationTarget.PARAMS,
  );
}
