import { Router } from "express";
import { TaskController } from "./controller";
import { TaskMiddlewares } from "./middlewares";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../domain/repositories";
import { GetTasksByColumnUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CreateTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { StatusColumnsMiddlewares } from "../status-column/middlewares";
import { DeleteTaskUseCase } from "../../application/use-cases/task/delete-task.use-case";
import { UpdateDataInTaskUseCase } from "../../application/use-cases/task/update-data-task.use-case";
import { UpdateStatusColumnInTaskUseCase } from "../../application/use-cases/task/update-column-task.use-case";

export class TaskRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: TaskRepository,
  ) {}

  public get routes(): Router {
    const router = Router({ mergeParams: true });

    const getTasksUseCase = new GetTasksByColumnUseCase(
      this.statusColumnRepository,
      this.kanbanTaskRepository,
    );

    const createTaskUseCase = new CreateTaskUseCase(
      this.statusColumnRepository,
      this.kanbanTaskRepository,
    );

    const updateDataTask = new UpdateDataInTaskUseCase(
      this.kanbanTaskRepository,
    );
    const updateColumnTask = new UpdateStatusColumnInTaskUseCase(
      this.kanbanTaskRepository,
      this.statusColumnRepository,
    );

    const deleteTaskUsecase = new DeleteTaskUseCase(this.kanbanTaskRepository);
    const controller = new TaskController(
      getTasksUseCase,
      createTaskUseCase,
      updateDataTask,
      updateColumnTask,
      deleteTaskUsecase,
    );

    router.get(
      "/in-column/:columnId",
      [StatusColumnsMiddlewares.columnIdParamValidation],
      controller.getAllByColumn,
    );

    router.post(
      "/in-column/:columnId",
      [
        StatusColumnsMiddlewares.columnIdParamValidation,
        TaskMiddlewares.createTaskDataValidation,
      ],
      controller.create,
    );

    router.put(
      "/:taskId",
      [
        TaskMiddlewares.taskIdParamValidation,
        TaskMiddlewares.updateTaskDataValidation,
      ],
      controller.updateData,
    );
    router.put(
      "/:taskId/status-column",
      [
        TaskMiddlewares.taskIdParamValidation,
        TaskMiddlewares.updateTaskColumnDataValidation,
      ],
      controller.updateStatusColumn,
    );

    router.delete(
      "/:taskId",
      [TaskMiddlewares.taskIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
