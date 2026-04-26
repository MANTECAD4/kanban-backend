import { Request, Response } from "express";
import { GetTasksUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { CreateTaskDto } from "../../application/dtos";

export class KanbanTaskController {
  constructor(
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
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
        data: req.validatedBody as CreateTaskDto,
      })
      .then((result) =>
        res
          .status(201)
          .json({ message: "Task created succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public update = (req: Request, res: Response) => {
    return res.json(`update -> ${req.params.taskId}`);
  };
  public delete = (req: Request, res: Response) => {
    return res.json(`delete -> ${req.params.taskId}`);
  };
}
