import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  columnId: number;
}

export class GetTasksByColumnUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository, statusColumnRepository } =
      dependencies;
    this.taskRepository = kanbanTaskRepository;
    this.statusColumnRepository = statusColumnRepository;
  }

  public execute = async ({ userId, columnId }: ExecutionProps) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes.FORBIDDEN,
      );
    const tasks = await this.taskRepository.getAllByStatusColumn(columnId);
    return { data: tasks, meta: { total: tasks.length } };
  };
}
