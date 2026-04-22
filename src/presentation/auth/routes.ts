import { Router } from "express";
import { AuthController } from "./controller";
import { RegisterUserUseCase } from "../../application/use-cases/auth/register-user.use-case";
import { PostgresAuthRepository } from "../../infraestructure/repositories/postgres-auth.repository";
import { JwtGenerator } from "../../infraestructure/services/jwt-generator.service";
import { envs } from "../../configs/envs";
import { BycryptHasher } from "../../infraestructure/services/bycrypt.service";
import { LoginUserUseCase } from "../../application/use-cases/auth/login-user.use-case";
import { AuthMiddlewares } from "./middlewares";

export class AuthRoutes {
  static get routes(): Router {
    const { TOKEN_SECRET } = envs();
    const router = Router();

    const authRepository = new PostgresAuthRepository();

    const tokenGenerator = new JwtGenerator(TOKEN_SECRET);

    const hashService = new BycryptHasher();

    const registerUseCase = new RegisterUserUseCase(
      authRepository,
      tokenGenerator,
      hashService,
    );

    const loginUseCase = new LoginUserUseCase(
      authRepository,
      tokenGenerator,
      hashService,
    );

    // const authMiddlewares = new AuthMiddlewares();

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
