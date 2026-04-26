import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";

export class DeleteStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async (userId: number, columnId: number) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes["NO_RELATION"],
      );
    const deletedColumn = await this.statusColumnRepository.delete(columnId);
    return {
      data: deletedColumn,
    };
  };
}
