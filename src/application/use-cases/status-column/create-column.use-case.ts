import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { CreateStatusColumnDto } from "../../dtos/status-column.dto";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
  boardRepository: BoardRepository;
}

interface ExecutionProps {
  userId: number;
  boardId: number;
  createStatusColumnDto: CreateStatusColumnDto;
}

export class CreateStatusColumnUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;
  private readonly boardRepository: BoardRepository;

  constructor(dependencies: ClassDependencies) {
    const { boardRepository, statusColumnRepository } = dependencies;
    this.statusColumnRepository = statusColumnRepository;
    this.boardRepository = boardRepository;
  }

  public execute = async ({
    userId,
    boardId,
    createStatusColumnDto,
  }: ExecutionProps) => {
    const existsRelationship = await this.boardRepository.checkRelation(
      userId,
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
