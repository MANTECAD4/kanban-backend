import { Router } from "express";
import { TaskMiddlewares } from "../task/middlewares";
import { AttachmentMiddlewares } from "./middlewares";
import { AttachmentController } from "./controller";

interface Dependencies {
  controller: AttachmentController;
  taskMiddlewares: TaskMiddlewares;
  attachmentMiddlewares: AttachmentMiddlewares;
}

export class AttachmentRoutes {
  private readonly controller: AttachmentController;
  private readonly taskMiddlewares: TaskMiddlewares;
  private readonly attachmentMiddlewares: AttachmentMiddlewares;
  constructor(dependencies: Dependencies) {
    const { controller, taskMiddlewares, attachmentMiddlewares } = dependencies;
    this.controller = controller;
    this.taskMiddlewares = taskMiddlewares;
    this.attachmentMiddlewares = attachmentMiddlewares;
  }

  public get routes(): Router {
    const router = Router();

    router.post(
      "/in-task/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
        this.attachmentMiddlewares.validateAttachments,
      ],
      this.controller.upload,
    );

    router.get(
      "/in-task/:taskId",
      [
        this.taskMiddlewares.taskIdParamValidation,
        this.taskMiddlewares.validateRelation,
      ],
      this.controller.getAllByTask,
    );
    router.delete(
      "/:attachmentId",
      [
        this.attachmentMiddlewares.attachmentIdValidation,
        this.attachmentMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );

    return router;
  }
}
