import { Request, Response } from "express";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import {
  CreateStatusColumnDto,
  UpdateStatusColumnDto,
} from "../../application/dtos";
import { GetStatusColumnsUseCase } from "../../application/use-cases/status-column/get-columns.use-case";
import { UpdateStatusColumnUseCase } from "../../application/use-cases/status-column/update-column.use-case";

export class StatusColumnsController {
  constructor(
    private readonly getStatusColumnsUsecase: GetStatusColumnsUseCase,
    private readonly createStatusColumnUsecase: CreateStatusColumnUseCase,
    private readonly updateStatusColumnsUsecase: UpdateStatusColumnUseCase,
  ) {}

  public findAll = (req: Request, res: Response) => {
    this.getStatusColumnsUsecase
      .execute(req.validatedParams!.boardId)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
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

  public update = (req: Request, res: Response) => {
    this.updateStatusColumnsUsecase
      .execute(
        req.validatedParams!.columnId,
        req.validatedBody as UpdateStatusColumnDto,
      )
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
