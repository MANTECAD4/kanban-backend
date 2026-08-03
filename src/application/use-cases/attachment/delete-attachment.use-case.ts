import { AttachmentRepository } from "../../../domain/repositories/attachment.repository";
import { CloudAttachmentRepository } from "../../../domain/repositories/cloud-attachment.repository";

interface Dependencies {
  attachmentRepository: AttachmentRepository;
  cloudAttachmentRepository: CloudAttachmentRepository;
}

export class DeleteAttachmentUseCase {
  private readonly attachmentRepository: AttachmentRepository;
  private readonly cloudAttachmentRepository: CloudAttachmentRepository;
  constructor(dependencies: Dependencies) {
    const { attachmentRepository, cloudAttachmentRepository } = dependencies;
    this.attachmentRepository = attachmentRepository;
    this.cloudAttachmentRepository = cloudAttachmentRepository;
  }

  public execute = async (attachmentId: number) => {
    const deletedAttachment =
      await this.attachmentRepository.delete(attachmentId);

    await this.cloudAttachmentRepository.deleteAttachment(
      deletedAttachment.storedPath,
    );

    return { attachment: deletedAttachment };
  };
}
