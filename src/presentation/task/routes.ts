import { Router } from "express";
import { TaskController } from "./controller";
import { TaskMiddlewares } from "./middlewares";
import { StatusColumnMiddlewares } from "../status-column/middlewares";

interface ClassDependencies {
  controller: TaskController;
  statusColumnMiddlewares: StatusColumnMiddlewares;
  taskMiddlewares: TaskMiddlewares;
}

export class TaskRoutes {
  private readonly controller: TaskController;
  private readonly statusColumnMiddlewares: StatusColumnMiddlewares;
  private readonly taskMiddlewares: TaskMiddlewares;
  constructor(dependencies: ClassDependencies) {
    const { controller, statusColumnMiddlewares, taskMiddlewares } =
      dependencies;
    this.controller = controller;
    this.statusColumnMiddlewares = statusColumnMiddlewares;
    this.taskMiddlewares = taskMiddlewares;
  }

  public get routes(): Router {
    const router = Router({ mergeParams: true });

    router.get(
      "/in-column/:columnId",
      [this.statusColumnMiddlewares.columnIdParamValidation],
      this.controller.getAllByColumn,
    );

    router.post(
      "/in-column/:columnId",
      [
        this.statusColumnMiddlewares.columnIdParamValidation,
        this.taskMiddlewares.submitTaskDataValidation,
      ],
      this.controller.create,
    );

    router.put(
      "/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.submitTaskDataValidation,
      ],
      this.controller.updateData,
    );
    router.put(
      "/:taskId/status-column",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.submitTaskDataValidation,
      ],
      this.controller.updateStatusColumn,
    );

    router.delete(
      "/:taskId",
      [this.taskMiddlewares.taskIdParamValidation],
      this.controller.delete,
    );

    return router;
  }
}
