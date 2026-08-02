import { SubmitAttachmentDto } from "../../application/dtos/attatchment.dto";
import { prisma } from "../../data/init-postgres";
import { AttachmentEntity } from "../../domain/entities/attachment.entity";
import { AttachmentRepository } from "../../domain/repositories/attachment.repository";

export class PostgresAttachmentRepository implements AttachmentRepository {
  public create = async (
    taskId: number,
    {
      extension,
      mimeType,
      originalName,
      size,
      sourceUrl,
      storedPath,
    }: SubmitAttachmentDto,
  ): Promise<AttachmentEntity> => {
    const attachment = await prisma.attachment.create({
      data: {
        original_name: originalName,
        extension,
        size,
        mime_type: mimeType,
        source_url: sourceUrl,
        stored_path: storedPath,
        task_id: taskId,
      },
    });

    return AttachmentEntity.fromObject(attachment);
  };
  public delete = async (attatchmentId: number): Promise<AttachmentEntity> => {
    throw "not implemented";
  };
  public getAllByTask = async (taskId: number): Promise<AttachmentEntity[]> => {
    throw "not implemented";
  };
}
