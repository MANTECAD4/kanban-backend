import { Router } from "express";
import { BoardController } from "./controller";
import { PostgresBoardRepository } from "../../infraestructure/repositories/postgres-board.repository";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { PostgresAuthRepository } from "../../infraestructure/repositories/postgres-auth.repository";
import { BoardMiddlewares } from "./middlewares";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";

export class BoardRoutes {
  static get routes() {
    const router = Router();

    const authRepository = new PostgresAuthRepository();

    const boardRepository = new PostgresBoardRepository();
    const createBoardUseCase = new CreateBoardUseCase(
      boardRepository,
      authRepository,
    );

    const getBoardsUseCase = new GetBoardsUseCase(
      authRepository,
      boardRepository,
    );

    const controller = new BoardController(
      createBoardUseCase,
      getBoardsUseCase,
    );

    router.post(
      "/create",
      [BoardMiddlewares.createBoardDataValidation],
      controller.create,
    );
    router.post(
      "/get-all",
      [BoardMiddlewares.getBoardsDataValidation],
      controller.getBoards,
    );

    return router;
  }
}
