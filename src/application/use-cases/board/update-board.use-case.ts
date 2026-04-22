import { CustomError } from "../../../domain/errors/custom-error";
import { BoardRepository } from "../../../domain/repositories";
import { UpdateBoardDto } from "../../dtos";

export class UpdateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  public execute = async (body: UpdateBoardDto) => {
    const { boardId, ...rawContent } = body;

    const existingBoard = await this.boardRepository.findById(boardId);

    if (!existingBoard)
      throw CustomError.internalServer(`Board with id ${boardId} not found.`);

    const definedFields: Record<string, any> = {};
    Object.entries(rawContent).forEach(([key, value]) => {
      if (value) return (definedFields[key] = value);
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
