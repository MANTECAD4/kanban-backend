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
import { TaskRoutes } from "./task/routes";
import { StatusColumnsMiddlewares } from "./status-column/middlewares";
import { PostgresTaskRepository } from "../infraestructure/repositories/postgres-task.repository";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    //! ENVIROMENT VARIABLES
    const { TOKEN_SECRET } = envs();

    //! REPOSITORIES
    const authRepository = new PostgresAuthRepository();
    const boardRepository = new PostgresBoardRepository();
    const statusColumnRepository = new PostgresStatusColumnRepository();
    const kanbanTaskRepository = new PostgresTaskRepository();

    //! SERVCIES
    const tokenGenerator = new JwtGenerator(TOKEN_SECRET);
    const hashService = new BycryptHasher();

    //! MIDDLEWARES WITH DI
    const authMiddlewares = new AuthMiddlewares(tokenGenerator);

    //! SUB ROUTERS
    const boardRoutes = new BoardsRoutes(authRepository, boardRepository);
    const authRoutes = new AuthRoutes(
      authRepository,
      tokenGenerator,
      hashService,
    );
    const statusColumnRoutes = new StatusColumnsRoutes(
      statusColumnRepository,
      boardRepository,
    );
    const taskRoutes = new TaskRoutes(
      statusColumnRepository,
      kanbanTaskRepository,
    );

    //! MAIN ENDPOINTS
    router.use("/api/auth", authRoutes.routes);
    router.use(
      "/api/boards",
      [authMiddlewares.validateJwtToken],
      boardRoutes.routes,
    );

    router.use(
      "/api/status-columns",
      [authMiddlewares.validateJwtToken],
      statusColumnRoutes.routes,
    );

    router.use(
      "/api/tasks",
      [authMiddlewares.validateJwtToken],
      taskRoutes.routes,
    );

    return router;
  }
}
