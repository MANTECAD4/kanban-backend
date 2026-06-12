import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

interface ClassDepenencies {
  subtaskRepository: SubtaskRepository;
}

interface ExecutionProps {
  userId: number;
  subtaskId: number;
}

export class DeleteSubtaskUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: ClassDepenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async ({ userId, subtaskId }: ExecutionProps) => {
    const subtaskOwnedByUser = await this.subtaskRepository.checkRelation(
      userId,
      subtaskId,
    );
    if (!subtaskOwnedByUser)
      throw CustomError.forbidden({
        title: "Subtask deletion failed",
        message: `User doesn't have access to this subtask`,
        code: ErrorCodes.FORBIDDEN,
        details: null,
      });
    const deletedSubtask = await this.subtaskRepository.delete(subtaskId);
    return { data: deletedSubtask };
  };
}
