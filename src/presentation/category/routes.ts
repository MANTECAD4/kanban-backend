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
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.validateRelation,
      ],
      this.controller.getAll,
    );

    router.post(
      "/in-board/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.validateRelation,
        this.categoryMiddlewares.submitCategoryDataValidation,
      ],
      this.controller.create,
    );

    router.put(
      "/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
        this.categoryMiddlewares.submitCategoryDataValidation,
      ],
      this.controller.update,
    );
    router.patch(
      "/:categoryId/change-order",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
        this.categoryMiddlewares.changeOrderValidation,
      ],
      this.controller.updateOrder,
    );

    router.delete(
      "/:categoryId",
      [
        this.categoryMiddlewares.categoryIdParamValidation,
        this.categoryMiddlewares.validateRelation,
      ],
      this.controller.delete,
    );
    return router;
  }
}
