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
    return {
      subtasks,
      meta: { total: subtasks.length },
    };
  };
}
