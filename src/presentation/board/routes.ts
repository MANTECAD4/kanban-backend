import { Router } from "express";
import { BoardController } from "./controller";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { BoardMiddlewares } from "./middlewares";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { AuthRepository, BoardRepository } from "../../domain/repositories";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";
import { DeleteBoardUseCase } from "../../application/use-cases/board/delete-board.use-case";

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
    router.post(
      "/",
      [this.boardMiddlewares.createBoardDataValidation],
      this.controller.create,
    );

    router.put(
      "/:boardId",
      [
        this.boardMiddlewares.boardIdParamValidation,
        this.boardMiddlewares.updateBoardDataValidation,
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
