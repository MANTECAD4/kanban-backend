import { CloudAttachmentEntity } from "../entities/cloud-attachment.entity";

export abstract class CloudAttachmentRepository {
  public abstract upload: (
    storePath: string,
    file: Buffer,
    mimeType: string,
  ) => Promise<CloudAttachmentEntity>;

  public abstract deleteAttachment: (attachmentPath: string) => Promise<void>;
}
