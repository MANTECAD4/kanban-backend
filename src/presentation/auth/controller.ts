import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";
import { LoginUserUseCase } from "../../application/use-cases/login-user.use-case";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  public login = (req: Request, res: Response) => {
    this.loginUserUseCase
      .execute(req.body)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
  public register = (req: Request, res: Response) => {
    this.registerUserUseCase
      .execute(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
