import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  TaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { CreateTaskDto } from "../../dtos";

interface CreateKanbanTaskParams {
  userId: number;
  columnId: number;
  data: CreateTaskDto;
}

export class CreateTaskUseCase {
  constructor(
    private readonly statusColumnRepository: StatusColumnRepository,
    private readonly kanbanTaskRepository: TaskRepository,
  ) {}

  public execute = async ({
    userId,
    columnId,
    data,
  }: CreateKanbanTaskParams) => {
    const existRelation = await this.statusColumnRepository.checkRelationship(
      userId,
      columnId,
    );
    if (!existRelation)
      throw CustomError.forbidden(
        `User doesn't own this staus column`,
        ErrorCodes.NO_RELATION,
      );
    const createdTask = await this.kanbanTaskRepository.create(columnId, data);
    return { data: createdTask };
  };
}
