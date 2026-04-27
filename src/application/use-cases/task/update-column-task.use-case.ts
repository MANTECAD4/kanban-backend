import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

interface UseCaseParams {
  userId: number;
  newStatusColumnId: number;
  taskId: number;
}

export class UpdateStatusColumnInKanbanTaskUseCase {
  constructor(
    private readonly kanbanTaskRepository: KanbanTaskRepository,
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async ({
    userId,
    taskId,
    newStatusColumnId,
  }: UseCaseParams) => {
    const taskOwnedByUser = await this.kanbanTaskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden(
        "User doesn't own this task",
        ErrorCodes.NO_RELATION,
      );

    const currentStatusColumn = await this.statusColumnRepository.getById(
      taskOwnedByUser.statusColumnId,
    );

    const statusColumnsInBoard = (
      await this.statusColumnRepository.getAll(currentStatusColumn!.boardId)
    ).map(({ id }) => id);

    if (!statusColumnsInBoard.includes(newStatusColumnId))
      throw CustomError.badRequest(
        `New Status column doesn't belong to actual board`,
        ErrorCodes.BAD_REQUEST,
      );

    const updatedTask = await this.kanbanTaskRepository.update(taskId, {
      status_column_id: newStatusColumnId,
    });
    return { data: updatedTask };
  };
}
