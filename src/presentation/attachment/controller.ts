import { Request, Response } from "express";
import { supabase } from "../../data/init-supabase-storage";

interface Dependencies {}

export class AttachmentController {
  constructor(dependencies: Dependencies) {
    const {} = dependencies;
  }

  public create = async (req: Request, res: Response) => {
    // @ts-expect-error

    const file = req.files[0];
    console.log({ file });
    if (!file) return res.status(500).json("no files found");
    // const fileDetails = req.files!.map((f) => ({
    //   [f.originalname]: Object.keys(f),
    //   types: Object.entries(f).map((field) => typeof field),
    //   f,
    // }));

    // const { data, error } = await supabase.storage
    //   .from("kanban-app")
    //   .upload(`${file.originalname}`, file.buffer, {
    //     contentType: file.mimetype,
    //   });
    // if (error) {
    //   return res.status(500).json({ error });
    // } else {
    // }
    return res.json({ message: "uploaded successfully" });
  };
  public getAllByTask = async (req: Request, res: Response) => {
    return res.json("getAllByTask");
  };
  public delete = async (req: Request, res: Response) => {
    return res.json("delete");
  };
}
