interface Props {
  id: number;
  taskId: number;
  originalName: string;
  storedPath: string;
  extension: string;
  mimeType: string;
  size: number;
  sourceUrl: string;
  createdAt: Date;
}

export class AttachmentEntity {
  public readonly id: number;
  public readonly taskId: number;
  public readonly originalName: string;
  public readonly storedPath: string;
  public readonly extension: string;
  public readonly mimeType: string;
  public readonly size: number;
  public readonly sourceUrl: string;
  public readonly createdAt: Date;

  constructor(props: Props) {
    const {
      id,
      taskId,
      originalName,
      storedPath,
      extension,
      mimeType,
      size,
      sourceUrl,
      createdAt,
    } = props;
    this.id = id;
    this.taskId = taskId;
    this.originalName = originalName;
    this.storedPath = storedPath;
    this.extension = extension;
    this.mimeType = mimeType;
    this.size = size;
    this.sourceUrl = sourceUrl;
    this.createdAt = createdAt;
  }

  public static fromObject = (
    object: Record<string, any>,
  ): AttachmentEntity => {
    const {
      id,
      task_id,
      original_name,
      stored_path,
      extension,
      mime_type,
      size,
      source_link,
      created_at,
    } = object;

    return new AttachmentEntity({
      id,
      taskId: task_id,
      originalName: original_name,
      storedPath: stored_path,
      extension,
      mimeType: mime_type,
      size,
      sourceUrl: source_link,
      createdAt: created_at,
    });
  };
}
