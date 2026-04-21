import { BoardRepository } from "../../../domain/repositories";
import { UpdateBoardDto } from "../../dtos";

export class UpdateBoardUseCase {
  constructor(private readonly boardRepository: BoardRepository) {}

  public execute = async (body: UpdateBoardDto) => {
    const { boardId, ...rawContent } = body;

    // const existingBoard = await this.boardRepository.

    const definedFields: Record<string, any> = {};
    Object.entries(rawContent).forEach(([key, value]) => {
      if (value) return (definedFields[key] = value);
    });

    const xd = await this.boardRepository.update(boardId, definedFields);
  };
}
