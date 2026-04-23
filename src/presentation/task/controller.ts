import { Request, Response } from "express";

export class TaskController {
  constructor() {}

  public getTasks = (req: Request, res: Response) => {
    return res.json(`get tasks ->${JSON.stringify(req.params)}`);
  };
  public createTask = (req: Request, res: Response) => {};
}
