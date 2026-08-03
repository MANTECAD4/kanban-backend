import { SubmitAttachmentDto } from "../../application/dtos/attatchment.dto";
import { AttachmentEntity } from "../entities/attachment.entity";

export abstract class AttachmentRepository {
  public abstract checkRelation: (
    userId: number,
    attachmentId: number,
  ) => Promise<AttachmentEntity | null>;
  public abstract create: (
    taskId: number,
    data: SubmitAttachmentDto,
  ) => Promise<AttachmentEntity>;
  public abstract delete: (attatchmentId: number) => Promise<AttachmentEntity>;
  public abstract getById: (
    attachmentId: number,
  ) => Promise<AttachmentEntity | null>;
  public abstract getAllByTask: (taskId: number) => Promise<AttachmentEntity[]>;
}
