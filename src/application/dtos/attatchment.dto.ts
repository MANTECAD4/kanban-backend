import z from "zod";
// multer file: {
//     fieldname: 'attachments',
//     originalname: 'uwu.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 06 06 06 06 07 06 07 08 08 07 0a 0b 0a 0b 0a 0f 0e 0c 0c 0e 0f 16 10 11 10 ... 78235 more bytes>,
//     size: 78285
//   }
export const MulterFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.int(),
});

export const SubmitAttachmentSchema = z.object({
  originalName: z.string(),
  storedPath: z.string(),
  extension: z.string(),
  mimeType: z.string(),
  size: z.int(),
  sourceUrl: z.string(),
});

export type SubmitMulterFileDto = z.infer<typeof MulterFileSchema>;
export type SubmitAttachmentDto = z.infer<typeof SubmitAttachmentSchema>;

// DISK STORAGE
// const FileSchema = z.object({
//   fieldname: z.string(),
//   originalname: z.string(),
//   encoding: z.string(),
//   mimetype: z.string(),
//   path: z.string(),
//   destination: z.string(),
//   filename: z.string(),
//   size: z.int(),
// });
