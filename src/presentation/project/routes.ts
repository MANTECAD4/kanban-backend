import { Router } from "express";
import { ProjectController } from "./controller";

interface Dependencies {
  controller: ProjectController;
}

export class ProjectRoutes {
  private readonly controller: ProjectController;

  constructor(dependencies: Dependencies) {
    const { controller } = dependencies;
    this.controller = controller;
  }

  public get routes(): Router {
    const router = Router();
    router.get("/", this.controller.getAllByUser);
    router.post("/", this.controller.create);
    router.put("/:projectId", this.controller.update);
    router.delete("/:projectId", this.controller.delete);
    return router;
  }
}
