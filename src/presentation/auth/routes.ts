import { Router } from "express";
import { AuthController } from "./controller";
import { RegisterUserUseCase } from "../../application/use-cases/auth/register-user.use-case";
import { LoginUserUseCase } from "../../application/use-cases/auth/login-user.use-case";
import { AuthMiddlewares } from "./middlewares";
import { AuthRepository } from "../../domain/repositories";
import { TokenProvider } from "../../domain/services";
import { HasherService } from "../../domain/services/hasher.service";

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
    return router;
  }
}
