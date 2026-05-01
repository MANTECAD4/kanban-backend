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
}

export class BoardsRoutes {
  private readonly controller: BoardController;

  constructor(dependencies: ClassDependencies) {
    const { controller } = dependencies;
    this.controller = controller;
  }

  public get routes() {
    const router = Router();

    router.get("/", this.controller.getAll);
    router.post(
      "/",
      [BoardMiddlewares.createBoardDataValidation],
      this.controller.create,
    );

    router.put(
      "/:boardId",
      [
        BoardMiddlewares.boardIdParamValidation,
        BoardMiddlewares.updateBoardDataValidation,
      ],
      this.controller.update,
    );
    router.delete(
      "/:boardId",
      [BoardMiddlewares.boardIdParamValidation],
      this.controller.delete,
    );

    return router;
  }
}
