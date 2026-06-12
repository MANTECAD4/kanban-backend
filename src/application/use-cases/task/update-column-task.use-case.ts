import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { UpdateColumnInTaskDto } from "../../dtos";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  taskId: number;
  data: UpdateColumnInTaskDto;
}

export class UpdateStatusColumnInTaskUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository, statusColumnRepository } =
      dependencies;
    this.taskRepository = kanbanTaskRepository;
    this.statusColumnRepository = statusColumnRepository;
  }

  public execute = async ({
    userId,
    taskId,
    data: { statusColumnId },
  }: ExecutionProps) => {
    const taskOwnedByUser = await this.taskRepository.checkRelation(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden({
        title: "Task update failed",
        message: "User doesn't own this task",
        code: ErrorCodes.FORBIDDEN,
        details: null,
      });

    const currentStatusColumn = await this.statusColumnRepository.getById(
      taskOwnedByUser.statusColumnId,
    );

    const statusColumnsInBoard = (
      await this.statusColumnRepository.getAll(currentStatusColumn!.boardId)
    ).map(({ id }) => id);

    if (!statusColumnsInBoard.includes(statusColumnId))
      throw CustomError.badRequest({
        title: "Task update failed",
        message: `New Status column doesn't belong to actual board`,
        code: ErrorCodes.BAD_REQUEST,
        details: null,
      });

    const updatedTask = await this.taskRepository.update(taskId, {
      status_column_id: statusColumnId,
    });
    return { data: updatedTask };
  };
}
