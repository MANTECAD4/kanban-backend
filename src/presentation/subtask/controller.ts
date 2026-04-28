import { Request, Response } from "express";

export class KanbanSubtaskController {
  constructor() {}

  public getAllByTask = (req: Request, res: Response) => {
    return res.json("getAllByTask");
  };
  public create = (req: Request, res: Response) => {
    return res.json("create");
  };
  public update = (req: Request, res: Response) => {
    return res.json("update");
  };
  public delete = (req: Request, res: Response) => {
    return res.json("delete");
  };
}
