import { Router } from "express";
import { SubtaskController } from "./controller";
import { SubtaskMiddlewares } from "./middlewares";
import { TaskMiddlewares } from "../task/middlewares";

interface ClassDependencies {
  controller: SubtaskController;
  taskMiddlewares: TaskMiddlewares;
  subtaskMiddlewares: SubtaskMiddlewares;
}

export class SubtaskRoutes {
  private readonly controller: SubtaskController;
  private readonly taskMiddlewares: TaskMiddlewares;
  private readonly subtaskMiddlewares: SubtaskMiddlewares;
  constructor(dependencies: ClassDependencies) {
    const { controller, taskMiddlewares, subtaskMiddlewares } = dependencies;

    this.controller = controller;
    this.taskMiddlewares = taskMiddlewares;
    this.subtaskMiddlewares = subtaskMiddlewares;
  }
  public get routes(): Router {
    const router = Router();

    router.get(
      "/in-task/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
      ],
      this.controller.getAllByTask,
    );

    router.post(
      "/in-task/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
        this.subtaskMiddlewares.submitSubtaskDataValidation,
      ],
      this.controller.create,
    );

    router.patch(
      "/:subtaskId/change-description",
      [
        this.subtaskMiddlewares.subtaskIdParamValidation,
        this.subtaskMiddlewares.validateRelation,
        this.subtaskMiddlewares.submitSubtaskDataValidation,
      ],
      this.controller.updateDescription,
    );
    router.patch(
      "/:subtaskId/change-status",
      [
        this.subtaskMiddlewares.subtaskIdParamValidation,
        this.subtaskMiddlewares.validateRelation,
        this.subtaskMiddlewares.changeSubtaskStatusValidation,
      ],
      this.controller.updateCompletionStatus,
    );

    router.delete(
      "/:subtaskId",
      [
        this.subtaskMiddlewares.subtaskIdParamValidation,
        this.subtaskMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );

    return router;
  }
}
