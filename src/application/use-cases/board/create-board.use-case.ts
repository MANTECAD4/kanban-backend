import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { SubmitBoardDto } from "../../dtos";

interface ClassDependencies {
  boardRepository: BoardRepository;
}
export class CreateBoardUseCase {
  private readonly boardRepository: BoardRepository;

  constructor(depedencies: ClassDependencies) {
    const { boardRepository } = depedencies;
    this.boardRepository = boardRepository;
  }

  public execute = async (userId: number, data: SubmitBoardDto) => {
    const existingBoardInUserCollection =
      await this.boardRepository.checkRelation(userId, data.slug);
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
