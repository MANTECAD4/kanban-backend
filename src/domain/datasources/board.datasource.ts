import { BoardEntity } from "../entities/board.entity";
import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";

export abstract class BoardDatasource {
  public abstract findAll: (userId: number) => Promise<BoardEntity[]>;
  public abstract create: (
    createBoardDto: CreateBoardDto, // DTO
  ) => Promise<BoardEntity>;
  public abstract update: (
    boardId: number,
    updateBoardDto: UpdateBoardDto, // DTO
  ) => Promise<BoardEntity>;
  public abstract delete: (boardId: number) => Promise<BoardEntity>;
}
