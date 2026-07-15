import { NextFunction, Request, Response } from "express";
import { SubmitProjectSchema } from "../../application/dtos/project.dto";
import { ProjectRepository } from "../../domain/repositories/project.repository";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  ParamsWithIdSchema,
  ParamsWithSlugSchema,
} from "../shared/schemas/int-id.schema";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

interface Dependencies {
  projectRepository: ProjectRepository;
}

export class ProjectMiddlewares {
  private readonly projectRepository: ProjectRepository;
  constructor(dependencies: Dependencies) {
    const { projectRepository } = dependencies;
    this.projectRepository = projectRepository;
  }
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

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;
      const searchKey =
        req.validatedParams!.projectId ?? req.validatedParams!.projectSlug;
      const existRelation = await this.projectRepository.checkRelation(
        userId,
        searchKey,
      );

      if (!existRelation) {
        throw CustomError.forbidden({
          title: "Forbidden",
          message: "User doesn't have access to referenced project",
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
