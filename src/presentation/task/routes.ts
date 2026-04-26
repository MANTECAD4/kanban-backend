import { Router } from "express";
import { KanbanTaskController } from "./controller";
import { KanbanTasksMiddlewares } from "./middlewares";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../domain/repositories";
import { GetTasksUseCase } from "../../application/use-cases/task/get-tasks.use-case";

export class TaskRoutes {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: KanbanTaskRepository,
  ) {}
  public get routes(): Router {
    const router = Router({ mergeParams: true });

    const getTasksUseCase = new GetTasksUseCase(
      this.statusColumnRepository,
      this.kanbanTaskRepository,
    );

    const controller = new KanbanTaskController(getTasksUseCase);

    router.get("/", controller.getAll);
    router.post(
      "/",
      [KanbanTasksMiddlewares.createTaskDataValidation],
      controller.create,
    );
    router.put(
      "/:taskId",
      [
        KanbanTasksMiddlewares.taskIdParamValidation,
        KanbanTasksMiddlewares.updateTaskDataValidation,
      ],
      controller.update,
    );
    router.delete(
      "/:taskId",
      [KanbanTasksMiddlewares.taskIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
