import { Request, Response } from "express";
import { GetTasksUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CustomError } from "../../domain/errors/custom-error";

export class KanbanTaskController {
  constructor(private readonly getTasksUseCase: GetTasksUseCase) {}
  public getAll = (req: Request, res: Response) => {
    this.getTasksUseCase
      .execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId,
        columnId: req.validatedParams!.columnId,
      })
      .then((result) =>
        res.json({ message: "Tasks loaded succesfully", ...result }),
      )
      .catch((error) => CustomError.handleError(error, req, res));
  };
  public create = (req: Request, res: Response) => {
    return res.json(`create`);
  };
  public update = (req: Request, res: Response) => {
    return res.json(`update -> ${req.params.taskId}`);
  };
  public delete = (req: Request, res: Response) => {
    return res.json(`delete -> ${req.params.taskId}`);
  };
}
