import { Request, Response } from "express";
import { UploadAttachmentUseCase } from "../../application/use-cases/attachment/upload-attachment.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitMulterFileDto } from "../../application/dtos/attatchment.dto";
import { GetAttachmentsUseCase } from "../../application/use-cases/attachment/get-attachments.use-case";
import { DeleteAttachmentUseCase } from "../../application/use-cases/attachment/delete-attachment.use-case";

export class AttachmentController {
  constructor(
    private readonly uploadAttachmentUseCase: UploadAttachmentUseCase,
    private readonly getAttachmentsUseCase: GetAttachmentsUseCase,
    private readonly deleteAttachmentUseCase: DeleteAttachmentUseCase,
  ) {}

  public upload = async (req: Request, res: Response) => {
    try {
      const files = req.files as SubmitMulterFileDto[];
      const taskId = req.validatedParams!.taskId;
      const userId = req.user!.sub.id;

      const result = await this.uploadAttachmentUseCase.execute(
        userId,
        taskId,
        files,
      );

      return res.status(201).json({
        ok: true,
        message: "Files uploaded successfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public getAllByTask = async (req: Request, res: Response) => {
    try {
      const taskId = req.validatedParams!.taskId;

      const result = await this.getAttachmentsUseCase.execute(taskId);
      return res.json({
        ok: true,
        message: "Attachments loaded successfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public delete = async (req: Request, res: Response) => {
    try {
      const attachmentId = req.validatedParams!.attachmentId;
      const result = await this.deleteAttachmentUseCase.execute(attachmentId);
      return res.json({
        ok: true,
        message: `Attachment deleted successfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
