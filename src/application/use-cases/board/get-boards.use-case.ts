import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository, BoardRepository } from "../../../domain/repositories";

interface ClassDependencies {
  userRepository: UserRepository;
  boardRepository: BoardRepository;
}

export class GetBoardsUseCase {
  private readonly userRepository: UserRepository;
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { userRepository, boardRepository } = dependencies;
    this.userRepository = userRepository;
    this.boardRepository = boardRepository;
  }

  public execute = async (userId: number) => {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw CustomError.notFound({
        title: "Loading boards failed",
        message: `User not found`,
        code: ErrorCodes["NOT_FOUND"],
        details: null,
      });
    }
    const boards = await this.boardRepository.getAll(userId);
    return {
      data: boards,

      meta: { total: boards.length },
    };
  };
}
