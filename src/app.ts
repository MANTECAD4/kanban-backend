import { createServer } from "node:http";
import { Server } from "./presentation/server";
import { envs } from "./configs/envs";

import {
  PostgresUserRepository,
  PostgresBoardRepository,
  PostgresRefreshTokenRepository,
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
import { RefreshTokenPersistencyService } from "./domain/services/refresh-token-persistency.service";

import {
  LoginUseCase,
  LogoutUseCase,
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
import { RefreshTokenUseCase } from "./application/use-cases/auth/refresh-token.use-case";
import { GetUserInfoUseCase } from "./application/use-cases/user/get-me-info.use-case";

import { AuthController } from "./presentation/auth/controller";
import { BoardController } from "./presentation/board/controller";
import { StatusColumnController } from "./presentation/status-column/controller";
import { TaskController } from "./presentation/task/controller";
import { SubtaskController } from "./presentation/subtask/controller";
import { UserController } from "./presentation/user/controller";
import { ProjectController } from "./presentation/project/controller";

import { AppRoutes } from "./presentation/routes";
import { AuthRoutes } from "./presentation/auth/routes";
import { BoardsRoutes } from "./presentation/board/routes";
import { StatusColumnsRoutes } from "./presentation/status-column/routes";
import { TaskRoutes } from "./presentation/task/routes";
import { ProjectRoutes } from "./presentation/project/routes";
import { SubtaskRoutes } from "./presentation/subtask/routes";
import { UserRoutes } from "./presentation/user/routes";
import { CreateProjectUseCase } from "./application/use-cases/project/create-project.use-case";
import { PostgresProjectRepository } from "./infraestructure/repositories/postgres-project.repository";
import { ProjectMiddlewares } from "./presentation/project/middlewares";
import { GetUserProjectsUseCase } from "./application/use-cases/project/get-user-projects.use-case";
import { GetProjectBySlugUseCase } from "./application/use-cases/project/get-project-by-slug.use-case";
import { UpdateProjectUseCase } from "./application/use-cases/project/update-project.use-case";

(async () => {
  main();
})();

function main() {
  //! ENVIROMENT VARIABLES
  const {
    PORT: port,
    TOKEN_SECRET,
    ACCESS_TOKEN_DURATION: accessTokenDuration,
    REFRESH_TOKEN_DURATION: refreshTokenDuration,
  } = envs();

  //! REPOSITORIES
  const userRepository = new PostgresUserRepository();
  const boardRepository = new PostgresBoardRepository();
  const statusColumnRepository = new PostgresStatusColumnRepository();
  const taskRepository = new PostgresTaskRepository();
  const subtaskRepository = new PostgresSubtaskRepository();
  const refreshTokenRepository = new PostgresRefreshTokenRepository();
  const projectRepository = new PostgresProjectRepository();

  //! SERVCIES
  const tokenProvider = new JwtGenerator(TOKEN_SECRET);
  const strongHasher = new BycryptHasher();
  const softHasher = new CryptoHasher();

  //! APPLICATION SERVICES
  const refreshTokenPersistencyService = new RefreshTokenPersistencyService({
    hasherService: softHasher,
    refreshTokenRepository,
    tokenProvider,
  });

  //! MIDDLEWARES
  const authMiddlewares = new AuthMiddlewares({
    tokenProvider,
    softHashService: softHasher,
    refreshTokenPersistencyService,
  });
  const boardMiddlewares = new BoardMiddlewares();
  const statusColumnMiddlewares = new StatusColumnMiddlewares();
  const taskMiddlewares = new TaskMiddlewares();
  const subtaskMiddlewares = new SubtaskMiddlewares();
  const projectMiddlewares = new ProjectMiddlewares();

  //////////////// ! USE CASES ////////////////
  // AUTH
  const loginUserUseCase = new LoginUseCase({
    accessTokenDuration,
    refreshTokenDuration,
    userRepository,
    tokenProvider,
    strongHasher,
    refreshTokenPersistencyService,
  });

  const registerUserUseCase = new RegisterUserUseCase({
    userRepository,
    strongHasher,
    tokenProvider,
    accessTokenDuration,
    refreshTokenDuration,
    refreshTokenPersistencyService,
  });

  const refreshTokenUseCase = new RefreshTokenUseCase({
    refreshTokenRepository,
    tokenProvider,
    refreshTokenPersistencyService,
    refreshTokenDuration,
    accessTokenDuration,
  });

  const logoutUseCase = new LogoutUseCase({
    refreshTokenRepository,
  });

  // BOARDS
  const createBoardUseCase = new CreateBoardUseCase({
    boardRepository,
    userRepository,
  });

  const getBoardsUseCase = new GetBoardsUseCase({
    userRepository,
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

  // USERS
  const getUserInfoUseCase = new GetUserInfoUseCase({
    userRepository,
    tokenProvider,
    accessTokenDuration,
  });

  const deleteTaskUsecase = new DeleteTaskUseCase({ taskRepository });

  // PROJECTS

  const createProjectUseCase = new CreateProjectUseCase({
    projectRepository,
    userRepository,
  });

  const getUserProjectsUseCase = new GetUserProjectsUseCase({
    projectRepository,
    userRepository,
  });

  const getProjectBySlugUseCase = new GetProjectBySlugUseCase({
    projectRepository,
    userRepository,
  });

  const updateProjectUseCase = new UpdateProjectUseCase({ projectRepository });

  //////////////// ! CONTROLLERS ////////////////
  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    logoutUseCase,
    refreshTokenUseCase,
    refreshTokenDuration,
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

  const userController = new UserController({
    getUserInfoUseCase,
  });

  const projectController = new ProjectController(
    createProjectUseCase,
    getUserProjectsUseCase,
    getProjectBySlugUseCase,
    updateProjectUseCase,
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

  const userRouter = new UserRoutes({
    controller: userController,
    authMiddlewares,
  });

  const projectRoutes = new ProjectRoutes({
    controller: projectController,
    projectMiddlewares,
  });

  const appRouter = new AppRoutes(
    authMiddlewares,
    authRouter,
    boardRouter,
    statusColumnRouter,
    taskRouter,
    subtaskRouter,
    userRouter,
    projectRoutes,
  );

  // !SERVER INIT

  const server = new Server({ port });
  server.setRoutes(appRouter.routes);

  const httpServer = createServer(server.app);

  httpServer.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}
