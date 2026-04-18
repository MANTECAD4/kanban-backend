import { TaskEntity } from "../entities/task.entity";

export abstract class TaskDatasource {
  // !Add DTOS
  public abstract findAll: () => Promise<TaskEntity[]>;
  public abstract findById: () => Promise<TaskEntity>;
  public abstract create: () => Promise<TaskEntity>;
  public abstract update: () => Promise<TaskEntity>;
  public abstract delete: () => Promise<TaskEntity>;
}
