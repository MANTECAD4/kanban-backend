import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

export class GetSubtasksUseCase {
  constructor(
    private readonly subtaskRepository: SubtaskRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  public execute = async (userId: number, taskId: number) => {
    const taskOwnedByUser = await this.taskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't own this task. Can't insert here`,
        ErrorCodes.FORBIDDEN,
      );
    const subtasks = await this.subtaskRepository.getAllByTask(taskId);
    return {
      data: subtasks,
      meta: { total: subtasks.length },
    };
  };
}
