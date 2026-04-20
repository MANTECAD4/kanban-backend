import { Request, Response } from "express";
import { CreateBoardUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";

export class BoardController {
  constructor(private readonly createBoardUseCase: CreateBoardUseCase) {}

  public create = (req: Request, res: Response) => {
    this.createBoardUseCase
      .execute(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
