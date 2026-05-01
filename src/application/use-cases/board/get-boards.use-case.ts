import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";

interface ClassDependencies {
  authRepository: AuthRepository;
  boardRepository: BoardRepository;
}

export class GetBoardsUseCase {
  private readonly authRepository: AuthRepository;
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { authRepository, boardRepository } = dependencies;
    this.authRepository = authRepository;
    this.boardRepository = boardRepository;
  }

  public execute = async (userId: number) => {
    const existingUser = await this.authRepository.getById(userId);
    if (!existingUser)
      throw CustomError.notFound(
        `User with id ${userId} not found`,
        ErrorCodes["NOT_FOUND"],
      );
    const boards = await this.boardRepository.getAll(userId);
    return {
      data: boards,

      meta: { total: boards.length },
    };
  };
}
