import { SubmitBoardDto } from "../../application/dtos";
import { BoardEntity } from "../entities/board.entity";

export abstract class BoardRepository {
  public abstract getAllByUser: (userId: number) => Promise<BoardEntity[]>;

  public abstract getById: (boardId: number) => Promise<BoardEntity | null>;

  public abstract checkRelation: (
    userId: number,
    searchKey: string | number,
  ) => Promise<BoardEntity | null>;

  // public abstract checkCollection: (
  //   projectId: number,
  //   slug: string,
  // ) => Promise<null | BoardEntity>;

  public abstract create: (
    userId: number,
    createBoardDto: SubmitBoardDto,
  ) => Promise<BoardEntity>;

  public abstract update: (
    boardId: number,
    data: SubmitBoardDto,
  ) => Promise<BoardEntity>;

  public abstract delete: (boardId: number) => Promise<BoardEntity>;
}
