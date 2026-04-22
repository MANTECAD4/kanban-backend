import { Router } from "express";
import { BoardController } from "./controller";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { BoardMiddlewares } from "./middlewares";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { AuthMiddlewares } from "../auth/middlewares";
import { AuthRepository, BoardRepository } from "../../domain/repositories";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";

export class BoardRoutes {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authMiddlewares: AuthMiddlewares,
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

    const controller = new BoardController(
      createBoardUseCase,
      getBoardsUseCase,
      updateBoardUseCase,
    );

    router.use(this.authMiddlewares.validateJwtToken);

    router.post(
      "/create",
      [BoardMiddlewares.createBoardDataValidation],
      controller.create,
    );
    router.get("/get-all", controller.getBoards);

    router.put(
      "/update/:id",
      [BoardMiddlewares.existingBoardId],
      controller.updateBoard,
    );

    return router;
  }
}
