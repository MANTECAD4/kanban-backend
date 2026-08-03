import { SubmitAttachmentDto } from "../../application/dtos/attatchment.dto";
import { prisma } from "../../data/init-postgres";
import { AttachmentEntity } from "../../domain/entities/attachment.entity";
import { AttachmentRepository } from "../../domain/repositories/attachment.repository";

export class PostgresAttachmentRepository implements AttachmentRepository {
  public checkRelation = async (
    userId: number,
    attachmentId: number,
  ): Promise<AttachmentEntity | null> => {
    const attachment = await prisma.attachment.findUnique({
      where: {
        id: attachmentId,
        task: { category: { board: { project: { user: { id: userId } } } } },
      },
    });

    return attachment ? AttachmentEntity.fromObject(attachment) : null;
  };

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
    const deletedAttachment = await prisma.attachment.delete({
      where: { id: attatchmentId },
    });
    return AttachmentEntity.fromObject(deletedAttachment);
  };

  public getById = async (
    attachmentId: number,
  ): Promise<AttachmentEntity | null> => {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });
    return attachment ? AttachmentEntity.fromObject(attachment) : null;
  };

  public getAllByTask = async (taskId: number): Promise<AttachmentEntity[]> => {
    const attachments = await prisma.attachment.findMany({
      where: { task_id: taskId },
    });
    return attachments.map((attachment) =>
      AttachmentEntity.fromObject(attachment),
    );
  };
}
