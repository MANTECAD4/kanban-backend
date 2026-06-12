import { Router } from "express";

import { AuthRoutes } from "./auth/routes";
import { BoardsRoutes } from "./board/routes";
import { StatusColumnsRoutes } from "./status-column/routes";
import { TaskRoutes } from "./task/routes";
import { SubtaskRoutes } from "./subtask/routes";

import { AuthMiddlewares } from "./auth/middlewares";
import { UserRoutes } from "./user/routes";

export class AppRoutes {
  constructor(
    private readonly authMiddlewares: AuthMiddlewares,
    private readonly authRouter: AuthRoutes,
    private readonly boardRouter: BoardsRoutes,
    private readonly statusColumnRouter: StatusColumnsRoutes,
    private readonly taskRouter: TaskRoutes,
    private readonly subtaskRouter: SubtaskRoutes,
    private readonly userRouter: UserRoutes,
  ) {}

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

    router.use("/api/users", this.userRouter.routes);

    return router;
  }
}
