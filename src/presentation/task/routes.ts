import { Router } from "express";
import { KanbanTaskController } from "./controller";
import { KanbanTaskMiddlewares } from "./middlewares";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../domain/repositories";
import { GetKanbanTasksUseCase } from "../../application/use-cases/task/get-tasks.use-case";
import { CreateKanbanTaskUseCase } from "../../application/use-cases/task/create-task.use-case";
import { StatusColumnsMiddlewares } from "../status-column/middlewares";
import { DeleteKanbanTaskUseCase } from "../../application/use-cases/task/delete-task.use-case";
import { UpdateDataInKanbanTaskUseCase } from "../../application/use-cases/task/update-data-task.use-case";
import { UpdateStatusColumnInKanbanTaskUseCase } from "../../application/use-cases/task/update-column-task.use-case";

export class KanbanTaskRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: KanbanTaskRepository,
  ) {}

  public get routes(): Router {
    const router = Router({ mergeParams: true });

    const getTasksUseCase = new GetKanbanTasksUseCase(
      this.statusColumnRepository,
      this.kanbanTaskRepository,
    );

    const createTaskUseCase = new CreateKanbanTaskUseCase(
      this.statusColumnRepository,
      this.kanbanTaskRepository,
    );

    const updateDataTask = new UpdateDataInKanbanTaskUseCase(
      this.kanbanTaskRepository,
    );
    const updateColumnTask = new UpdateStatusColumnInKanbanTaskUseCase(
      this.kanbanTaskRepository,
      this.statusColumnRepository,
    );

    const deleteTaskUsecase = new DeleteKanbanTaskUseCase(
      this.kanbanTaskRepository,
    );
    const controller = new KanbanTaskController(
      getTasksUseCase,
      createTaskUseCase,
      updateDataTask,
      updateColumnTask,
      deleteTaskUsecase,
    );

    router.get(
      "/in-column/:columnId",
      [StatusColumnsMiddlewares.columnIdParamValidation],
      controller.getAll,
    );

    router.post(
      "/in-column/:columnId",
      [
        StatusColumnsMiddlewares.columnIdParamValidation,
        KanbanTaskMiddlewares.createTaskDataValidation,
      ],
      controller.create,
    );

    router.put(
      "/:taskId",
      [
        KanbanTaskMiddlewares.taskIdParamValidation,
        KanbanTaskMiddlewares.updateTaskDataValidation,
      ],
      controller.updateData,
    );
    router.put(
      "/:taskId/status-column",
      [
        KanbanTaskMiddlewares.taskIdParamValidation,
        KanbanTaskMiddlewares.updateTaskColumnDataValidation,
      ],
      controller.updateStatusColumn,
    );

    router.delete(
      "/:taskId",
      [KanbanTaskMiddlewares.taskIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
