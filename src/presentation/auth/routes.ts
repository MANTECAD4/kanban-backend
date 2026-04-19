import { Router } from "express";
import { AuthController } from "./controller";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { PostgresAuthDatasource } from "../../infraestructure/datasources/postgres-auth.datasource";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth.repository.impl";
import { JwtGenerator } from "../../infraestructure/services/jwt-generator.service";
import { envs } from "../../configs/envs";
import { BycryptHasher } from "../../infraestructure/services/bycrypt.service";

export class AuthRoutes {
  static get routes(): Router {
    const { TOKEN_SEED } = envs();
    const router = Router();

    const authDatasource = new PostgresAuthDatasource();
    const authRepository = new AuthRepositoryImpl(authDatasource);

    const tokenGenerator = new JwtGenerator(TOKEN_SEED);

    const hashService = new BycryptHasher();

    const registerUseCase = new RegisterUserUseCase(
      authRepository,
      tokenGenerator,
      hashService,
    );
    const controller = new AuthController(registerUseCase);
    router.post("/login", controller.login);
    router.post("/register", controller.register);
    return router;
  }
}
