import { TaskRepository } from "../../../domain/repositories";

interface Dependencies {
  taskRepository: TaskRepository;
}

export class GetTasksMetaByCompletionUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(params: Dependencies) {
    const { taskRepository } = params;
    this.taskRepository = taskRepository;
  }
  /**
   * Returns an object including meta about subtask completion for each task
   * @param userId
   */
  public execute = async (userId: number) => {
    const tasks = await this.taskRepository.getAllByUserWithSubtasks(userId);

    let notApplicable = 0;
    let notStarted = 0;
    let started = 0;
    let completed = 0;

    tasks.forEach(({ subtasks }) => {
      if (subtasks!.length === 0) {
        return notApplicable++;
      }
      const completedSubtasks = subtasks!.filter(
        (subtask) => subtask.isCompleted === true,
      ).length;

      if (completedSubtasks === 0) return notStarted++;
      if (completedSubtasks === subtasks?.length) return completed++;

      started++;
    });

    const total = tasks.length;

    return {
      meta: {
        total,
        notApplicable,
        notStarted,
        started,
        completed,
      },
    };
  };
}
