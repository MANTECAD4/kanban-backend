import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";

interface UseCaseParams {
  userId: number;
  taskId: number;
  newOrder: number;
}

export class UpdateOrderInTaskUseCase {
  constructor(private readonly kanbanTaskRepository: TaskRepository) {}

  public execute = async ({ userId, taskId, newOrder }: UseCaseParams) => {
    const taskOwnedByUser = await this.kanbanTaskRepository.checkRelation(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden({
        title: "Task update failed",
        message: `User doesn't own this task`,
        code: ErrorCodes.FORBIDDEN,
        details: null,
      });

    const tasksInColumn = await this.kanbanTaskRepository.getAllByStatusColumn(
      taskOwnedByUser.statusColumnId,
    );
    let order = newOrder;
    if (newOrder > tasksInColumn.length) {
      order = tasksInColumn.length;
    } else if (newOrder < 1) {
      order = 1;
    }

    const updatedTask = await this.kanbanTaskRepository.update(taskId, {
      order,
    });

    return { data: updatedTask };
  };
}
