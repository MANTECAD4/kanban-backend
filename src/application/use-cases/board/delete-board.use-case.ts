import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";

interface ClassDependencies {
  boardRepository: BoardRepository;
}

export class DeleteBoardUseCase {
  private readonly boardRepository: BoardRepository;
  constructor(dependencies: ClassDependencies) {
    const { boardRepository } = dependencies;
    this.boardRepository = boardRepository;
  }
  public execute = async (userId: number, boardId: number) => {
    const existRelationship = await this.boardRepository.checkRelation(
      userId,
      boardId,
    );
    if (!existRelationship)
      throw CustomError.forbidden(
        `User doesn't own this board`,
        ErrorCodes.FORBIDDEN,
      );
    const deletedBoard = await this.boardRepository.delete(boardId);
    return {
      data: deletedBoard,
    };
  };
}
