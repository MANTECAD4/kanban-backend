import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import { KanbanTaskRepository } from "../../../domain/repositories";

export class DeleteKanbanTaskUseCase {
  constructor(private readonly kanbanTaskRepository: KanbanTaskRepository) {}
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
