import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { TokenReturnDto } from "../../dtos";

export class DeleteBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}
  public execute = async (user: TokenReturnDto, boardId: number) => {
    const existRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boardId,
    );
    if (!existRelationship)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes.NO_RELATION,
      );
    const deletedBoard = await this.boardRepository.delete(boardId);
    return {
      data: deletedBoard,
    };
  };
}
