import { Router } from "express";
import { BoardController } from "./controller";
import { BoardMiddlewares } from "./middlewares";

interface ClassDependencies {
  controller: BoardController;
  boardMiddlewares: BoardMiddlewares;
}

export class BoardsRoutes {
  private readonly controller: BoardController;
  private readonly boardMiddlewares: BoardMiddlewares;

  constructor(dependencies: ClassDependencies) {
    const { controller, boardMiddlewares } = dependencies;
    this.controller = controller;
    this.boardMiddlewares = boardMiddlewares;
  }

  public get routes() {
    const router = Router();

    router.get("/", this.controller.getAll);

    router.get(
      "/:boardSlug",
      [this.boardMiddlewares.boardSlugParamValidation],
      this.controller.getBySlug,
    );

    router.post(
      "/",
      [this.boardMiddlewares.submitBoardDataValidation],
      this.controller.create,
    );

    router.put(
      "/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.validateRelation,
        this.boardMiddlewares.submitBoardDataValidation,
      ],
      this.controller.update,
    );
    router.delete(
      "/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );

    return router;
  }
}
