import { Request, Response } from "express";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateStatusColumnDto } from "../../application/dtos";

export class StatusColumnsController {
  constructor(
    private readonly createStatusColumnUsecase: CreateStatusColumnUseCase,
  ) {}

  public findAll = (req: Request, res: Response) => {
    return res.json(`get tasks ->${JSON.stringify(req.validatedParams)}`);
  };
  public create = (req: Request, res: Response) => {
    this.createStatusColumnUsecase
      .execute(
        req.validatedParams!.boardId,
        req.validatedBody! as CreateStatusColumnDto,
      )
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
