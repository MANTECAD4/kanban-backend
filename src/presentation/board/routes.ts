import { Router } from "express";
import { BoardController } from "./controller";
import { PostgresBoardRepository } from "../../infraestructure/repositories/postgres-board.repository";
import { CreateBoardUseCase } from "../../application/use-cases/board/create-board.use-case";
import { PostgresAuthRepository } from "../../infraestructure/repositories/postgres-auth.repository";
import { BoardMiddlewares } from "./middlewares";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { AuthMiddlewares } from "../auth/middlewares";
import { JwtGenerator } from "../../infraestructure/services/jwt-generator.service";
import { envs } from "../../configs/envs";

export class BoardRoutes {
  static get routes() {
    const { TOKEN_SEED } = envs();
    const router = Router();

    const tokenGenerator = new JwtGenerator(TOKEN_SEED);
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

    const authMiddlewares = new AuthMiddlewares(tokenGenerator);

    router.use(authMiddlewares.validateJwtToken);
    router.post(
      "/create",
      [BoardMiddlewares.createBoardDataValidation],
      controller.create,
    );
    router.get(
      "/get-all",
      [BoardMiddlewares.getBoardsDataValidation],
      controller.getBoards,
    );

    // router.put("update/:id");

    return router;
  }
}
