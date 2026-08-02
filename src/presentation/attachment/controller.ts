import { Request, Response } from "express";
import { UploadAttachmentUseCase } from "../../application/use-cases/attachment/upload-attachment.use-case";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitMulterFileDto } from "../../application/dtos/attatchment.dto";

export class AttachmentController {
  constructor(
    private readonly uploadAttachmentUseCase: UploadAttachmentUseCase,
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
    return res.json("getAllByTask");
  };
  public delete = async (req: Request, res: Response) => {
    return res.json("delete");
  };
}
