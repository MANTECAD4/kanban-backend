import { SubmitCategorySchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";

export class CategoryMiddlewares {
  public submitCategoryDataValidation = dataValidationMiddlewareFactory(
    SubmitCategorySchema,
    "Invalid category data",
    RequestValidationTarget.BODY,
  );

  public categoryIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("categoryId"),
    "Invalid status category id provided.",
    RequestValidationTarget.PARAMS,
  );
}
