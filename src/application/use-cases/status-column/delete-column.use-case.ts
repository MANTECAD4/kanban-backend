import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";

interface DeleteStatusOptions {
  userId: number;
  boardId: number;
  columnId: number;
}

export class DeleteStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async ({
    boardId,
    columnId,
    userId,
  }: DeleteStatusOptions) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      boardId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes["NO_RELATION"],
      );
    const deletedColumn = await this.statusColumnRepository.delete(columnId);
    return { data: deletedColumn, message: `` };
  };
}
