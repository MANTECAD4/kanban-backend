import { TaskRepository } from "../../../domain/repositories";

interface Dependencies {
  taskRepository: TaskRepository;
}

export class GetTasksMetaPrioritiesUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(params: Dependencies) {
    const { taskRepository } = params;
    this.taskRepository = taskRepository;
  }

  public execute = async (userId: number) => {
    const meta = await this.taskRepository.getMetaByPriority(userId);
    return { meta };
  };
}
