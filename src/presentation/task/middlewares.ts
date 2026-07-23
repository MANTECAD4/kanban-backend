import { NextFunction, Request, Response } from "express";
import { SubmitTaskSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  ObjectWithOrderSchema,
  ParamsWithIdSchema,
  ParamsWithSlugSchema,
} from "../shared/schemas/shared-schemas";
import { TaskRepository } from "../../domain/repositories";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

interface Dependencies {
  taskRepository: TaskRepository;
}

export class TaskMiddlewares {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: Dependencies) {
    const { taskRepository } = dependencies;
    this.taskRepository = taskRepository;
  }
  public taskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("taskId"),
    `Invalid task id provided`,
    RequestValidationTarget.PARAMS,
  );
  public taskSlugParamValidation = dataValidationMiddlewareFactory(
    ParamsWithSlugSchema("taskSlug"),
    `Invalid task slug provided`,
    RequestValidationTarget.PARAMS,
  );

  public submitTaskDataValidation = dataValidationMiddlewareFactory(
    SubmitTaskSchema,
    "Invalid data recieved. Task creation failed",
    RequestValidationTarget.BODY,
  );

  public changeCategoryDataValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("categoryId"),
    "Invalid category id provided",
    RequestValidationTarget.BODY,
  );

  public changeOrderValidation = dataValidationMiddlewareFactory(
    ObjectWithOrderSchema(),
    "Invalid new order value",
    RequestValidationTarget.BODY,
  );

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;

      const searchKey =
        req.validatedParams!.taskId ?? req.validatedParams!.taskSlug;

      const relatedTask = await this.taskRepository.checkRelation(
        userId,
        searchKey,
      );

      if (!relatedTask) {
        throw CustomError.forbidden({
          message: "Forbidden",
          title: "User doesn't have access to this task",
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
