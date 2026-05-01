import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { AccessTokenReturnDto } from "../../dtos";
import { CreateStatusColumnDto } from "../../dtos/status-column.dto";

export class CreateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly boardRepository: BoardRepository,
  ) {}

  public execute = async (
    user: AccessTokenReturnDto,
    boardId: number,
    createStatusColumnDto: CreateStatusColumnDto,
  ) => {
    const existsRelationship = await this.boardRepository.checkRelationship(
      user.sub.id,
      boardId,
    );
    if (!existsRelationship)
      throw CustomError.forbidden(
        `User doesn't own this board`,
        ErrorCodes["FORBIDDEN"],
      );
    const existingColumnInBoard =
      await this.statusColumnRepository.getByBoardAndName(
        boardId,
        createStatusColumnDto.name,
      );

    if (existingColumnInBoard)
      throw CustomError.badRequest(
        "Status column name is already registered in this board's collection",
        ErrorCodes["ALREADY_REGISTERED"],
      );

    const createdColumn = await this.statusColumnRepository.create(
      boardId,
      createStatusColumnDto,
    );

    return {
      data: createdColumn,
    };
  };
}
