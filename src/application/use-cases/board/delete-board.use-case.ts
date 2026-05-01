import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { AccessTokenReturnDto } from "../../dtos";

export class DeleteBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}
  public execute = async (user: AccessTokenReturnDto, boardId: number) => {
    const existRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
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
