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

export class StatusColumnController {
  constructor(
    private readonly getStatusColumnsUsecase: GetStatusColumnsUseCase,
    private readonly createStatusColumnUsecase: CreateStatusColumnUseCase,
    private readonly updateStatusColumnsUsecase: UpdateStatusColumnUseCase,
    private readonly deleteStatusColumnsUsecase: DeleteStatusColumnUseCase,
  ) {}

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this.getStatusColumnsUsecase.execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId,
      });
      return res.json({
        message: `Status columns loaded succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createStatusColumnUsecase.execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId,
        createStatusColumnDto: req.validatedBody! as CreateStatusColumnDto,
      });

      return res
        .status(201)
        .json({ message: `Status column created succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateStatusColumnsUsecase.execute({
        userId: req.user!.sub.id,
        columnId: req.validatedParams!.columnId,

        data: req.validatedBody as UpdateStatusColumnDto,
      });
      return res.json({
        message: `Column with updated succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteStatusColumnsUsecase.execute({
        userId: req.user!.sub.id,
        columnId: req.validatedParams!.columnId,
      });

      return res.json({
        message: `Status column deleted succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
