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

  public getAllByTask = (req: Request, res: Response) => {
    this.getSubtasksUseCase
      .execute(req.user!.sub.id, req.validatedParams!.taskId)
      .then((result) => res.json({ message: "", ...result }))
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public create = (req: Request, res: Response) => {
    this.createSubtaskUsecase
      .execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody! as CreateSubtaskDto,
      })
      .then((result) => res.json({ message: "", ...result }))
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public update = (req: Request, res: Response) => {
    this.updateSubtaskUseCase
      .execute({
        userId: req.user!.sub.id,
        subtaskId: req.validatedParams!.subtaskId,
        data: req.validatedBody as UpdateSubtaskDto,
      })
      .then((result) => res.json({ message: "", ...result }))
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public delete = (req: Request, res: Response) => {
    this.deleteSubtaskUseCase
      .execute(req.user!.sub.id, req.validatedParams!.subtaskId)
      .then((result) => res.json({ message: "", ...result }))
      .catch((error) => CustomError.handleError(error, req, res));
  };
}
