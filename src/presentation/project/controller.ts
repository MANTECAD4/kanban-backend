import { Request, Response } from "express";

export class ProjectController {
  constructor() {}

  public getProjectsByUser = (req: Request, res: Response) => {
    return res.json("getProjetsByUser");
  };
}
