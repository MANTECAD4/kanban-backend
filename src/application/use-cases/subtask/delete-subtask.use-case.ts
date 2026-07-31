import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

interface ClassDepenencies {
  subtaskRepository: SubtaskRepository;
}

export class DeleteSubtaskUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: ClassDepenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async (subtaskId: number) => {
    const deletedSubtask = await this.subtaskRepository.delete(subtaskId);
    return { data: deletedSubtask };
  };
}
