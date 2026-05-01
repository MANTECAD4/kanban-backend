import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  taskId: number;
}

export class DeleteTaskUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }
  public execute = async ({ userId, taskId }: ExecutionProps) => {
    const existRelation = await this.taskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `User doesn't own this task`,
        ErrorCodes.FORBIDDEN,
      );
    const deletedTask = await this.taskRepository.delete(taskId);
    return { data: deletedTask };
  };
}
