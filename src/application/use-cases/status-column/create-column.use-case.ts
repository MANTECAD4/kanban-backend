import { CustomError } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { TokenReturnDto } from "../../dtos";
import { CreateStatusColumnDto } from "../../dtos/status-column.dto";

export class CreateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (
    user: TokenReturnDto,
    boardId: number,
    createStatusColumnDto: CreateStatusColumnDto,
  ) => {
    const existsRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boardId,
    );
    if (!existsRelationship)
      throw CustomError.forbidden(
        `Relation doesn't exist between provided board and user.`,
      );
    const existingColumnInBoard =
      await this.statusColumnRepository.getByBoardAndName(
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
