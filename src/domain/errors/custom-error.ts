import { Response } from "express";

export class CustomError extends Error {
  private constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
  }

  public static badRequest(message: string) {
    return new CustomError(400, message);
  }
  public static unauthorized(message: string) {
    return new CustomError(401, message);
  }
  public static forbidden(message: string) {
    return new CustomError(403, message);
  }
  public static notFound(message: string) {
    return new CustomError(404, message);
  }
  public static internalServer(message: string) {
    return new CustomError(500, message);
  }

  public static handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal server error. Check logs" });
  };
}
