import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";

interface GetTasksParams {
  userId: number;
  boardId: number;
  columnId: number;
}

export class GetTasksUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: KanbanTaskRepository,
  ) {}

  public execute = async ({ userId, boardId, columnId }: GetTasksParams) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      boardId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `Relation between entities doesn't exist`,
        ErrorCodes.NO_RELATION,
      );
    const tasks = await this.kanbanTaskRepository.getAll(columnId);
    return { tasks, meta: { total: tasks.length } };
  };
}
