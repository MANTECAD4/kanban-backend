import { AttachmentEntity } from "../entities/attachment.entity";

export abstract class AttachmentRepository {
  public abstract create: (taskId: number, data) => Promise<AttachmentEntity>;
  public abstract delete: (attatchmentId: number) => Promise<AttachmentEntity>;
  public abstract getAllByTask: (taskId: number) => Promise<AttachmentEntity[]>;
}
