import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";
import { ChangeSubtaskStatusDto } from "../../dtos";

interface Depenencies {
  subtaskRepository: SubtaskRepository;
}

export class UpdateSubtaskStatusUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: Depenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async (subtaskId: number, data: ChangeSubtaskStatusDto) => {
    const updatedSubtask = await this.subtaskRepository.updateCompletionStatus(
      subtaskId,
      data,
    );

    return { subtask: updatedSubtask };
  };
}
