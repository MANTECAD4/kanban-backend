import { CustomError, ErrorCodes } from "../../../domain/errors/custom-error";
import {
  KanbanTaskRepository,
  StatusColumnRepository,
} from "../../../domain/repositories";
import { getDefinedFields } from "../../../domain/services/get-defined-fields.service";
import { UpdateKanbanTaskDto } from "../../dtos";

interface UpdateKanbanTaskParams {
  userId: number;
  taskId: number;
  data: UpdateKanbanTaskDto;
}
export class UpdateDataInKanbanTaskUseCase {
  constructor(private readonly kanbanTaskRepository: KanbanTaskRepository) {}
  public execute = async ({ userId, taskId, data }: UpdateKanbanTaskParams) => {
    const taskOwnedByUser = await this.kanbanTaskRepository.checkRelationship(
      userId,
      taskId,
    );

    if (!taskOwnedByUser)
      throw CustomError.forbidden(
        `User doesn't own this task`,
        ErrorCodes.NO_RELATION,
      );

    const definedProperties = getDefinedFields(data);

    const updatedTask = await this.kanbanTaskRepository.update(
      taskId,
      definedProperties,
    );
    return { data: updatedTask };
  };
}
