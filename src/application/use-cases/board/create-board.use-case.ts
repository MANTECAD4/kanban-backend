import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { AuthRepository, BoardRepository } from "../../../domain/repositories";
import { CreateBoardDto } from "../../dtos";

interface ClassDependencies {
  boardRepository: BoardRepository;
  authRepository: AuthRepository;
}
export class CreateBoardUseCase {
  private readonly boardRepository: BoardRepository;
  private readonly authRepository: AuthRepository;
  constructor(depedencies: ClassDependencies) {
    const { boardRepository, authRepository } = depedencies;
    this.boardRepository = boardRepository;
    this.authRepository = authRepository;
  }

  public execute = async (userId: number, data: CreateBoardDto) => {
    const existingUser = await this.authRepository.getById(userId);
    if (!existingUser)
      throw CustomError.notFound(
        `User with id ${userId} not found`,
        ErrorCodes.NOT_FOUND,
      );

    const existingBoardInUserCollection =
      await this.boardRepository.getByUserAndBoardName(userId, data.name);
    if (existingBoardInUserCollection)
      throw CustomError.badRequest(
        "Name already registered in user's collection",
        ErrorCodes.ALREADY_REGISTERED,
      );
    const createdBoard = await this.boardRepository.create(userId, data);
    return {
      data: createdBoard,
    };
  };
}
