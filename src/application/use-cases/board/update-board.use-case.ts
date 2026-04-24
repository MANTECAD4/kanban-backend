import { CustomError } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateBoardDto } from "../../dtos";

export class UpdateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  public execute = async (boardId: number, data: UpdateBoardDto) => {
    if (!data)
      throw CustomError.badRequest(
        "At least one property is required. Received none.",
      );
    const existingBoard = await this.boardRepository.findById(boardId);

    if (!existingBoard)
      throw CustomError.internalServer(`Board with id ${boardId} not found.`);

    const definedFields = getDefinedFields(data);

    const { userId, ...rest } = await this.boardRepository.update(
      boardId,
      definedFields,
    );
    return {
      board: rest,
    };
  };
}
