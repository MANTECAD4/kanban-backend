import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { TokenReturnDto, UpdateBoardDto } from "../../dtos";

export class UpdateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  public execute = async (
    user: TokenReturnDto,
    boardId: number,
    data: UpdateBoardDto,
  ) => {
    const existsRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boardId,
    );

    if (!existsRelationship)
      throw CustomError.forbidden(
        `User doesn't own this board`,
        ErrorCodes.FORBIDDEN,
      );

    const definedFields = getDefinedFields(data);

    const { userId, ...rest } = await this.boardRepository.update(
      boardId,
      definedFields,
    );
    return {
      data: rest,
    };
  };
}
