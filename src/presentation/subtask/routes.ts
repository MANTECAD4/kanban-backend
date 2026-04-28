import { Router } from "express";
import { KanbanSubtaskController } from "./controller";
import { KanbanSubtaskMiddlewares } from "./middlewares";
import { KanbanTaskMiddlewares } from "../task/middlewares";

export class SubtaskRoutes {
  constructor() {}
  public get routes(): Router {
    const router = Router();

    const controller = new KanbanSubtaskController();

    router.get(
      "/in-task/:taskId",
      [KanbanTaskMiddlewares.taskIdParamValidation],
      controller.getAllByTask,
    );

    router.post(
      "/in-task/:taskId",
      [
        KanbanTaskMiddlewares.taskIdParamValidation,
        KanbanSubtaskMiddlewares.createSubtaskDataValidation,
      ],
      controller.create,
    );

    router.put(
      "/:subtaskId",
      [
        KanbanSubtaskMiddlewares.subtaskIdParamValidation,
        KanbanSubtaskMiddlewares.updateSubtaskDataValidation,
      ],
      controller.update,
    );

    router.delete("/:subtaskId", controller.delete);

    return router;
  }
}
