import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  CategoryRepository,
} from "../../../domain/repositories";

interface ClassDependencies {
  statusColumnRepository: CategoryRepository;
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  taskId: number;
  statusColumnId: number;
}

export class UpdateStatusColumnInTaskUseCase {
  private readonly statusColumnRepository: CategoryRepository;
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
    statusColumnId,
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

    const updatedTask = await this.taskRepository.updateTaskCategory(
      taskId,
      statusColumnId,
    );
    return { data: updatedTask };
  };
}
