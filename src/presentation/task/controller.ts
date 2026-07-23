import { Request, Response } from "express";
import { GetTasksByColumnUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { SubmitTaskDto } from "../../application/dtos";
import { DeleteTaskUseCase } from "../../application/use-cases/task/delete-task.use-case";
import { UpdateStatusColumnInTaskUseCase } from "../../application/use-cases/task/update-column-task.use-case";
import { UpdateDataInTaskUseCase } from "../../application/use-cases/task/update-data-task.use-case";
import { UpdateOrderInTaskUseCase } from "../../application/use-cases/task";
import { GetTaskBySlugUseCase } from "../../application/use-cases/task/get-task-by-slug.use-case";

export class TaskController {
  constructor(
    private readonly getTasksUseCase: GetTasksByColumnUseCase,
    private readonly getTaskBySlugUseCase: GetTaskBySlugUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateDataInTaskUseCase,
    private readonly updateTaskCategoryUseCase: UpdateStatusColumnInTaskUseCase,
    private readonly updateOrderTaskUseCase: UpdateOrderInTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}

  public getAllByCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.getTasksUseCase.execute(
        req.validatedParams!.categoryId,
      );
      return res.json({
        ok: true,
        message: "Tasks loaded succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public getBySlug = async (req: Request, res: Response) => {
    try {
      const result = await this.getTaskBySlugUseCase.execute(
        req.validatedParams!.categoryId,
        req.validatedParams!.taskSlug,
      );
      return res.json({
        ok: true,
        message: "Task loaded successfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createTaskUseCase.execute(
        req.validatedParams!.categoryId,
        req.validatedBody as SubmitTaskDto,
      );
      return res
        .status(201)
        .json({ ok: true, message: "Task created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public updateData = async (req: Request, res: Response) => {
    try {
      const result = await this.updateTaskUseCase.execute(
        req.validatedParams!.taskId,
        req.validatedBody! as SubmitTaskDto,
      );
      return res.json({
        ok: true,
        message: `Task content updated succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public updateCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.updateTaskCategoryUseCase.execute(
        req.validatedParams!.taskId,
        req.validatedBody!.categoryId,
      );
      return res.json({
        ok: true,
        message: "Task status updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public updateOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.updateOrderTaskUseCase.execute(
        req.validatedParams!.taskId,
        req.validatedBody!.order,
      );
      return res.json({
        ok: true,
        message: "Task order updated succesfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteTaskUseCase.execute(
        req.validatedParams!.taskId,
      );
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
