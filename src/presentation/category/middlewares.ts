import { NextFunction, Request, Response } from "express";
import { SubmitCategorySchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/int-id.schema";
import { CategoryRepository } from "../../domain/repositories";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

interface Dependencies {
  categoryRepository: CategoryRepository;
}

export class CategoryMiddlewares {
  private readonly categoryRepository: CategoryRepository;
  constructor(dependencies: Dependencies) {
    const { categoryRepository } = dependencies;
    this.categoryRepository = categoryRepository;
  }
  public submitCategoryDataValidation = dataValidationMiddlewareFactory(
    SubmitCategorySchema,
    "Invalid category data",
    RequestValidationTarget.BODY,
  );

  public categoryIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("categoryId"),
    "Invalid category id provided.",
    RequestValidationTarget.PARAMS,
  );

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;
      const categoryId = req.validatedParams!.categoryId;

      const relatedCategory = await this.categoryRepository.checkRelation(
        userId,
        categoryId,
      );

      if (!relatedCategory) {
        throw CustomError.forbidden({
          message: "Forbidden",
          title: "User doesn't have access to specified category",
          code: ErrorCodes.FORBIDDEN,
          details: null,
        });
      }

      next();
    } catch (error) {
      CustomError.handleError(error, req, res);
    }
  };
}
