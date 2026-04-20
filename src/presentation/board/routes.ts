import { Router } from "express";
import { BoardController } from "./controller";
import { PostgresBoardRepository } from "../../infraestructure/repositories/postgres-board.repository";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { PostgresAuthRepository } from "../../infraestructure/repositories/postgres-auth.repository";
import { BoardMiddlewares } from "./middlewares";

export class BoardRoutes {
  static get routes() {
    const router = Router();

    const authRepository = new PostgresAuthRepository();

    const boardRepository = new PostgresBoardRepository();
    const createBoardUseCase = new CreateBoardUseCase(
      boardRepository,
      authRepository,
    );
    const controller = new BoardController(createBoardUseCase);
    router.post(
      "/",
      [BoardMiddlewares.createBoardDataValidation],
      controller.create,
    );
    return router;
  }
}
