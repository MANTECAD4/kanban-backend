import { CustomError } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";

export class DeleteStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async (columnId: number) => {
    const existingColumn = await this.statusColumnRepository.getById(columnId);
    if (!existingColumn)
      throw CustomError.internalServer(
        `Status column with id ${columnId} not found. Should exist.`,
      );
    const deletedColumn = await this.statusColumnRepository.delete(columnId);
    return { column: deletedColumn };
  };
}
