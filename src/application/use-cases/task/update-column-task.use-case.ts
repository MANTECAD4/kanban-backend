import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { UpdateColumnInTaskDto } from "../../dtos";

interface UseCaseParams {
  userId: number;
  taskId: number;
  data: UpdateColumnInTaskDto;
}

export class UpdateStatusColumnInTaskUseCase {
  constructor(
    private readonly kanbanTaskRepository: TaskRepository,
    private readonly statusColumnRepository: StatusColumnRepository,
  ) {}

  public execute = async ({
    userId,
    taskId,
    data: { statusColumnId },
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

    if (!statusColumnsInBoard.includes(statusColumnId))
      throw CustomError.badRequest(
        `New Status column doesn't belong to actual board`,
        ErrorCodes.BAD_REQUEST,
      );

    const updatedTask = await this.kanbanTaskRepository.update(taskId, {
      status_column_id: statusColumnId,
    });
    return { data: updatedTask };
  };
}
