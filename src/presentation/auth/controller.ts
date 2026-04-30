import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases";
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
      console.log(req.body);
      const result = await this.loginUserUseCase.execute(
        req.validatedBody! as LoginUserDto,
      );
      return res.json({ message: "Login succesful!", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
    // this.loginUserUseCase
    //   .execute(req.validatedBody! as LoginUserDto)
    //   .then((result) => res.json({ message: "Login succesful!", ...result }))
    //   .catch((error) => CustomError.handleError(error, req, res));
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
    // this.registerUserUseCase
    //   .execute(req.validatedBody! as RegisterUserDto)
    //   .then((result) =>
    //     res
    //       .status(201)
    //       .json({ message: "User registered succesfully", ...result }),
    //   )
    //   .catch((error) => CustomError.handleError(error, req, res));
  };
}
