import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { SubmitBoardDto } from "../../application/dtos";
import {
  GetBoardsUseCase,
  CreateBoardUseCase,
  UpdateBoardUseCase,
  DeleteBoardUseCase,
} from "../../application/use-cases/board";
import { GetBoardBySlugUseCase } from "../../application/use-cases/board/get-board-by-slug.use-case";

export class BoardController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
    private readonly getBoardBySlugUseCase: GetBoardBySlugUseCase,
  ) {}

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createBoardUseCase.execute(
        req.user!.sub.id,
        req.validatedBody! as SubmitBoardDto,
      );

      return res
        .status(201)
        .json({ ok: true, message: "Board created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      console.log(req.cookies);
      const result = await this.getBoardsUseCase.execute(
        req.validatedParams!.projectId,
      );
      return res.json({
        ok: true,
        message: `Boards loaded succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public getBySlug = async (req: Request, res: Response) => {
    try {
      const result = await this.getBoardBySlugUseCase.execute(
        req.user!.sub.id,
        req.validatedParams!.boardSlug,
      );

      return res.json({
        ok: true,
        message: `Board ${result.board.name} loaded succesfully`,
        ...result,
      });
    } catch (error) {
      CustomError.handleError(error, req, res);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateBoardUseCase.execute(
        req.validatedParams!.boardId,
        req.validatedBody! as SubmitBoardDto,
      );
      return res.json({
        ok: true,
        message: `Board updated succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteBoardUseCase.execute(
        req.validatedParams!.boardId as number,
      );
      return res.json({
        ok: true,
        message: `Board with deleted succesfully`,
        ...result,
      });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
  };
}
