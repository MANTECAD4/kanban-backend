import { Request, Response } from "express";
import { CreateBoardUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";
import { DeleteBoardUseCase } from "../../application/use-cases/board/delete-board.use-case";
import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import { read } from "node:fs";

export class BoardsController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
  ) {}

  public create = (req: Request, res: Response) => {
    this.createBoardUseCase
      .execute(req.user!, req.validatedBody! as CreateBoardDto)
      .then((result) => res.status(201).json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public getAll = (req: Request, res: Response) => {
    this.getBoardsUseCase
      .execute(req.user!)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public update = (req: Request, res: Response) => {
    this.updateBoardUseCase
      .execute(
        req.user!,
        req.validatedParams!.boardId as number,
        req.validatedBody! as UpdateBoardDto,
      )
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };

  public delete = (req: Request, res: Response) => {
    this.deleteBoardUseCase
      .execute(req.user!, req.validatedParams!.boardId as number)
      .then((result) => res.json(result))
      .catch((error) => CustomError.handleError(error, res));
  };
}
