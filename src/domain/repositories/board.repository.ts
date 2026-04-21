import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import { BoardEntity } from "../entities/board.entity";

export abstract class BoardRepository {
  public abstract findAll: (
    userId: number, // DTO
  ) => Promise<BoardEntity[]>;
  public abstract create: (
    createBoardDto: CreateBoardDto, // DTO
  ) => Promise<BoardEntity>;
  public abstract update: (
    boardId: number,
    data: Record<string, any>, // DTO
  ) => Promise<BoardEntity>;
  public abstract delete: (
    boardId: number, // DTO
  ) => Promise<BoardEntity>;
  public abstract findByName: (name: string) => Promise<BoardEntity | null>;
}
