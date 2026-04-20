import { Router } from "express";
import { BoardController } from "./controller";
import { PostgresBoardDatasource } from "../../infraestructure/datasources/postgres-board.datasource";
import { BoardRepositoryImpl } from "../../infraestructure/repositories/board.repository.impl";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { PostgresAuthDatasource } from "../../infraestructure/datasources/postgres-auth.datasource";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth.repository.impl";
import { BoardMiddlewares } from "./middlewares";

export class BoardRoutes {
  static get routes() {
    const router = Router();

    const authDatasource = new PostgresAuthDatasource();
    const authRepository = new AuthRepositoryImpl(authDatasource);

    const boardDatasource = new PostgresBoardDatasource();
    const boardRepository = new BoardRepositoryImpl(boardDatasource);
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
