import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

export class GetTasksByColumnUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }

  public execute = async (categoryId: number) => {
    const tasks = await this.taskRepository.getAllByStatusColumn(categoryId);
    if (tasks.length === 0) {
      throw CustomError.notFound({
        title: "Not found",
        message: "No tasks found for this category",
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }
    return { tasks: tasks, meta: { total: tasks.length } };
  };
}
