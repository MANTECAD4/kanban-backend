import { Request, Response } from "express";

export class ProjectController {
  constructor() {}

  public getAllByUser = (req: Request, res: Response) => {
    return res.json("getProjetsByUser");
  };
  public create = (req: Request, res: Response) => {
    return res.json("createProject");
  };
  public update = (req: Request, res: Response) => {
    return res.json("updateProject");
  };
  public delete = (req: Request, res: Response) => {
    return res.json("deleteProject");
  };
}
