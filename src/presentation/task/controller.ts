import { Request, Response } from "express";
import { GetKanbanTasksUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateKanbanTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { CreateKanbanTaskDto } from "../../application/dtos";
import { DeleteKanbanTaskUseCase } from "../../application/use-cases/task/delete-task.use-case";

export class KanbanTaskController {
  constructor(
    private readonly getTasksUseCase: GetKanbanTasksUseCase,
    private readonly createTaskUseCase: CreateKanbanTaskUseCase,
    private readonly deleteTaskUseCase: DeleteKanbanTaskUseCase,
  ) {}
  public getAll = (req: Request, res: Response) => {
    this.getTasksUseCase
      .execute(req.user!.sub.id, req.validatedParams!.columnId)
      .then((result) =>
        res.json({ message: "Tasks loaded succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public create = (req: Request, res: Response) => {
    this.createTaskUseCase
      .execute({
        userId: req.user!.sub.id,
        columnId: req.validatedParams!.columnId,
        data: req.validatedBody as CreateKanbanTaskDto,
      })
      .then((result) =>
        res
          .status(201)
          .json({ message: "Task created succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };

  public update = (req: Request, res: Response) => {
    return res.json(`update -> ${req.validatedParams!.taskId}`);
  };

  public delete = (req: Request, res: Response) => {
    this.deleteTaskUseCase
      .execute(req.user!.sub.id, req.validatedParams!.taskId)
      .then((result) =>
        res.json({ message: "Task deleted succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
}
