import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import { BoardEntity } from "../entities/board.entity";

export abstract class BoardRepository {
  public abstract checkRelationship: (
    userId: number,
    boardId: number,
  ) => Promise<boolean>;

  public abstract getAll: (userId: number) => Promise<BoardEntity[]>;
  public abstract getByName: (name: string) => Promise<BoardEntity | null>;

  public abstract getById: (boardId: number) => Promise<BoardEntity | null>;

  public abstract getByUserAndBoardName: (
    userId: number,
    boardName: string,
  ) => Promise<BoardEntity | null>;

  public abstract create: (
    userId: number,
    createBoardDto: CreateBoardDto,
  ) => Promise<BoardEntity>;

  public abstract update: (
    boardId: number,
    data: Record<string, any>,
  ) => Promise<BoardEntity>;

  public abstract delete: (boardId: number) => Promise<BoardEntity>;
}
