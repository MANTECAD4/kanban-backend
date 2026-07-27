import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";
import { SubmitSubtaskDto } from "../../dtos";

interface Depenencies {
  subtaskRepository: SubtaskRepository;
}

export class UpdateSubtaskDescriptionUseCase {
  private readonly subtaskRepository: SubtaskRepository;

  constructor(dependencies: Depenencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }
  public execute = async (subtaskId: number, data: SubmitSubtaskDto) => {
    const updatedSubtask = await this.subtaskRepository.updateDescription(
      subtaskId,
      data,
    );

    return { subtask: updatedSubtask };
  };
}
