import { CustomError } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateStatusColumnDto } from "../../dtos";

interface UpdateStatusColumnOptions {
  userId: number;
  boardId: number;
  columnId: number;
  data: UpdateStatusColumnDto;
}

export class UpdateStatusColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async ({
    boardId,
    columnId,
    userId,
    data,
  }: UpdateStatusColumnOptions) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      boardId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(`Realtion between entities doesn't match`);
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
