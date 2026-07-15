import { SubmitTaskDto } from "../../application/dtos";
import { TaskEntity } from "../entities/task.entity";

export abstract class TaskRepository {
  public abstract checkRelation: (
    userId: number,
    taskId: number,
  ) => Promise<TaskEntity | null>;
  public abstract getAllByStatusColumn: (
    columnId: number,
  ) => Promise<TaskEntity[]>;
  public abstract getById: (taskId: number) => Promise<TaskEntity | null>;
  public abstract create: (
    columnId: number,
    data: SubmitTaskDto,
  ) => Promise<TaskEntity>;
  public abstract update: (
    taskId: number,
    data: SubmitTaskDto,
  ) => Promise<TaskEntity>;
  public abstract updateTaskCategory: (
    taskId: number,
    categoryId: number,
  ) => Promise<TaskEntity>;
  public abstract delete: (taskId: number) => Promise<TaskEntity>;
}
