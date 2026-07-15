import { Router } from "express";
import { ProjectController } from "./controller";
import { ProjectMiddlewares } from "./middlewares";

interface Dependencies {
  controller: ProjectController;
  projectMiddlewares: ProjectMiddlewares;
}

export class ProjectRoutes {
  private readonly controller: ProjectController;
  private readonly projectMiddlewares: ProjectMiddlewares;

  constructor(dependencies: Dependencies) {
    const { controller, projectMiddlewares } = dependencies;
    this.controller = controller;
    this.projectMiddlewares = projectMiddlewares;
  }

  public get routes(): Router {
    const router = Router();
    router.get("/", this.controller.getAllByUser);
    router.get(
      "/:projectSlug",
      [this.projectMiddlewares.validateProjectSlug],
      this.controller.getByUserAndSlug,
    );
    router.post(
      "/",
      [this.projectMiddlewares.submitProjectDataValidation],
      this.controller.create,
    );
    router.put(
      "/:projectId",
      [
        this.projectMiddlewares.validateProjectId,
        this.projectMiddlewares.validateRelation,
        this.projectMiddlewares.submitProjectDataValidation,
      ],
      this.controller.update,
    );
    router.delete(
      "/:projectId",
      [
        this.projectMiddlewares.validateProjectId,
        this.projectMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );
    return router;
  }
}
