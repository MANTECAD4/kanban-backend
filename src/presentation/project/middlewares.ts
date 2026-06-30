import { CreateProjectSchema } from "../../application/dtos/project.dto";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";

export class ProjectMiddlewares {
  constructor() {}
  public createProjectDataValidation = dataValidationMiddlewareFactory(
    CreateProjectSchema,
    "Invalid data recieved. Project creation failed",
    RequestValidationTarget.BODY,
  );
}
