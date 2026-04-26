import { CreateTaskDto, UpdateBoardDto } from "../../application/dtos";
import { TaskEntity } from "../entities/task.entity";

export interface RelationshipParams {
  userId: number;
  boardId: number;
  columnId: number;
  taskId: number;
}

export abstract class KanbanTaskRepository {
  public abstract checkRelationship: (
    options: RelationshipParams,
  ) => Promise<boolean>;
  public abstract getAll: (columnId: number) => Promise<TaskEntity[]>;
  public abstract getById: (taskId: number) => Promise<TaskEntity | null>;
  public abstract getByTitle: (title: string) => Promise<TaskEntity | null>;
  public abstract create: (
    columnId: number,
    data: CreateTaskDto,
  ) => Promise<TaskEntity>;
  public abstract update: (
    taskId: number,
    data: Record<string, any>,
  ) => Promise<TaskEntity>;
  public abstract delete: (taskId: number) => Promise<TaskEntity>;
}
