import { TaskEntity } from "../entities/task.entity";

export abstract class TaskRepository {
  public abstract getAll: () => Promise<TaskEntity[]>;
  public abstract getById: () => Promise<TaskEntity>;
  public abstract create: () => Promise<TaskEntity>;
  public abstract update: () => Promise<TaskEntity>;
  public abstract delete: () => Promise<TaskEntity>;
}
