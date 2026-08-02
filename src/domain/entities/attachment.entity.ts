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
      source_url,
      sourceUrl,
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
      sourceUrl: source_url ?? sourceUrl,
      createdAt: created_at,
    });
  };
}

//! https://tnycxpiqvqledensbquj.supabase.co/storage/v1/object/sign/kanban-app/user-2/032fefe4-ed32-4e41-b039-21430a992784?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81Y2EzOTc5Ny1kM2JjLTQzYTEtYjFjZS0xZjUzMDM5MjU1NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrYW5iYW4tYXBwL3VzZXItMi8wMzJmZWZlNC1lZDMyLTRlNDEtYjAzOS0yMTQzMGE5OTI3ODQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1NjI2NzU5LCJleHAiOjE3ODYyMzE1NTl9.Eso-bWUmMB7c3qIZWJGsO4ZWMZ0N3w8eOJJn5r88LOo

//! https://tnycxpiqvqledensbquj.supabase.co/storage/v1/object/public/kanban-app/user-2/508b1c75-91fc-41a4-aec0-729c42f8b183
