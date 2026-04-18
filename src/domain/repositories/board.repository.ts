import { BoardEntity } from "../entities/board.entity";

export abstract class BoardRepository {
  public abstract findAll: () // DTO
  => Promise<BoardEntity[]>;
  public abstract create: () // DTO
  => Promise<BoardEntity[]>;
  public abstract update: () // DTO
  => Promise<BoardEntity[]>;
  public abstract delete: () // DTO
  => Promise<BoardEntity[]>;
}
