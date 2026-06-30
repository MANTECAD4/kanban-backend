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
    router.get("/", this.controller.getProjectsByUser);
    return router;
  }
}
