import { TaskRepository } from "../../../domain/repositories/task.repository";

interface Dependencies {
  taskRepository: TaskRepository;
}

export class GetUpcomingTasksUseCase {
  private readonly taskRepository: TaskRepository;

  constructor(params: Dependencies) {
    const { taskRepository } = params;
    this.taskRepository = taskRepository;
  }

  public execute = async (userId: number) => {
    const upcomingTasks = (
      await this.taskRepository.getUpcomingTasks(userId)
    ).slice(0, 5);

    return {
      tasks: upcomingTasks,
    };
  };
}
