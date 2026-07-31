import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  dataValidationMiddlewareFactory,
  RequestValidationTarget,
} from "../shared/factories/data-validation-middleware";
import { ParamsWithIdSchema } from "../shared/schemas/shared-schemas";
import { CustomError, ErrorCodes } from "../../domain/errors/custom-error";
import multer from "multer";
import path from "path";
import fs from "fs";

interface Dependencies {}

export class AttachmentMiddlewares {
  private upload: any;
  constructor(dependencies: Dependencies) {
    const {} = dependencies;
    this.initUpload();
  }

  public attachmentIdValidation = dataValidationMiddlewareFactory(
    ParamsWithIdSchema("attachmentId"),
    "Invalid attachment id provided",
    RequestValidationTarget.PARAMS,
  );

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
    const uploadsDir = path.join(__dirname, "../../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const storage = multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, "uploads/");
      },
      filename: (_req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

    this.upload = multer({
      storage,
      limits: { files: 3, fieldSize: 1024 * 1024 * 25 },
      fileFilter: (_req, file, cb) => {
        const allowed =
          /jpeg|jpg|png|webp|pdf|txt|doc|docx|xls|xlsx|csv|ppt|pptx|zip|rar|7z/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error("Invalid file type."));
      },
    }).array("attachments");
  };
}
