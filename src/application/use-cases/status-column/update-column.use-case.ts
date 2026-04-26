import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateStatusColumnDto } from "../../dtos";

interface UpdateStatusColumnOptions {
  userId: number;
  columnId: number;
  data: UpdateStatusColumnDto;
}

export class UpdateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async ({
    columnId,
    userId,
    data,
  }: UpdateStatusColumnOptions) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes["NO_RELATION"],
      );
    const definedProperties = getDefinedFields(data);
    const updatedColumn = await this.statusColumnRepository.update(
      columnId,
      definedProperties,
    );
    return {
      data: updatedColumn,
    };
  };
}
