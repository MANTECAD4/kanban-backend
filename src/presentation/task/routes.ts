import { Router } from "express";
import { KanbanTaskController } from "./controller";

export class TaskRoutes {
  constructor() {}
  public get routes(): Router {
    const router = Router({ mergeParams: true });

    const controller = new KanbanTaskController();
    router.get("/", controller.getAll);
    router.post("/", controller.create);
    router.put("/:taskId", controller.update);
    router.delete("/:taskId", controller.delete);
    return router;
  }
}
