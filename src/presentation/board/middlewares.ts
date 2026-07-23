import { NextFunction, Request, Response } from "express";
import { SubmitBoardSchema } from "../../application/dtos";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import {
  ParamsWithIdSchema,
  ParamsWithSlugSchema,
} from "../shared/schemas/shared-schemas";
import { BoardRepository } from "../../domain/repositories";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";

interface Dependencies {
  boardRepository: BoardRepository;
}

export class BoardMiddlewares {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: Dependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }

  public submitBoardDataValidation = dataValidationMiddlewareFactory(
    SubmitBoardSchema,
    "Invalid data recieved",
    RequestValidationTarget.BODY,
  );

  public boardIdParamValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("boardId"),
    "Invalid board id provided.",
    RequestValidationTarget.PARAMS,
  );

  public boardSlugParamValidation = dataValidationMiddlewareFactory(
    ParamsWithSlugSchema("boardSlug"),
    "Invalid board slug provided",
    RequestValidationTarget.PARAMS,
  );

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;
      const boardId =
        req.validatedParams!.boardId ?? req.validatedParams!.boardSlug;
      const relatedBoard = this.boardRepository.checkRelation(userId, boardId);
      if (!relatedBoard) {
        throw CustomError.forbidden({
          message: "Forbbiden",
          title: "User doesn't have access to specified board",
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
