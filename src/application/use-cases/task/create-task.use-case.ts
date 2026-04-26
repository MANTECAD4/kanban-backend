import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { CreateTaskDto } from "../../dtos";

interface CreateKanbanTaskParams {
  userId: number;
  boardId: number;
  columnId: number;
  data: CreateTaskDto;
}

export class CreateTaskUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: KanbanTaskRepository,
  ) {}

  public execute = async ({
    userId,
    boardId,
    columnId,
    data,
  }: CreateKanbanTaskParams) => {
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
    const createdTask = await this.kanbanTaskRepository.create(columnId, data);
    return { data: createdTask };
  };
}
