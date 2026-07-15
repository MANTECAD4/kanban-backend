import { Router } from "express";
import { CategoryMiddlewares } from "./middlewares";
import { BoardMiddlewares } from "../board/middlewares";
import { CategoryController } from "./controller";

interface ClassDependencies {
  controller: CategoryController;
  boardMiddlewares: BoardMiddlewares;
  categoryMiddlewares: CategoryMiddlewares;
}

export class CategoryRoutes {
  private readonly controller: CategoryController;
  private readonly boardMiddlewares: BoardMiddlewares;
  private readonly categoryMiddlewares: CategoryMiddlewares;

  constructor(dependencies: ClassDependencies) {
    const { controller, boardMiddlewares, categoryMiddlewares } = dependencies;
    this.controller = controller;
    this.boardMiddlewares = boardMiddlewares;
    this.categoryMiddlewares = categoryMiddlewares;
  }

  public get routes() {
    const router = Router({ mergeParams: true });

    router.get(
      "/in-board/:boardId",
      [this.boardMiddlewares.boardIdParamValidation],
      this.controller.getAll,
    );

    router.post(
      "/in-board/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.categoryMiddlewares.submitCategoryDataValidation,
      ],
      this.controller.create,
    );

    router.put(
      "/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.submitCategoryDataValidation,
      ],
      this.controller.update,
    );

    router.delete(
      "/:categoryId",
      [this.categoryMiddlewares.categoryIdParamValidation],
      this.controller.delete,
    );
    return router;
  }
}
