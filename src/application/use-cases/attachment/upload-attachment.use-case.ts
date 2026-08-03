import { AttachmentRepository } from "../../../domain/repositories/attachment.repository";
import { CloudAttachmentRepository } from "../../../domain/repositories/cloud-attachment.repository";
import { SubmitMulterFileDto } from "../../dtos/attatchment.dto";

interface Dependencies {
  attachmentRepository: AttachmentRepository;
  cloudAttachmentRepository: CloudAttachmentRepository;
}

export class UploadAttachmentUseCase {
  private readonly attachmentRepository: AttachmentRepository;
  private readonly cloudAttachmentRepository: CloudAttachmentRepository;

  constructor(dependencies: Dependencies) {
    const { attachmentRepository, cloudAttachmentRepository } = dependencies;
    this.attachmentRepository = attachmentRepository;
    this.cloudAttachmentRepository = cloudAttachmentRepository;
  }

  public execute = async (
    userId: number,
    taskId: number,
    files: SubmitMulterFileDto[],
  ) => {
    const attachmentsPromise = files.map(async (file) => {
      const generatedName = crypto.randomUUID();
      const storePath = `user-${userId}/${generatedName}`;
      const cloudAttachment = await this.cloudAttachmentRepository.upload(
        storePath,
        file.buffer,
        file.mimetype,
      );

      const extension = file.originalname.split(".").at(-1);

      const attachmentEntity = await this.attachmentRepository.create(taskId, {
        originalName: file.originalname,
        storedPath: cloudAttachment.path,
        extension: extension!,
        mimeType: file.mimetype,
        size: file.size,
        sourceUrl: cloudAttachment.sourceUrl,
      });

      return attachmentEntity;
    });

    const attachments = await Promise.all(attachmentsPromise);

    return { attachments, meta: { total: attachments.length } };
  };
}
