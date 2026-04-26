import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TokenReturnDto } from "../../dtos/auth.dto";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

export class GetStatusColumnsUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  public execute = async (user: TokenReturnDto, boardId: number) => {
    const existRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boardId,
    );
    if (!existRelationship)
      throw CustomError.forbidden(
        `User does not have access to columns in this board`,
        ErrorCodes["NO_RELATION"],
      );
    const columns = await this.statusColumnRepository.getAll(boardId);
    return {
      data: columns,

      meta: { total: columns.length },
    };
  };
}
