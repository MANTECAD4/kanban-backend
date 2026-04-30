import { Request, Response } from "express";
import { CreateBoardUseCase } from "../../application/use-cases";
import { CustomError } from "../../domain/errors/custom-error";
import { GetBoardsUseCase } from "../../application/use-cases/board/get-boards.use-case";
import { UpdateBoardUseCase } from "../../application/use-cases/board/update-board.use-case";
import { DeleteBoardUseCase } from "../../application/use-cases/board/delete-board.use-case";
import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";

export class BoardsController {
  constructor(
    private readonly createBoardUseCase: CreateBoardUseCase,
    private readonly getBoardsUseCase: GetBoardsUseCase,
    private readonly updateBoardUseCase: UpdateBoardUseCase,
    private readonly deleteBoardUseCase: DeleteBoardUseCase,
  ) {}

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.createBoardUseCase.execute(
        req.user!,
        req.validatedBody! as CreateBoardDto,
      );

      return res
        .status(201)
        .json({ message: "Board created succesfully", ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
    // this.createBoardUseCase
    //   .execute(req.user!, req.validatedBody! as CreateBoardDto)
    //   .then((result) =>
    //     res
    //       .status(201)
    //       .json({ message: "Board created succesfully", ...result }),
    //   )
    //   .catch((error) => CustomError.handleError(error, req, res));
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this.getBoardsUseCase.execute(req.user!);
      return res.json({ message: `Boards loaded succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
    // this.getBoardsUseCase
    //   .execute(req.user!)
    //   .then((result) =>
    //     res.json({ message: `Boards loaded succesfully`, ...result }),
    //   )
    //   .catch((error) => CustomError.handleError(error, req, res));
  };

  public update = async (req: Request, res: Response) => {
    try {
      const result = await this.updateBoardUseCase.execute(
        req.user!,
        req.validatedParams!.boardId as number,
        req.validatedBody! as UpdateBoardDto,
      );
      return res.json({ message: `Board updated succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
    // this.updateBoardUseCase
    //   .execute(
    //     req.user!,
    //     req.validatedParams!.boardId as number,
    //     req.validatedBody! as UpdateBoardDto,
    //   )
    //   .then((result) =>
    //     res.json({ message: `Board updated succesfully`, ...result }),
    //   )
    //   .catch((error) => CustomError.handleError(error, req, res));
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const result = await this.deleteBoardUseCase.execute(
        req.user!,
        req.validatedParams!.boardId as number,
      );
      return res.json({ message: `Board with deleted succesfully`, ...result });
    } catch (error) {
      return CustomError.handleError(error, req, res);
    }
    // this.deleteBoardUseCase
    //   .execute(req.user!, req.validatedParams!.boardId as number)
    //   .then((result) =>
    //     res.json({ message: `Board with deleted succesfully`, ...result }),
    //   )
    //   .catch((error) => CustomError.handleError(error, req, res));
  };
}
