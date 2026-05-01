import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  BoardRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
  boardRepository: BoardRepository;
}

interface ExecutioProps {
  userId: number;
  boardId: number;
}

export class GetStatusColumnsUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;
  private readonly boardRepository: BoardRepository;

  constructor(dependencies: ClassDependencies) {
    const { boardRepository, statusColumnRepository } = dependencies;
    this.statusColumnRepository = statusColumnRepository;
    this.boardRepository = boardRepository;
  }
  public execute = async ({ userId, boardId }: ExecutioProps) => {
    const existRelationship = await this.boardRepository.checkRelationship(
      userId,
      boardId,
    );
    if (!existRelationship)
      throw CustomError.forbidden(
        `User does not have access to columns in this board`,
        ErrorCodes["FORBIDDEN"],
      );
    const columns = await this.statusColumnRepository.getAll(boardId);
    return {
      data: columns,

      meta: { total: columns.length },
    };
  };
}
