import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/shared-schemas";
import {
  ChangeSubtaskStatusSchema,
  SubmitSubtaskSchema,
} from "../../application/dtos/subtask.dto";
import { NextFunction, Request, Response } from "express";
import { SubtaskRepository } from "../../domain/repositories";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

interface Dependencies {
  subtaskRepository: SubtaskRepository;
}

export class SubtaskMiddlewares {
  private readonly subtaskRepository: SubtaskRepository;
  constructor(dependencies: Dependencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public subtaskIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("subtaskId"),
    `Invalid subtask id`,
    RequestValidationTarget.PARAMS,
  );

  public submitSubtaskDataValidation = dataValidationMiddlewareFactory(
    SubmitSubtaskSchema,
    `Invalid data provided`,
    RequestValidationTarget.BODY,
  );

  public changeSubtaskStatusValidation = dataValidationMiddlewareFactory(
    ChangeSubtaskStatusSchema,
    `Invalid completion status provided`,
    RequestValidationTarget.BODY,
  );

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;
      const searchKey = req.validatedParams!.subtaskId;

      const relatedSubtask = await this.subtaskRepository.checkRelation(
        userId,
        searchKey,
      );
      if (!relatedSubtask) {
        throw CustomError.forbidden({
          message: "Forbidden",
          title: "User doesn't have access to this subtask",
          code: ErrorCodes.FORBIDDEN,
          details: null,
        });
      }
      next();
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
