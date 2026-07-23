import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";

interface Dependencies {
  taskRepository: TaskRepository;
}

export class GetTaskBySlugUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: Dependencies) {
    const { taskRepository } = dependencies;
    this.taskRepository = taskRepository;
  }

  public execute = async (categoryId: number, taskSlug: string) => {
    const task = await this.taskRepository.getBySlug(categoryId, taskSlug);
    if (!task) {
      throw CustomError.notFound({
        title: "Not found",
        message: `Task with slug ${taskSlug} not found`,
        code: ErrorCodes.NOT_FOUND,
        details: null,
      });
    }
    return { task };
  };
}
