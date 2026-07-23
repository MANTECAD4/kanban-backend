import { TaskRepository } from "../../../domain/repositories";

export class UpdateOrderInTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public execute = async (taskId: number, order: number) => {
    const updatedTask = await this.taskRepository.updateOrder(taskId, order);

    return { task: updatedTask };
  };
}
