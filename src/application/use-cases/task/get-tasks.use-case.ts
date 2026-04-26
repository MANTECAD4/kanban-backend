import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

export class GetTasksUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: KanbanTaskRepository,
  ) {}

  public execute = async (userId: number, columnId: number) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes.NO_RELATION,
      );
    const tasks = await this.kanbanTaskRepository.getAll(columnId);
    return { data: tasks, meta: { total: tasks.length } };
  };
}
