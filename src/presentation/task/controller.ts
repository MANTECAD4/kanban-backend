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

  public getAllByColumn = async (req: Request, res: Response) => {
    try {
      const result = await this.getTasksUseCase.execute({
        userId: req.user!.sub.id,
        columnId: req.validatedParams!.columnId,
      });
      return res.json({
        ok: true,
        message: "Tasks loaded succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createTaskUseCase.execute({
        userId: req.user!.sub.id,
        columnId: req.validatedParams!.columnId,
        data: req.validatedBody as CreateTaskDto,
      });
      return res
        .status(201)
        .json({ ok: true, message: "Task created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public updateData = async (req: Request, res: Response) => {
    try {
      const result = await this.updateDataInKanbanTaskUseCase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody!,
      });
      return res.json({
        ok: true,
        message: `Task content updated succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public updateStatusColumn = async (req: Request, res: Response) => {
    try {
      const result = await this.updateColumnInKanbanTaskUseCase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
        data: req.validatedBody! as UpdateColumnInTaskDto,
      });
      return res.json({
        ok: true,
        message: "Task status updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteTaskUseCase.execute({
        userId: req.user!.sub.id,
        taskId: req.validatedParams!.taskId,
      });
      return res.json({
        ok: true,
        message: "Task deleted succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
