import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

interface ClassDependencies {
  subtaskRepository: SubtaskRepository;
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  taskId: number;
}

export class GetSubtasksUseCase {
  private readonly subtaskRepository: SubtaskRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { subtaskRepository, taskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
    this.taskRepository = taskRepository;
  }

  public execute = async ({ userId, taskId }: ExecutionProps) => {
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
