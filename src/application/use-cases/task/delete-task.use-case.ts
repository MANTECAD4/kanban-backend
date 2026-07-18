import { TaskRepository } from "../../../domain/repositories";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

export class DeleteTaskUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }
  public execute = async (taskId: number) => {
    const deletedTask = await this.taskRepository.delete(taskId);
    return { task: deletedTask };
  };
}
