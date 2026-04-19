import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";

export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  public login = (req: Request, res: Response) => {
    return res.json("login");
  };
  public register = (req: Request, res: Response) => {
    this.registerUserUseCase
      .execute(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
