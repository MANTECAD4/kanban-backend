import { NextFunction, Request, Response } from "express";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/shared-schemas";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";
import multer from "multer";
import path from "path";
import { AttachmentRepository } from "../../domain/repositories/attachment.repository";

interface Dependencies {
  attachmentRepository: AttachmentRepository;
}

export class AttachmentMiddlewares {
  private upload: any;
  private readonly attachmentRepository: AttachmentRepository;
  constructor(dependencies: Dependencies) {
    const { attachmentRepository } = dependencies;
    this.attachmentRepository = attachmentRepository;
    this.initUpload();
  }

  public attachmentIdValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("attachmentId"),
    "Invalid attachment id provided",
    RequestValidationTarget.PARAMS,
  );

  public validateRelation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub.id;
      const attachmentId = req.validatedParams!.attachmentId;

      const relatedAttachment = await this.attachmentRepository.checkRelation(
        userId,
        attachmentId,
      );

      if (!relatedAttachment) {
        const error = CustomError.forbidden({
          title: "Forbidden",
          message: "User doesn't have access to this attachment",
          code: ErrorCodes.FORBIDDEN,
          details: null,
        });
        return CustomError.handleError(error, req, res);
      }
      next();
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public validateAttachments = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      this.upload(req, res, (err: any) => {
        if (err) {
          const error = CustomError.badRequest({
            title: "File upload failed",
            message: err.message,
            code: ErrorCodes.INVALID_DATA,
            details: null,
          });
          return res.status(400).json({ error });
        }
        if (!req.files || req.files.length === 0) {
          const error = CustomError.badRequest({
            title: "Missing files",
            message: "No files were recieved",
            code: ErrorCodes.INVALID_DATA,
            details: null,
          });
          return res.status(400).json({ error });
        }
        next();
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  private initUpload = () => {
    // const uploadsDir = path.join(__dirname, "../../../uploads");
    // if (!fs.existsSync(uploadsDir)) {
    //   fs.mkdirSync(uploadsDir);
    // }

    // const storage = multer.diskStorage({
    //   destination: function (_req, _file, cb) {
    //     cb(null, "uploads/");
    //   },
    //   filename: (_req, file, cb) => {
    //     cb(null, Date.now() + path.extname(file.originalname));
    //   },
    // });
    const storage = multer.memoryStorage();
    this.upload = multer({
      storage,
      limits: { files: 3, fieldSize: 1024 * 1024 * 5 },
      fileFilter: (_req, file, cb) => {
        console.log({
          ext: path.extname(file.originalname).toLowerCase(),
          mime: file.mimetype,
        });
        const allowedExtensions =
          /jpeg|jpg|png|webp|pdf|txt|doc|docx|xls|xlsx|csv|ppt|pptx|zip|rar|7z/;
        const ext = allowedExtensions.test(
          path.extname(file.originalname).toLowerCase(),
        );
        // const mime = allowedExtensions.test(file.mimetype);
        if (ext) return cb(null, true);
        cb(new Error("Invalid file type."));
      },
    }).array("attachments");
  };
}
