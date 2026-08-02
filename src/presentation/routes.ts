import { Router } from "express";

import { AuthRoutes } from "./auth/routes";
import { BoardsRoutes } from "./board/routes";
import { CategoryRoutes } from "./category/routes";
import { TaskRoutes } from "./task/routes";
import { SubtaskRoutes } from "./subtask/routes";

import { AuthMiddlewares } from "./auth/middlewares";
import { UserRoutes } from "./user/routes";
import { ProjectRoutes } from "./project/routes";
import { AttachmentRoutes } from "./attachment/routes";

export class AppRoutes {
  constructor(
    private readonly authMiddlewares: AuthMiddlewares,
    private readonly authRouter: AuthRoutes,
    private readonly boardRouter: BoardsRoutes,
    private readonly categoryRouter: CategoryRoutes,
    private readonly taskRouter: TaskRoutes,
    private readonly subtaskRouter: SubtaskRoutes,
    private readonly userRouter: UserRoutes,
    private readonly projectRouter: ProjectRoutes,
    private readonly attatchmentRouter: AttachmentRoutes,
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
      "/api/categories",
      [this.authMiddlewares.validateAccessToken],
      this.categoryRouter.routes,
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
    router.use(
      "/api/projects",
      [this.authMiddlewares.validateAccessToken],
      this.projectRouter.routes,
    );

    router.use(
      "/api/attachments",
      [this.authMiddlewares.validateAccessToken],
      this.attatchmentRouter.routes,
    );

    return router;
  }
}
