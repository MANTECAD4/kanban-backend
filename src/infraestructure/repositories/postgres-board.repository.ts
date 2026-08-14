import { SubmitBoardDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { BoardEntity } from "../../domain/entities";
import { BoardRepository } from "../../domain/repositories";

export class PostgresBoardRepository implements BoardRepository {
  public getAllByUser = async (userId: number): Promise<BoardEntity[]> => {
    const rawBoards = await prisma.board.findMany({
      where: { user_id: userId },
    });
    return rawBoards.map((board) => BoardEntity.fromObject(board));
  };

  public getById = async (boardId: number): Promise<BoardEntity | null> => {
    const board = await prisma.board.findFirst({ where: { id: boardId } });
    return board === null ? null : BoardEntity.fromObject(board);
  };

  public checkRelation = async (
    userId: number,
    searchKey: string | number,
  ): Promise<BoardEntity | null> => {
    let board;
    if (typeof searchKey === "string") {
      board = await prisma.board.findFirst({
        where: { slug: searchKey, user_id: userId },
      });
    } else {
      board = await prisma.board.findUnique({
        where: { id: searchKey, user_id: userId },
      });
    }
    return board === null ? null : BoardEntity.fromObject(board);
  };

  public checkCollection = async (
    projectId: number,
    slug: string,
  ): Promise<null | BoardEntity> => {
    const board = await prisma.board.findFirst({
      where: { slug, project_id: projectId },
    });

    return board ? BoardEntity.fromObject(board) : null;
  };

  public create = async (
    userId: number,
    { iconColor, ...rest }: SubmitBoardDto,
  ): Promise<BoardEntity> => {
    const createdBoard = await prisma.board.create({
      data: {
        icon_color: iconColor,
        ...rest,
        user_id: userId,
      },
    });
    return BoardEntity.fromObject(createdBoard);
  };
  public update = async (
    boardId: number,
    { iconColor, ...rest }: SubmitBoardDto,
  ): Promise<BoardEntity> => {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { icon_color: iconColor, ...rest },
    });
    return BoardEntity.fromObject(updatedBoard);
  };

  public delete = async (boardId: number): Promise<BoardEntity> => {
    const deletedBoard = await prisma.board.delete({
      where: { id: boardId },
    });
    return BoardEntity.fromObject(deletedBoard);
  };
}
