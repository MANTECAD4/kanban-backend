interface Props {
  id: number;
  taskId: number;
}

export class AttachmentEntity {
  public readonly id: number;
  public readonly taskId: number;
  constructor(props: Props) {
    const { id, taskId } = props;
    this.id = id;
    this.taskId = taskId;
  }

  public static fromObject = (
    object: Record<string, any>,
  ): AttachmentEntity => {
    const { id, task_id } = object;

    return new AttachmentEntity({
      id,
      taskId: task_id,
    });
  };
}
