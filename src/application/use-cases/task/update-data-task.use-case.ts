import { TaskRepository } from "../../../domain/repositories";
import { SubmitTaskDto } from "../../dtos";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

export class UpdateDataInTaskUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }
  public execute = async (taskId: number, data: SubmitTaskDto) => {
    const updatedTask = await this.taskRepository.update(taskId, data);
    return { data: updatedTask };
  };
}
