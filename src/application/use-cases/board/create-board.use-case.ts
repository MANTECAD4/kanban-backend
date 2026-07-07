import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { UserRepository, BoardRepository } from "../../../domain/repositories";
import { SubmitBoardDto } from "../../dtos";

interface ClassDependencies {
  boardRepository: BoardRepository;
  userRepository: UserRepository;
}
export class CreateBoardUseCase {
  private readonly boardRepository: BoardRepository;
  private readonly userRepository: UserRepository;

  constructor(depedencies: ClassDependencies) {
    const { boardRepository, userRepository } = depedencies;
    this.boardRepository = boardRepository;
    this.userRepository = userRepository;
  }

  public execute = async (userId: number, data: SubmitBoardDto) => {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw CustomError.notFound({
        title: "Board creation failed",
        message: `User not found`,
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }

    const existingBoardInUserCollection =
      await this.boardRepository.checkCollection(userId, data.slug);
    if (existingBoardInUserCollection)
      throw CustomError.badRequest({
        title: "Board creation failed",
        message: "Name already registered in user's collection",
        code: ErrorCodes.ALREADY_REGISTERED,
        details: null,
      });
    const createdBoard = await this.boardRepository.create(userId, data);
    return {
      board: createdBoard,
    };
  };
}
