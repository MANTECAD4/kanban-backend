import { CreateKanbanTaskDto, UpdateBoardDto } from "../../application/dtos";
import { KanbanTaskEntity } from "../entities/task.entity";

export abstract class KanbanTaskRepository {
  public abstract checkRelationship: (
    userId: number,
    taskId: number,
  ) => Promise<boolean>;
  public abstract getAll: (columnId: number) => Promise<KanbanTaskEntity[]>;
  public abstract getById: (taskId: number) => Promise<KanbanTaskEntity | null>;
  public abstract getByTitle: (
    title: string,
  ) => Promise<KanbanTaskEntity | null>;
  public abstract create: (
    columnId: number,
    data: CreateKanbanTaskDto,
  ) => Promise<KanbanTaskEntity>;
  public abstract update: (
    taskId: number,
    data: Record<string, any>,
  ) => Promise<KanbanTaskEntity>;
  public abstract delete: (taskId: number) => Promise<KanbanTaskEntity>;
}
