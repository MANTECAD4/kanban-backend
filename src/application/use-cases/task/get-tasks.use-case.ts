import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

export class GetTasksByColumnUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: TaskRepository,
  ) {}

  public execute = async (userId: number, columnId: number) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes.FORBIDDEN,
      );
    const tasks =
      await this.kanbanTaskRepository.getAllByStatusColumn(columnId);
    return { data: tasks, meta: { total: tasks.length } };
  };
}
