import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases/auth";
import { CustomError } from "../../domain/errors/custom-error";
import { LoginUserUseCase } from "../../application/use-cases/auth/login-user.use-case";
import { LoginUserDto, RegisterUserDto } from "../../application/dtos";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  public login = async (req: Request, res: Response) => {
    try {
      const result = await this.loginUserUseCase.execute(
        req.validatedBody! as LoginUserDto,
      );
      return res.json({ message: "Login succesful!", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public register = async (req: Request, res: Response) => {
    try {
      const result = await this.registerUserUseCase.execute(
        req.validatedBody! as RegisterUserDto,
      );
      return res
        .status(201)
        .json({ message: "User registered succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
