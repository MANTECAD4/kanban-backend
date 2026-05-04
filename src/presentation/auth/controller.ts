import { Request, Response } from "express";
import {
  RegisterUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
} from "../../application/use-cases/auth";
import { CustomError } from "../../domain/errors/custom-error";
import { LoginUserDto, RegisterUserDto } from "../../application/dtos";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly refreshTokenDuration: number,
  ) {}

  public login = async (req: Request, res: Response) => {
    try {
      const { refreshToken, ...rest } = await this.loginUseCase.execute(
        req.validatedBody! as LoginUserDto,
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // True en produccion,
        sameSite: "none", // Lax tambien
        maxAge: this.refreshTokenDuration * 60 * 1000,
        path: "/api/auth",
      });
      return res.json({ ok: true, message: "Login succesful!", ...rest });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
  public register = async (req: Request, res: Response) => {
    try {
      const { refreshToken, ...rest } = await this.registerUserUseCase.execute(
        req.validatedBody! as RegisterUserDto,
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: this.refreshTokenDuration * 60 * 1000,
        path: "/api/auth",
      });

      return res
        .status(201)
        .json({ ok: true, message: "User registered succesfully", ...rest });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public refresh = async (req: Request, res: Response) => {
    try {
      const { accessToken, newRefreshToken } =
        await this.refreshTokenUseCase.execute(req.cookies.refreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: this.refreshTokenDuration * 60 * 1000,
        path: "/api/auth",
      });
      return res.json({ ok: true, accessToken });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public logout = async (req: Request, res: Response) => {
    try {
      await this.logoutUseCase.execute(req.cookies.refreshToken);
      res.clearCookie("refreshToken", {
        path: "/api/auth",
      });
      return res.json({ ok: true, message: "Logout succesfull" });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
