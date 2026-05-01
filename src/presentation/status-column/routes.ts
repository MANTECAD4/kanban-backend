import { Router } from "express";
import { StatusColumnMiddlewares } from "./middlewares";
import { BoardMiddlewares } from "../board/middlewares";
import { StatusColumnController } from "./controller";

interface ClassDependencies {
  controller: StatusColumnController;
  boardMiddlewares: BoardMiddlewares;
  statusColumnMiddlewares: StatusColumnMiddlewares;
}

export class StatusColumnsRoutes {
  private readonly controller: StatusColumnController;
  private readonly boardMiddlewares: BoardMiddlewares;
  private readonly statusColumnMiddlewares: StatusColumnMiddlewares;

  constructor(dependencies: ClassDependencies) {
    const { controller, boardMiddlewares, statusColumnMiddlewares } =
      dependencies;
    this.controller = controller;
    this.boardMiddlewares = boardMiddlewares;
    this.statusColumnMiddlewares = statusColumnMiddlewares;
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
        this.statusColumnMiddlewares.createStatusColumnDataValidation,
      ],
      this.controller.create,
    );

    router.put(
      "/:columnId",
      [
        this.statusColumnMiddlewares.columnIdParamValidation,
        this.statusColumnMiddlewares.updateStatusColumnDataValidation,
      ],
      this.controller.update,
    );

    router.delete(
      "/:columnId",
      [this.statusColumnMiddlewares.columnIdParamValidation],
      this.controller.delete,
    );
    return router;
  }
}
