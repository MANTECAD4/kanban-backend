import { CustomError } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateStatusColumnDto } from "../../dtos";

export class UpdateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async (columnId: number, data: UpdateStatusColumnDto) => {
    const existingColumn = await this.statusColumnRepository.getById(columnId);
    if (!existingColumn)
      throw CustomError.internalServer(
        `Status column with id ${columnId} not found. Should exist.`,
      );
    const definedProperties = getDefinedFields(data);
    const updatedColumn = await this.statusColumnRepository.update(
      columnId,
      definedProperties,
    );
    return {
      column: updatedColumn,
    };
  };
}
