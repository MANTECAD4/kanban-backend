import { CustomError } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

export class GetStatusColumnsUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}
  public execute = async (boardId: number) => {
    const existingBoard = await this.boardRepository.getById(boardId);
    if (!existingBoard)
      throw CustomError.internalServer(
        `Board with id ${boardId} not found. Should exist.`,
      );
    const columns = await this.statusColumnRepository.getAll(boardId);
    return {
      total: columns.length,
      columns,
    };
  };
}
