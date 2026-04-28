interface ClassProperties {
  id: number;
  description: string;
  isCompleted: boolean;
  taskId: number;
}
export class SubtaskEntity {
  public readonly id: number;
  public readonly description: string;
  public readonly isCompleted: boolean;
  public readonly taskId: number;

  constructor(properties: ClassProperties) {
    const { id, description, isCompleted, taskId } = properties;
    this.id = id;
    this.description = description;
    this.isCompleted = isCompleted;
    this.taskId = taskId;
  }

  static fromObject = (object: Record<string, any>): SubtaskEntity => {
    const { id, _id, description, isCompleted, is_completed, taskId, task_id } =
      object;

    return new SubtaskEntity({
      id: id ?? _id,
      description,
      isCompleted: isCompleted ?? is_completed,
      taskId: taskId ?? task_id,
    });
  };
}
