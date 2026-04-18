import { Request, Response } from "express";

export class AuthController {
  constructor() {}

  public async login(req: Request, res: Response) {
    return res.json("login");
  }
  public async register(req: Request, res: Response) {
    return res.json("register");
  }
}
