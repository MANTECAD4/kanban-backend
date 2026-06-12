import { Request, Response } from "express";
import { GetUserInfoUseCase } from "../../application/use-cases/user/get-me-info.use-case";
import { CustomError } from "../../domain/errors/custom-error";

interface Dependencies {
  getUserInfoUseCase: GetUserInfoUseCase;
}

export class UserController {
  private readonly getUserInfoUseCase: GetUserInfoUseCase;
  constructor(dependencies: Dependencies) {
    const { getUserInfoUseCase } = dependencies;
    this.getUserInfoUseCase = getUserInfoUseCase;
  }
  public getMeInfo = async (req: Request, res: Response) => {
    try {
      console.log({ user: req.user });
      const {
        sub: { id: userId },
      } = req.user!;
      const result = await this.getUserInfoUseCase.execute(userId);
      return res.json({
        ok: true,
        message: "Session loaded successfully",
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
