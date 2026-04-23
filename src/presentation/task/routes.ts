import { Router } from "express";
import { TaskController } from "./controller";
import { TaskMiddlewares } from "./middlewares";

export class TaskRoutes {
  constructor() {}
  public get routes() {
    const router = Router({ mergeParams: true });

    const controller = new TaskController();

    router.get(
      "/",
      [TaskMiddlewares.getTasksDataValidation],
      controller.getTasks,
    );

    router.post("/", controller.createTask);
    return router;
  }
}
