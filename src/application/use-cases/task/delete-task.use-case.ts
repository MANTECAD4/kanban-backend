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
    const existRelation = await this.taskRepository.checkRelation(
      userId,
      taskId,
    );
    if (!existRelation)
      throw CustomError.forbidden({
        title: "Task deletion failed",
        message: `User doesn't own this task`,
        code: ErrorCodes.FORBIDDEN,
        details: null,
      });
    const deletedTask = await this.taskRepository.delete(taskId);
    return { data: deletedTask };
  };
}
