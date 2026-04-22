import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { BoardRoutes } from "./board/routes";
import { envs } from "../configs/envs";
import {
  PostgresAuthRepository,
  PostgresBoardRepository,
} from "../infraestructure/repositories";
import { JwtGenerator } from "../infraestructure/services/jwt-generator.service";
import { BycryptHasher } from "../infraestructure/services/bycrypt.service";
import { AuthMiddlewares } from "./auth/middlewares";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const { TOKEN_SECRET } = envs();

    const authRepository = new PostgresAuthRepository();
    const boardRepository = new PostgresBoardRepository();

    const tokenGenerator = new JwtGenerator(TOKEN_SECRET);
    const hashService = new BycryptHasher();

    const authMiddlewares = new AuthMiddlewares(tokenGenerator);

    const authRoutes = new AuthRoutes(
      authRepository,
      tokenGenerator,
      hashService,
    );

    const boardRoutes = new BoardRoutes(
      authRepository,
      authMiddlewares,
      boardRepository,
    );

    router.use("/api/auth", authRoutes.routes);
    router.use("/api/boards", boardRoutes.routes);

    return router;
  }
}
