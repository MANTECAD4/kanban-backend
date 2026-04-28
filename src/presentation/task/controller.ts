import { Request, Response } from "express";
import { GetTasksByColumnUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { CreateTaskDto, UpdateColumnInTaskDto } from "../../application/dtos";
import { DeleteTaskUseCase } from "../../application/use-cases/task/delete-task.use-case";
import { UpdateStatusColumnInTaskUseCase } from "../../application/use-cases/task/update-column-task.use-case";
import { UpdateDataInTaskUseCase } from "../../application/use-cases/task/update-data-task.use-case";

export class TaskController {
  constructor(
    private readonly getTasksUseCase: GetTasksByColumnUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateDataInKanbanTaskUseCase: UpdateDataInTaskUseCase,
    private readonly updateColumnInKanbanTaskUseCase: UpdateStatusColumnInTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  public getAllByColumn = (req: Request, res: Response) => {
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
        data: req.validatedBody as CreateTaskDto,
      })
      .then((result) =>
        res
          .status(201)
          .json({ message: "Task created succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };

  public updateData = (req: Request, res: Response) => {
    this.updateDataInKanbanTaskUseCase
      .execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody!,
      })
      .then((result) =>
        res.json({ message: `Task content updated succesfully`, ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };

  public updateStatusColumn = (req: Request, res: Response) => {
    this.updateColumnInKanbanTaskUseCase
      .execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody! as UpdateColumnInTaskDto,
      })
      .then((result) =>
        res.json({ message: "Task status updated succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
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
