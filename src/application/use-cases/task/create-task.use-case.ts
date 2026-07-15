import { TaskRepository } from "../../../domain/repositories";
import { SubmitTaskDto } from "../../dtos";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

export class CreateTaskUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }

  public execute = async (categoryId: number, data: SubmitTaskDto) => {
    const createdTask = await this.taskRepository.create(categoryId, data);
    return { task: createdTask };
  };
}
