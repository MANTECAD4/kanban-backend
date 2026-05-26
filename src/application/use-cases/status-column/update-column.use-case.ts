import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateStatusColumnDto } from "../../dtos";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
}

interface ExecutionProps {
  userId: number;
  columnId: number;
  data: UpdateStatusColumnDto;
}

export class UpdateStatusColumnUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;

  constructor(dependencies: ClassDependencies) {
    const { statusColumnRepository } = dependencies;
    this.statusColumnRepository = statusColumnRepository;
  }

  public execute = async ({ columnId, userId, data }: ExecutionProps) => {
    const existRelation = await this.statusColumnRepository.checkRelation(
      userId,
      columnId,
    );

    if (!existRelation)
      throw CustomError.forbidden(
        `User doesn't have access to this column`,
        ErrorCodes["FORBIDDEN"],
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
