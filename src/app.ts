import { createServer } from "node:http";
import { envs } from "./configs/envs";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import {
  PostgresAuthRepository,
  PostgresBoardRepository,
  PostgresStatusColumnRepository,
  PostgresSubtaskRepository,
  PostgresTaskRepository,
} from "./infraestructure/repositories";
import { BycryptHasher, JwtGenerator } from "./infraestructure/services";
import { AuthMiddlewares } from "./presentation/auth/middlewares";
import { AuthRoutes } from "./presentation/auth/routes";
import { StatusColumnsRoutes } from "./presentation/status-column/routes";
import { TaskRoutes } from "./presentation/task/routes";
import { SubtaskRoutes } from "./presentation/subtask/routes";
import { BoardsRoutes } from "./presentation/board/routes";
import { AuthController } from "./presentation/auth/controller";
import { BoardController } from "./presentation/board/controller";

import {
  LoginUserUseCase,
  RegisterUserUseCase,
} from "./application/use-cases/auth/";
import {
  CreateBoardUseCase,
  DeleteBoardUseCase,
  GetBoardsUseCase,
  UpdateBoardUseCase,
} from "./application/use-cases/board";
import {
  CreateStatusColumnUseCase,
  DeleteStatusColumnUseCase,
  GetStatusColumnsUseCase,
  UpdateStatusColumnUseCase,
} from "./application/use-cases/status-column";
import { StatusColumnController } from "./presentation/status-column/controller";
import { BoardMiddlewares } from "./presentation/board/middlewares";
import { StatusColumnMiddlewares } from "./presentation/status-column/middlewares";

(async () => {
  main();
})();

function main() {
  const { PORT: port } = envs();

  //! ENVIROMENT VARIABLES
  const {
    TOKEN_SECRET,
    ACCESS_TOKEN_DURATION: acccesTokenDuration,
    REFRESH_TOKEN_DURATION: refreshTokenDuration,
  } = envs();

  //! REPOSITORIES
  const authRepository = new PostgresAuthRepository();
  const boardRepository = new PostgresBoardRepository();
  const statusColumnRepository = new PostgresStatusColumnRepository();
  const taskRepository = new PostgresTaskRepository();
  const subtaskRepository = new PostgresSubtaskRepository();

  //! SERVCIES
  const tokenProvider = new JwtGenerator(TOKEN_SECRET);
  const strongHasher = new BycryptHasher();

  //! MIDDLEWARES WITH DI
  const authMiddlewares = new AuthMiddlewares(tokenProvider);
  const boardMiddlewares = new BoardMiddlewares();
  const statusColumnMiddlewares = new StatusColumnMiddlewares();

  //////////////// ! USE CASES ////////////////
  // AUTH
  const loginUserUseCase = new LoginUserUseCase({
    acccesTokenDuration,
    refreshTokenDuration,
    authRepository,
    tokenProvider,
    strongHasher,
    // TODO: change for the crypto implementation
    softHasher: strongHasher,
  });

  const registerUserUseCase = new RegisterUserUseCase({
    authRepository,
    strongHasher,
    tokenProvider,
  });

  // BOARDS
  const createBoardUseCase = new CreateBoardUseCase({
    boardRepository,
    authRepository,
  });

  const getBoardsUseCase = new GetBoardsUseCase({
    authRepository,
    boardRepository,
  });
  const updateBoardUseCase = new UpdateBoardUseCase({ boardRepository });
  const deleteBoardUseCase = new DeleteBoardUseCase({ boardRepository });

  const createStatusColumnUseCase = new CreateStatusColumnUseCase({
    statusColumnRepository,
    boardRepository,
  });

  const getStatusColumnsUseCase = new GetStatusColumnsUseCase({
    statusColumnRepository,
    boardRepository,
  });

  const updateStatusColumnUsecase = new UpdateStatusColumnUseCase({
    statusColumnRepository,
  });
  const deleteStatusColumnUsecase = new DeleteStatusColumnUseCase({
    statusColumnRepository,
  });

  const statusColumnController = new StatusColumnController(
    getStatusColumnsUseCase,
    createStatusColumnUseCase,
    updateStatusColumnUsecase,
    deleteStatusColumnUsecase,
  );

  //////////////// ! CONTROLLERS ////////////////
  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
  );

  const boardController = new BoardController(
    createBoardUseCase,
    getBoardsUseCase,
    updateBoardUseCase,
    deleteBoardUseCase,
  );

  //! SUB ROUTERS
  const boardRouter = new BoardsRoutes({ controller: boardController });
  const authRouter = new AuthRoutes({
    authMiddlewares,
    controller: authController,
  });
  const statusColumnRouter = new StatusColumnsRoutes({
    controller: statusColumnController,
    boardMiddlewares,
    statusColumnMiddlewares,
  });
  const taskRouter = new TaskRoutes(statusColumnRepository, taskRepository);
  const subtaskRouter = new SubtaskRoutes(subtaskRepository, taskRepository);
  const server = new Server({ port });

  const appRouter = new AppRoutes({
    authMiddlewares,
    authRouter,
    boardRouter,
    statusColumnRouter,
    subtaskRouter,
    taskRouter,
  });
  server.setRoutes(appRouter.routes);

  const httpServer = createServer(server.app);

  httpServer.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}
