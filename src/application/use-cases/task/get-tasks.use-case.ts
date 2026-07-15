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
    return { tasks: tasks, meta: { total: tasks.length } };
  };
}
