import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { CreateTaskDto } from "../../dtos";

interface ClassDependencies {
  statusColumnRepository: StatusColumnRepository;
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  columnId: number;
  data: CreateTaskDto;
}

export class CreateTaskUseCase {
  private readonly statusColumnRepository: StatusColumnRepository;
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository, statusColumnRepository } =
      dependencies;
    this.taskRepository = kanbanTaskRepository;
    this.statusColumnRepository = statusColumnRepository;
  }

  public execute = async ({ userId, columnId, data }: ExecutionProps) => {
    const existRelation = await this.statusColumnRepository.checkRelation(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden({
        title: "Task creation failed",
        message: `User doesn't own this staus column`,
        code: ErrorCodes.FORBIDDEN,
        details: null,
      });
    const createdTask = await this.taskRepository.create(columnId, data);
    return { data: createdTask };
  };
}
