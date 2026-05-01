import { createServer } from "node:http";
import { Server } from "./presentation/server";
import { envs } from "./configs/envs";

import {
  PostgresAuthRepository,
  PostgresBoardRepository,
  PostgresStatusColumnRepository,
  PostgresSubtaskRepository,
  PostgresTaskRepository,
} from "./infraestructure/repositories";

import { AuthMiddlewares } from "./presentation/auth/middlewares";
import { BoardMiddlewares } from "./presentation/board/middlewares";
import { StatusColumnMiddlewares } from "./presentation/status-column/middlewares";
import { TaskMiddlewares } from "./presentation/task/middlewares";
import { SubtaskMiddlewares } from "./presentation/subtask/middlewares";

import {
  BycryptHasher,
  CryptoHasher,
  JwtGenerator,
} from "./infraestructure/services";

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

import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  GetTasksByColumnUseCase,
  UpdateDataInTaskUseCase,
  UpdateStatusColumnInTaskUseCase,
} from "./application/use-cases/task";

import {
  CreateSubtaskUseCase,
  DeleteSubtaskUseCase,
  GetSubtasksUseCase,
  UpdateSubtaskUseCase,
} from "./application/use-cases/subtask";

import { AuthController } from "./presentation/auth/controller";
import { BoardController } from "./presentation/board/controller";
import { StatusColumnController } from "./presentation/status-column/controller";
import { TaskController } from "./presentation/task/controller";
import { SubtaskController } from "./presentation/subtask/controller";

import { AppRoutes } from "./presentation/routes";
import { AuthRoutes } from "./presentation/auth/routes";
import { BoardsRoutes } from "./presentation/board/routes";
import { StatusColumnsRoutes } from "./presentation/status-column/routes";
import { TaskRoutes } from "./presentation/task/routes";
import { SubtaskRoutes } from "./presentation/subtask/routes";

(async () => {
  main();
})();

function main() {
  //! ENVIROMENT VARIABLES
  const {
    PORT: port,
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
  const softHasher = new CryptoHasher();

  //! MIDDLEWARES
  const authMiddlewares = new AuthMiddlewares(tokenProvider);
  const boardMiddlewares = new BoardMiddlewares();
  const statusColumnMiddlewares = new StatusColumnMiddlewares();
  const taskMiddlewares = new TaskMiddlewares();
  const subtaskMiddlewares = new SubtaskMiddlewares();

  //////////////// ! USE CASES ////////////////
  // AUTH
  const loginUserUseCase = new LoginUserUseCase({
    acccesTokenDuration,
    refreshTokenDuration,
    authRepository,
    tokenProvider,
    strongHasher,
    softHasher,
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

  // STATUS COLUMNS
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

  // SUBTASK
  const getSubtasksUsecase = new GetSubtasksUseCase({
    subtaskRepository,
    taskRepository,
  });

  const createSubtaskUsecase = new CreateSubtaskUseCase({
    subtaskRepository,
    taskRepository,
  });

  const updateSubtaskUsecase = new UpdateSubtaskUseCase({ subtaskRepository });
  const deleteSubtaskUsecase = new DeleteSubtaskUseCase({ subtaskRepository });
  // TASKS
  const getTasksUseCase = new GetTasksByColumnUseCase({
    statusColumnRepository,
    taskRepository,
  });

  const createTaskUseCase = new CreateTaskUseCase({
    statusColumnRepository,
    taskRepository,
  });

  const updateDataTask = new UpdateDataInTaskUseCase({ taskRepository });
  const updateColumnTask = new UpdateStatusColumnInTaskUseCase({
    taskRepository,
    statusColumnRepository,
  });

  const deleteTaskUsecase = new DeleteTaskUseCase({ taskRepository });
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
  const statusColumnController = new StatusColumnController(
    getStatusColumnsUseCase,
    createStatusColumnUseCase,
    updateStatusColumnUsecase,
    deleteStatusColumnUsecase,
  );

  const subtaskController = new SubtaskController(
    getSubtasksUsecase,
    createSubtaskUsecase,
    updateSubtaskUsecase,
    deleteSubtaskUsecase,
  );

  const taskController = new TaskController(
    getTasksUseCase,
    createTaskUseCase,
    updateDataTask,
    updateColumnTask,
    deleteTaskUsecase,
  );

  //! ROUTERS
  const boardRouter = new BoardsRoutes({
    controller: boardController,
    boardMiddlewares,
  });
  const authRouter = new AuthRoutes({
    authMiddlewares,
    controller: authController,
  });
  const statusColumnRouter = new StatusColumnsRoutes({
    controller: statusColumnController,
    boardMiddlewares,
    statusColumnMiddlewares,
  });
  const taskRouter = new TaskRoutes({
    controller: taskController,
    statusColumnMiddlewares,
    taskMiddlewares,
  });
  const subtaskRouter = new SubtaskRoutes({
    controller: subtaskController,
    taskMiddlewares,
    subtaskMiddlewares,
  });

  const appRouter = new AppRoutes(
    authMiddlewares,
    authRouter,
    boardRouter,
    statusColumnRouter,
    taskRouter,
    subtaskRouter,
  );

  // !SERVER INIT

  const server = new Server({ port });
  server.setRoutes(appRouter.routes);

  const httpServer = createServer(server.app);

  httpServer.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}
