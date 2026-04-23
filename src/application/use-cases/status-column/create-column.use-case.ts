import { CustomError } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { CreateStatusColumnDto } from "../../dtos/status-column.dto";

export class CreateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async (
    boardId: number,
    createStatusColumnDto: CreateStatusColumnDto,
  ) => {
    const existingColumnInBoard =
      await this.statusColumnRepository.findByBoardAndName(
        boardId,
        createStatusColumnDto.name as string,
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
