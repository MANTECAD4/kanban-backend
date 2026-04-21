import { Request, Response } from "express";
import { CreateBoardUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";

export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
  ) {}

  public create = (req: Request, res: Response) => {
    this.createBoardUseCase
      .execute(req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public getBoards = (req: Request, res: Response) => {
    this.getBoardsUseCase
      .execute(req.body)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
