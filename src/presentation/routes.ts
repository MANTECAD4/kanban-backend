import { Router } from "express";

import { AuthRoutes } from "./auth/routes";
import { BoardsRoutes } from "./board/routes";
import { StatusColumnsRoutes } from "./status-column/routes";
import { TaskRoutes } from "./task/routes";
import { SubtaskRoutes } from "./subtask/routes";

import { AuthMiddlewares } from "./auth/middlewares";

interface ClassDependencies {
  authRouter: AuthRoutes;
  authMiddlewares: AuthMiddlewares;
  boardRouter: BoardsRoutes;
  statusColumnRouter: StatusColumnsRoutes;
  taskRouter: TaskRoutes;
  subtaskRouter: SubtaskRoutes;
}

export class AppRoutes {
  private readonly authRouter: AuthRoutes;
  private readonly authMiddlewares: AuthMiddlewares;
  private readonly boardRouter: BoardsRoutes;
  private readonly statusColumnRouter: StatusColumnsRoutes;
  private readonly taskRouter: TaskRoutes;
  private readonly subtaskRouter: SubtaskRoutes;

  constructor(dependencies: ClassDependencies) {
    const {
      authRouter,
      authMiddlewares,
      boardRouter,
      statusColumnRouter,
      taskRouter,
      subtaskRouter,
    } = dependencies;
    this.authRouter = authRouter;
    this.authMiddlewares = authMiddlewares;
    this.boardRouter = boardRouter;
    this.statusColumnRouter = statusColumnRouter;
    this.taskRouter = taskRouter;
    this.subtaskRouter = subtaskRouter;
  }

  public get routes(): Router {
    const router = Router();

    //! MAIN ENDPOINTS
    router.use("/api/auth", this.authRouter.routes);
    router.use(
      "/api/boards",
      [this.authMiddlewares.validateAccessToken],
      this.boardRouter.routes,
    );

    router.use(
      "/api/status-columns",
      [this.authMiddlewares.validateAccessToken],
      this.statusColumnRouter.routes,
    );

    router.use(
      "/api/tasks",
      [this.authMiddlewares.validateAccessToken],
      this.taskRouter.routes,
    );

    router.use(
      "/api/subtasks",
      [this.authMiddlewares.validateAccessToken],
      this.subtaskRouter.routes,
    );

    return router;
  }
}
