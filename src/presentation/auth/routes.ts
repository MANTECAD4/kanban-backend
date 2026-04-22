import { Router } from "express";
import { AuthController } from "./controller";
import { RegisterUserUseCase } from "../../application/use-cases/auth/register-user.use-case";
import { LoginUserUseCase } from "../../application/use-cases/auth/login-user.use-case";
import { AuthMiddlewares } from "./middlewares";
import { AuthRepository } from "../../domain/repositories";
import { TokenGenerator } from "../../domain/services";
import { HasherService } from "../../domain/services/hasher.service";

export class AuthRoutes {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hashService: HasherService,
  ) {}
  public get routes(): Router {
    const router = Router();

    const registerUseCase = new RegisterUserUseCase(
      this.authRepository,
      this.tokenGenerator,
      this.hashService,
    );

    const loginUseCase = new LoginUserUseCase(
      this.authRepository,
      this.tokenGenerator,
      this.hashService,
    );

    const controller = new AuthController(registerUseCase, loginUseCase);

    router.post(
      "/login",
      [AuthMiddlewares.loginDataValidation],
      controller.login,
    );
    router.post(
      "/register",
      [AuthMiddlewares.registerDataValidation],
      controller.register,
    );
    return router;
  }
}
