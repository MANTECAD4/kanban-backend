import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateSubtaskDto } from "../../dtos/subtask.dto";

interface ClassDepenencies {
  subtaskRepository: SubtaskRepository;
}

interface ExecutionProps {
  userId: number;
  subtaskId: number;
  data: UpdateSubtaskDto;
}

export class UpdateSubtaskUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: ClassDepenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async ({ userId, subtaskId, data }: ExecutionProps) => {
    const subtaskOwnedByUser = await this.subtaskRepository.checkRelationship(
      userId,
      subtaskId,
    );

    if (!subtaskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't have access to this subtask`,
        ErrorCodes.FORBIDDEN,
      );

    const definedProperties = getDefinedFields(data);

    const updatedSubtask = await this.subtaskRepository.update(
      subtaskId,
      definedProperties,
    );

    return { data: updatedSubtask };
  };
}
