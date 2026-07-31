import { Request, Response } from "express";

interface Dependencies {}

export class AttachmentController {
  constructor(dependencies: Dependencies) {
    const {} = dependencies;
  }

  public create = async (req: Request, res: Response) => {
    // @ts-expect-error
    const fileDetails = req.files!.map((f) => ({
      name: f.originalname,
      size: f.size,
    }));
    console.log(fileDetails);
    return res.json("create");
  };
  public getAllByTask = async (req: Request, res: Response) => {
    return res.json("getAllByTask");
  };
  public delete = async (req: Request, res: Response) => {
    return res.json("delete");
  };
}
