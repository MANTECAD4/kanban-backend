import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { BoardsRoutes } from "./board/routes";
import { envs } from "../configs/envs";
import {
  PostgresAuthRepository,
  PostgresBoardRepository,
} from "../infraestructure/repositories";
import { JwtGenerator } from "../infraestructure/services/jwt-generator.service";
import { BycryptHasher } from "../infraestructure/services/bycrypt.service";
import { AuthMiddlewares } from "./auth/middlewares";
import { StatusColumnsRoutes } from "./status-column/routes";
import { PostgresStatusColumnRepository } from "../infraestructure/repositories/postgres-status-column.repository";
import { BoardsMiddlewares } from "./board/middlewares";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const { TOKEN_SECRET } = envs();

    const authRepository = new PostgresAuthRepository();
    const boardRepository = new PostgresBoardRepository();
    const statusColumnRepository = new PostgresStatusColumnRepository();

    const tokenGenerator = new JwtGenerator(TOKEN_SECRET);
    const hashService = new BycryptHasher();

    const authMiddlewares = new AuthMiddlewares(tokenGenerator);

    const boardRoutes = new BoardsRoutes(authRepository, boardRepository);

    const authRoutes = new AuthRoutes(
      authRepository,
      tokenGenerator,
      hashService,
    );
    const taskRoutes = new StatusColumnsRoutes(statusColumnRepository);

    router.use("/api/auth", authRoutes.routes);
    router.use(
      "/api/boards",
      [authMiddlewares.validateJwtToken],
      boardRoutes.routes,
    );
    router.use(
      "/api/boards/:boardId/tasks",
      [
        authMiddlewares.validateJwtToken,
        BoardsMiddlewares.boardIdParamValidation,
      ],
      taskRoutes.routes,
    );

    return router;
  }
}
