import { Request, Response } from "express";
import { CreateStatusColumnUseCase } from "../../application/use-cases/status-column/create-column.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import {
  CreateStatusColumnDto,
  UpdateStatusColumnDto,
} from "../../application/dtos";
import { GetStatusColumnsUseCase } from "../../application/use-cases/status-column/get-columns.use-case";
import { UpdateStatusColumnUseCase } from "../../application/use-cases/status-column/update-column.use-case";
import { DeleteStatusColumnUseCase } from "../../application/use-cases/status-column/delete-column.use-case";

export class StatusColumnsController {
  constructor(
    private readonly getStatusColumnsUsecase: GetStatusColumnsUseCase,
    private readonly createStatusColumnUsecase: CreateStatusColumnUseCase,
    private readonly updateStatusColumnsUsecase: UpdateStatusColumnUseCase,
    private readonly deleteStatusColumnsUsecase: DeleteStatusColumnUseCase,
  ) {}

  public getAll = (req: Request, res: Response) => {
    this.getStatusColumnsUsecase
      .execute(req.user!, req.validatedParams!.boardId)
      .then((result) =>
        res.json({ message: `Status columns loaded succesfully`, ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public create = (req: Request, res: Response) => {
    this.createStatusColumnUsecase
      .execute(
        req.user!,
        req.validatedParams!.boardId,
        req.validatedBody! as CreateStatusColumnDto,
      )
      .then((result) =>
        res
          .status(201)
          .json({ message: `Status column created succesfully`, ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };

  public update = (req: Request, res: Response) => {
    this.updateStatusColumnsUsecase
      .execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId,
        columnId: req.validatedParams!.columnId,

        data: req.validatedBody as UpdateStatusColumnDto,
      })
      .then((result) =>
        res.json({ message: `Column with updated succesfully`, ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };

  public delete = (req: Request, res: Response) => {
    this.deleteStatusColumnsUsecase
      .execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId,
        columnId: req.validatedParams!.columnId,
      })
      .then((result) =>
        res.json({ message: `Status column deleted succesfully`, ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
}
