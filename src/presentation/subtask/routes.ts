import { Router } from "express";
import { SubtaskController } from "./controller";
import { SubtaskMiddlewares } from "./middlewares";
import { TaskMiddlewares } from "../task/middlewares";

export class SubtaskRoutes {
  constructor() {}
  public get routes(): Router {
    const router = Router();

    const controller = new SubtaskController();

    router.get(
      "/in-task/:taskId",
      [TaskMiddlewares.taskIdParamValidation],
      controller.getAllByTask,
    );

    router.post(
      "/in-task/:taskId",
      [
        TaskMiddlewares.taskIdParamValidation,
        SubtaskMiddlewares.createSubtaskDataValidation,
      ],
      controller.create,
    );

    router.put(
      "/:subtaskId",
      [
        SubtaskMiddlewares.subtaskIdParamValidation,
        SubtaskMiddlewares.updateSubtaskDataValidation,
      ],
      controller.update,
    );

    router.delete("/:subtaskId", controller.delete);

    return router;
  }
}
