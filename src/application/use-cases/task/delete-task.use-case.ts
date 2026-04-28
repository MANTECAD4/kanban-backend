import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { TaskRepository } from "../../../domain/repositories";

export class DeleteTaskUseCase {
  constructor(private readonly kanbanTaskRepository: TaskRepository) {}
  public execute = async (userId: number, taskId: number) => {
    const existRelation = await this.kanbanTaskRepository.checkRelationship(
      userId,
      taskId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `User doesn't own this task`,
        ErrorCodes.NO_RELATION,
      );
    const deletedTask = await this.kanbanTaskRepository.delete(taskId);
    return { data: deletedTask };
  };
}
