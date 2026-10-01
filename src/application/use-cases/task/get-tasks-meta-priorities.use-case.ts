import { TaskPriority } from "../../../domain/entities";
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
    const tasks = await this.taskRepository.getAllByUser(userId);
    const total = tasks.length;
    const low = tasks.filter(
      (task) => task.priority === TaskPriority.Low,
    ).length;
    const medium = tasks.filter(
      (task) => task.priority === TaskPriority.Medium,
    ).length;
    const high = tasks.filter(
      (task) => task.priority === TaskPriority.High,
    ).length;
    const urgent = tasks.filter(
      (task) => task.priority === TaskPriority.Urgent,
    ).length;

    const meta = { total, low, medium, high, urgent };
    return { meta };
  };
}
