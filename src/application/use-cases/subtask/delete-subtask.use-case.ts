import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

export class DeleteSubtaskUseCase {
  constructor(private readonly subtaskRepository: SubtaskRepository) {}
  public execute = async (userId: number, subtaskId: number) => {
    const subtaskOwnedByUser = await this.subtaskRepository.checkRelationship(
      userId,
      subtaskId,
    );
    if (!subtaskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't have access to this subtask`,
        ErrorCodes.FORBIDDEN,
      );
    const deletedSubtask = await this.subtaskRepository.delete(subtaskId);
    return { data: deletedSubtask };
  };
}
