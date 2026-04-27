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

    const deleteTaskUsecase = new DeleteKanbanTaskUseCase(
      this.kanbanTaskRepository,
    );
    const controller = new KanbanTaskController(
      getTasksUseCase,
      createTaskUseCase,
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
      controller.update,
    );

    router.delete(
      "/:taskId",
      [KanbanTaskMiddlewares.taskIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
