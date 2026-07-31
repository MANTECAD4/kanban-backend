import { NextFunction, Request, Response, Router } from "express";
import { TaskMiddlewares } from "../task/middlewares";
import { AttachmentMiddlewares } from "./middlewares";
import { AttachmentController } from "./controller";
import multer from "multer";
import path from "path";
import fs from "fs";

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
      this.controller.create,
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
      "/:attatchmentId",
      [this.attachmentMiddlewares.attachmentIdValidation],
      this.controller.delete,
    );

    return router;
  }
}
