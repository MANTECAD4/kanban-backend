import { CustomError } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { CreateStatusColumnDto } from "../../dtos/status-column.dto";

export class CreateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (
    boardId: number,
    createStatusColumnDto: CreateStatusColumnDto,
  ) => {
    const existingBoard = await this.boardRepository.findById(boardId);
    if (!existingBoard)
      throw CustomError.internalServer(
        `Board with id ${boardId} not found for status column creation.`,
      );
    const existingColumnInBoard =
      await this.statusColumnRepository.findByBoardAndName(
        boardId,
        createStatusColumnDto.name,
      );

    if (existingColumnInBoard)
      throw CustomError.badRequest(
        "Name already registered in this board collection.",
      );

    const createdColumn = await this.statusColumnRepository.create(
      boardId,
      createStatusColumnDto,
    );

    return {
      column: createdColumn,
    };
  };
}
