import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateDataInTaskDto } from "../../dtos";

interface ClassDependencies {
  taskRepository: TaskRepository;
}

interface ExecutionProps {
  userId: number;
  taskId: number;
  data: UpdateDataInTaskDto;
}

export class UpdateDataInTaskUseCase {
  private readonly taskRepository: TaskRepository;
  constructor(dependencies: ClassDependencies) {
    const { taskRepository: kanbanTaskRepository } = dependencies;
    this.taskRepository = kanbanTaskRepository;
  }
  public execute = async ({ userId, taskId, data }: ExecutionProps) => {
    const taskOwnedByUser = await this.taskRepository.checkRelation(
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

    const definedProperties = getDefinedFields(data);

    const updatedTask = await this.taskRepository.update(
      taskId,
      definedProperties,
    );
    return { data: updatedTask };
  };
}
