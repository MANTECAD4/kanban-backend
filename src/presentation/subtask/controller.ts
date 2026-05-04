import { Request, Response } from "express";
import { GetSubtasksUseCase } from "../../application/use-cases/subtask/get-subtasks.use-case";
import { CreateSubtaskUseCase } from "../../application/use-cases/subtask/create-subtask.use-case";
import { UpdateSubtaskUseCase } from "../../application/use-cases/subtask/update-subtask.use-case";
import { DeleteSubtaskUseCase } from "../../application/use-cases/subtask/delete-subtask.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import {
  CreateSubtaskDto,
  UpdateSubtaskDto,
} from "../../application/dtos/subtask.dto";

export class SubtaskController {
  constructor(
    private readonly getSubtasksUseCase: GetSubtasksUseCase,
    private readonly createSubtaskUsecase: CreateSubtaskUseCase,
    private readonly updateSubtaskUseCase: UpdateSubtaskUseCase,
    private readonly deleteSubtaskUseCase: DeleteSubtaskUseCase,
  ) {}

  public getAllByTask = async (req: Request, res: Response) => {
    try {
      const result = await this.getSubtasksUseCase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
      });
      return res.json({
        ok: true,
        message: "Subtasks loaded succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createSubtaskUsecase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody! as CreateSubtaskDto,
      });
      return res.json({
        ok: true,
        message: "Subtask created succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateSubtaskUseCase.execute({
        userId: req.user!.sub.id,
        subtaskId: req.validatedParams!.subtaskId,
        data: req.validatedBody as UpdateSubtaskDto,
      });
      return res.json({
        ok: true,
        message: "Subtask updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteSubtaskUseCase.execute({
        userId: req.user!.sub.id,
        subtaskId: req.validatedParams!.subtaskId,
      });
      return res.json({
        ok: true,
        message: "Subtask deleted succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
