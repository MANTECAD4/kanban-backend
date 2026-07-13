import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { SubmitStatusColumnDto } from "../../dtos";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
}

interface ExecutionProps {
  userId: number;
  columnId: number;
  data: SubmitStatusColumnDto;
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
      throw CustomError.forbidden({
        title: "Status column update failed",
        message: `User doesn't have access to this column`,
        code: ErrorCodes["FORBIDDEN"],
        details: null,
      });

    const definedProperties = getDefinedFields(data);
    const updatedColumn = await this.statusColumnRepository.update(
      columnId,
      definedProperties,
    );
    return {
      category: updatedColumn,
    };
  };
}
