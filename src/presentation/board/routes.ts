import { Router } from "express";
import { BoardController } from "./controller";
import { BoardMiddlewares } from "./middlewares";
import { ProjectMiddlewares } from "../project/middlewares";

interface ClassDependencies {
  controller: BoardController;
  boardMiddlewares: BoardMiddlewares;
  projectMiddlewares: ProjectMiddlewares;
}

export class BoardsRoutes {
  private readonly controller: BoardController;
  private readonly boardMiddlewares: BoardMiddlewares;
  private readonly projectMiddlewares: ProjectMiddlewares;

  constructor(dependencies: ClassDependencies) {
    const { controller, boardMiddlewares, projectMiddlewares } = dependencies;
    this.controller = controller;
    this.boardMiddlewares = boardMiddlewares;
    this.projectMiddlewares = projectMiddlewares;
  }

  public get routes() {
    const router = Router();

    router.get(
      "/in-project/:projectId",
      [this.projectMiddlewares.validateProjectId],
      this.controller.getAll,
    );
    router.post(
      "/in-project/:projectId",
      [this.projectMiddlewares.validateProjectId],
      [this.boardMiddlewares.submitBoardDataValidation],
      this.controller.create,
    );

    router.put(
      "/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.submitBoardDataValidation,
      ],
      this.controller.update,
    );
    router.delete(
      "/:boardId",
      [this.boardMiddlewares.boardIdParamValidation],
      this.controller.delete,
    );

    return router;
  }
}
