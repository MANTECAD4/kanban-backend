import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";
import { SubtaskRepository } from "../../../domain/repositories/subtask.repository";
import { CreateSubtaskDto } from "../../dtos/subtask.dto";

interface ExecutionProps {
  userId: number;
  taskId: number;
  data: CreateSubtaskDto;
}

export class CreateSubtaskUseCase {
  constructor(
    private readonly subtaskRepository: SubtaskRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  public execute = async ({ userId, taskId, data }: ExecutionProps) => {
    const taskOwnedByUser = await this.taskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!taskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't have access to specified task`,
        ErrorCodes.FORBIDDEN,
      );
    const createdSubtask = await this.subtaskRepository.create(taskId, data);
    return {
      data: createdSubtask,
    };
  };
}
