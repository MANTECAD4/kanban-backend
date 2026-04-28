import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { KanbanTaskRepository } from "../../../domain/repositories";

interface UseCaseParams {
  userId: number;
  taskId: number;
  newOrder: number;
}

export class UpdateOrderInTaskUseCase {
  constructor(private readonly kanbanTaskRepository: KanbanTaskRepository) {}

  public execute = async ({ userId, taskId, newOrder }: UseCaseParams) => {
    const taskOwnedByUser = await this.kanbanTaskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't own this task`,
        ErrorCodes.FORBIDDEN,
      );

    const tasksInColumn = await this.kanbanTaskRepository.getAll(
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
