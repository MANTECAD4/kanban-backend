import { Request, Response } from "express";
import { CreateBoardUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";

export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
  ) {}

  public create = (req: Request, res: Response) => {
    this.createBoardUseCase
      .execute(req.user!, req.body)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public getBoards = (req: Request, res: Response) => {
    this.getBoardsUseCase
      .execute(req.user!)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public updateBoard = (req: Request, res: Response) => {
    this.updateBoardUseCase
      .execute(req.params.id as unknown as number, req.body)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
