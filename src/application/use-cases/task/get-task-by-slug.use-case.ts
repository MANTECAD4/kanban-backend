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

    return { task };
  };
}
