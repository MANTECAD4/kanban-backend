import {
  SubmitTaskDto,
  TasksMetaByPriorityDto,
  UpcomingTaskDto,
} from "../../application/dtos";
import { TaskEntity } from "../entities/task.entity";

export abstract class TaskRepository {
  public abstract checkRelation: (
    userId: number,
    searchKey: number | string,
  ) => Promise<TaskEntity | null>;
  public abstract getAllByCategory: (
    categoryId: number,
  ) => Promise<TaskEntity[]>;
  public abstract getAllByBoard: (boardId: number) => Promise<TaskEntity[]>;

  public abstract getCount: (categoryId: number) => Promise<number>;
  public abstract getById: (taskId: number) => Promise<TaskEntity | null>;

  public abstract getBySlug: (
    boardId: number,
    taskSlug: string,
  ) => Promise<TaskEntity | null>;

  public abstract create: (
    categoryId: number,
    data: SubmitTaskDto & { order: number },
  ) => Promise<TaskEntity>;
  public abstract update: (
    taskId: number,
    data: SubmitTaskDto,
  ) => Promise<TaskEntity>;
  public abstract updateTaskCategory: (
    taskId: number,
    categoryId: number,
  ) => Promise<TaskEntity>;
  public abstract updateOrder: (
    taskId: number,
    order: number,
  ) => Promise<TaskEntity>;
  public abstract delete: (taskId: number) => Promise<TaskEntity>;

  public abstract getUpcomingTasks: (
    userId: number,
  ) => Promise<UpcomingTaskDto[]>;

  public abstract getMetaByPriority: (
    userId: number,
  ) => Promise<TasksMetaByPriorityDto>;
}
