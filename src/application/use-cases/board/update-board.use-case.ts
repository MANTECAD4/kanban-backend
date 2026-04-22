import { CustomError } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { TokenReturnDto, UpdateBoardDto } from "../../dtos";

export class UpdateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  public execute = async (boardId: number, body: UpdateBoardDto) => {
    if (!body)
      throw CustomError.badRequest(
        "At least one property is required. Received none.",
      );
    const existingBoard = await this.boardRepository.findById(boardId);

    if (!existingBoard)
      throw CustomError.internalServer(`Board with id ${boardId} not found.`);

    const definedFields: Record<string, any> = {};
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) return (definedFields[key] = value);
    });

    if (Object.keys(definedFields).length === 0)
      throw CustomError.badRequest(
        "No values were recieved for board updating.",
      );

    const { userId, ...rest } = await this.boardRepository.update(
      boardId,
      definedFields,
    );
    return {
      board: rest,
    };
  };
}
