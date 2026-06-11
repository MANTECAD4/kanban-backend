import { Router } from "express";
import { AuthController } from "./controller";
import { AuthMiddlewares } from "./middlewares";

interface ClassDependencies {
  controller: AuthController;
  authMiddlewares: AuthMiddlewares;
}

export class AuthRoutes {
  private readonly controller: AuthController;
  private readonly authMiddlewares: AuthMiddlewares;
  constructor({ controller, authMiddlewares }: ClassDependencies) {
    this.controller = controller;
    this.authMiddlewares = authMiddlewares;
  }
  public get routes(): Router {
    const router = Router();

    router.post(
      "/login",
      [this.authMiddlewares.loginDataValidation],
      this.controller.login,
    );
    router.post(
      "/register",
      [this.authMiddlewares.registerDataValidation],
      this.controller.register,
    );

    router.post(
      "/refresh",
      [this.authMiddlewares.validateRefreshToken],
      this.controller.refresh,
    );
    router.post(
      "/logout",
      [this.authMiddlewares.validateRefreshToken],
      this.controller.logout,
    );

    return router;
  }
}
