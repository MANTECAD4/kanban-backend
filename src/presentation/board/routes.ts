import { Router } from "express";
import { BoardsController } from "./controller";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { BoardsMiddlewares } from "./middlewares";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { AuthMiddlewares } from "../auth/middlewares";
import { AuthRepository, BoardRepository } from "../../domain/repositories";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";
import { DeleteBoardUseCase } from "../../application/use-cases/board/delete-board.use-case";

export class BoardsRoutes {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  public get routes() {
    const router = Router();

    const createBoardUseCase = new CreateBoardUseCase(
      this.boardRepository,
      this.authRepository,
    );

    const getBoardsUseCase = new GetBoardsUseCase(
      this.authRepository,
      this.boardRepository,
    );

    const updateBoardUseCase = new UpdateBoardUseCase(this.boardRepository);

    const deleteBoardUseCase = new DeleteBoardUseCase(this.boardRepository);

    const controller = new BoardsController(
      createBoardUseCase,
      getBoardsUseCase,
      updateBoardUseCase,
      deleteBoardUseCase,
    );

    router.get("/", controller.getAll);
    router.post(
      "/",
      [BoardsMiddlewares.createBoardDataValidation],
      controller.create,
    );

    router.put(
      "/:boardId",
      [
        BoardsMiddlewares.boardIdParamValidation,
        BoardsMiddlewares.updateBoardDataValidation,
      ],
      controller.update,
    );
    router.delete(
      "/:boardId",
      [BoardsMiddlewares.boardIdParamValidation],
      controller.delete,
    );

    return router;
  }
}
