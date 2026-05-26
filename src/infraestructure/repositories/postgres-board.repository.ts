import { CreateBoardDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { BoardEntity } from "../../domain/entities";
import { BoardRepository } from "../../domain/repositories";

export class PostgresBoardRepository implements BoardRepository {
  public checkRelation = async (
    userId: number,
    boardId: number,
  ): Promise<BoardEntity | null> => {
    const board = await prisma.board.findFirst({
      where: { id: boardId, user: { id: userId } },
    });
    return board ? BoardEntity.fromObject(board) : null;
  };

  public getAll = async (userId: number): Promise<BoardEntity[]> => {
    const rawBoards = await prisma.board.findMany({
      where: { user_id: userId },
    });
    return rawBoards.map((board) => BoardEntity.fromObject(board));
  };

  public getById = async (boardId: number): Promise<BoardEntity | null> => {
    const board = await prisma.board.findFirst({ where: { id: boardId } });
    return board === null ? null : BoardEntity.fromObject(board);
  };

  public getByUserAndBoardName = async (
    userId: number,
    boardName: string,
  ): Promise<BoardEntity | null> => {
    const board = await prisma.board.findFirst({
      where: { name: boardName, user_id: userId },
    });
    return board === null ? null : BoardEntity.fromObject(board);
  };

  public create = async (
    userId: number,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> => {
    const createdBoard = await prisma.board.create({
      data: {
        ...createBoardDto,
        user_id: userId,
      },
    });
    return BoardEntity.fromObject(createdBoard);
  };
  public update = async (
    boardId: number,
    data: Record<string, any>,
  ): Promise<BoardEntity> => {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data,
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
