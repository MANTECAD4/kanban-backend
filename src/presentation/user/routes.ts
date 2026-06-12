import { Router } from "express";
import { UserController } from "./controller";
import { AuthMiddlewares } from "../auth/middlewares";

interface ClassDependencies {
  controller: UserController;
  authMiddlewares: AuthMiddlewares;
}

export class UserRoutes {
  private readonly controller: UserController;
  private readonly authMiddlewares: AuthMiddlewares;
  constructor(dependencies: ClassDependencies) {
    const { controller, authMiddlewares } = dependencies;
    this.controller = controller;
    this.authMiddlewares = authMiddlewares;
  }
  public get routes(): Router {
    const router = Router();

    router.get(
      "/me",
      [this.authMiddlewares.validateRefreshToken],
      this.controller.getMeInfo,
    );
    return router;
  }
}
