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
import { RegisterUserUseCase } from "./application/use-cases/auth/register-user.use-case";
import { LoginUserUseCase } from "./application/use-cases";

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

  const loginUserUseCase = new LoginUserUseCase({
    acccesTokenDuration,
    refreshTokenDuration,
    authRepository,
    tokenProvider,
    strongHasher,
    // TODO: change for the crypto implementation
    softHasher: strongHasher,
  });
  const registerUserUseCase = new RegisterUserUseCase();

  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
  );

  //! SUB ROUTERS
  const boardRouter = new BoardsRoutes(authRepository, boardRepository);
  const authRouter = new AuthRoutes({
    authMiddlewares,
    controller: authController,
  });
  const statusColumnRouter = new StatusColumnsRoutes(
    statusColumnRepository,
    boardRepository,
  );
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
