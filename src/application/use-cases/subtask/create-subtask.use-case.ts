import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";
import { SubmitSubtaskDto } from "../../dtos/subtask.dto";

interface ClassDependencies {
  subtaskRepository: SubtaskRepository;
}

export class CreateSubtaskUseCase {
  private readonly subtaskRepository: SubtaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { subtaskRepository } = dependencies;
    this.subtaskRepository = subtaskRepository;
  }

  public execute = async (taskId: number, data: SubmitSubtaskDto) => {
    const createdSubtask = await this.subtaskRepository.create(taskId, data);
    return {
      subtask: createdSubtask,
    };
  };
}
