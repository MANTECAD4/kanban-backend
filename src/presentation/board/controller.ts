import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import {
  GetBoardsUseCase,
  CreateBoardUseCase,
  UpdateBoardUseCase,
  DeleteBoardUseCase,
} from "../../application/use-cases/board";

export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
  ) {}

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createBoardUseCase.execute(
        req.user!.sub.id,
        req.validatedBody! as CreateBoardDto,
      );

      return res
        .status(201)
        .json({ message: "Board created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      console.log(req.cookies);
      const result = await this.getBoardsUseCase.execute(req.user!.sub.id);
      return res.json({ message: `Boards loaded succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateBoardUseCase.execute({
        userId: req.user!.sub.id,
        boardId: req.validatedParams!.boardId as number,
        data: req.validatedBody! as UpdateBoardDto,
      });
      return res.json({ message: `Board updated succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteBoardUseCase.execute(
        req.user!.sub.id,
        req.validatedParams!.boardId as number,
      );
      return res.json({ message: `Board with deleted succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
