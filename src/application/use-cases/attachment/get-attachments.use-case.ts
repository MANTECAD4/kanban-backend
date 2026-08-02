import { AttachmentRepository } from "../../../domain/repositories/attachment.repository";

interface Dependencies {
  attachmentRepository: AttachmentRepository;
}

export class GetAttachmentsUseCase {
  private readonly attachmentRepository: AttachmentRepository;
  constructor(params: Dependencies) {
    const { attachmentRepository } = params;
    this.attachmentRepository = attachmentRepository;
  }

  public execute = async (taskId: number) => {
    const attachments = await this.attachmentRepository.getAllByTask(taskId);
    return { attachments, meta: { total: attachments.length } };
  };
}
