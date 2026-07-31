import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

interface ClassDependencies {
  subtaskRepository: SubtaskRepository;
}

export class GetSubtasksUseCase {
  private readonly subtaskRepository: SubtaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }

  public execute = async (taskId: number) => {
    const subtasks = await this.subtaskRepository.getAllByTask(taskId);
    const numberCompletedSubtasks = subtasks.filter(
      (subtask) => subtask.isCompleted,
    ).length;
    return {
      subtasks,
      meta: { total: subtasks.length, completed: numberCompletedSubtasks },
    };
  };
}
