import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";

interface Depenencies {
  subtaskRepository: SubtaskRepository;
}

export class UpdateSubtaskDescriptionUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: Depenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async (subtaskId: number, description: string) => {
    const updatedSubtask = await this.subtaskRepository.updateDescription(
      subtaskId,
      description,
    );

    return { subtask: updatedSubtask };
  };
}
