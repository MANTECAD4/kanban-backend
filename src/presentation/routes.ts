import { Router } from "express";
import { envs } from "../configs/envs";

import { AuthRoutes } from "./auth/routes";
import { BoardsRoutes } from "./board/routes";
import { StatusColumnsRoutes } from "./status-column/routes";
import { TaskRoutes } from "./task/routes";
import { SubtaskRoutes } from "./subtask/routes";

import { AuthMiddlewares } from "./auth/middlewares";

import {
  PostgresAuthRepository,
  PostgresBoardRepository,
} from "../infraestructure/repositories";
import { PostgresStatusColumnRepository } from "../infraestructure/repositories/postgres-status-column.repository";
import { PostgresTaskRepository } from "../infraestructure/repositories/postgres-task.repository";

import { JwtGenerator } from "../infraestructure/services/jwt-generator.service";
import { BycryptHasher } from "../infraestructure/services/bycrypt.service";
import { SubtaskRepository } from "../domain/repositories/subtask.repository";
import { PostgresSubtaskRepository } from "../infraestructure/repositories/postgres-subtask.repository";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    //! ENVIROMENT VARIABLES
    const { TOKEN_SECRET } = envs();

    //! REPOSITORIES
    const authRepository = new PostgresAuthRepository();
    const boardRepository = new PostgresBoardRepository();
    const statusColumnRepository = new PostgresStatusColumnRepository();
    const taskRepository = new PostgresTaskRepository();
    const subtaskRepository = new PostgresSubtaskRepository();

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
    const kanbanTaskRoutes = new TaskRoutes(
      statusColumnRepository,
      taskRepository,
    );
    const kanbanSubtaskRoutes = new SubtaskRoutes(
      subtaskRepository,
      taskRepository,
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
      kanbanTaskRoutes.routes,
    );

    router.use(
      "/api/subtasks",
      [authMiddlewares.validateJwtToken],
      kanbanSubtaskRoutes.routes,
    );

    return router;
  }
}
