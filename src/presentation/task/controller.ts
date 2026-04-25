import { Request, Response } from "express";

export class KanbanTaskController {
  constructor() {}
  public getAll = (req: Request, res: Response) => {
    return res.json(`getAll`);
  };
  public create = (req: Request, res: Response) => {
    return res.json(`create`);
  };
  public update = (req: Request, res: Response) => {
    return res.json(`update -> ${req.params.taskId}`);
  };
  public delete = (req: Request, res: Response) => {
    return res.json(`delete -> ${req.params.taskId}`);
  };
}
