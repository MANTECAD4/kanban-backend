import { TaskEntity } from "./task.entity";

interface ClassProperties {
  id: number;
  description: string;
  isCompleted: boolean;
  taskId: number;
  task: TaskEntity | null;
}
export class SubtaskEntity {
  public readonly id: number;
  public readonly description: string;
  public readonly isCompleted: boolean;
  public readonly taskId: number;
  public readonly task: TaskEntity | null;

  constructor(properties: ClassProperties) {
    const { id, description, isCompleted, taskId, task = null } = properties;
    this.id = id;
    this.description = description;
    this.isCompleted = isCompleted;
    this.taskId = taskId;
    this.task = task;
  }

  static fromObject = (object: Record<string, any>): SubtaskEntity => {
    const { id, _id, description, is_completed, task_id, task } = object;

    return new SubtaskEntity({
      id: id ?? _id,
      description,
      isCompleted: is_completed,
      taskId: task_id,
      task,
    });
  };
}
