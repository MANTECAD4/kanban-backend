import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { BoardEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";
import { BoardRepository } from "../../domain/repositories";

export class PostgresBoardRepository implements BoardRepository {
  public getAll = async (userId: number): Promise<BoardEntity[]> => {
    try {
      const rawBoards = await prisma.board.findMany({
        where: { user_id: userId },
      });
      return rawBoards.map((board) => BoardEntity.fromObject(board));
    } catch (error) {
      console.log({ ERROR_READING_BOARDS: error });
      throw CustomError.internalServer(
        "Error while loading boards from DB - at PostgresBoardDatasource.ts",
      );
    }
  };

  public getByName = async (name: string): Promise<BoardEntity | null> => {
    try {
      const board = await prisma.board.findFirst({ where: { name } });
      return board === null ? null : BoardEntity.fromObject(board);
    } catch (error) {
      console.log({ ERROR_READING_BOARD_BY_NAME: error });
      throw CustomError.internalServer(
        "Error while loading board from DB - at PostgresBoardDatasource.ts -> findByName",
      );
    }
  };
  public getById = async (boardId: number): Promise<BoardEntity | null> => {
    try {
      const board = await prisma.board.findFirst({ where: { id: boardId } });
      return board === null ? null : BoardEntity.fromObject(board);
    } catch (error) {
      console.log({ ERROR_READING_BOARD_BY_ID: error });
      throw CustomError.internalServer(
        "Error while loading board from DB - at PostgresBoardDatasource.ts -> findById",
      );
    }
  };
  public getByUserAndBoardName = async (
    userId: number,
    boardName: string,
  ): Promise<BoardEntity | null> => {
    try {
      const board = await prisma.board.findFirst({
        where: { name: boardName, user_id: userId },
      });
      return board === null ? null : BoardEntity.fromObject(board);
    } catch (error) {
      console.log({ ERROR_READING_BOARD_BY_USER_BOARD: error });
      throw CustomError.internalServer(
        "Error while loading board from DB - at PostgresBoardDatasource.ts -> findByUserAndBoard",
      );
    }
  };

  public checkRelationship = async (
    userId: number,
    boardId: number,
  ): Promise<boolean> => {
    try {
      const board = await prisma.board.findFirst({
        where: { id: boardId, user: { id: userId } },
      });
      return board ? true : false;
    } catch (error) {
      console.log({ ERROR_CHECKING_RELATIOSHIPN_USER_BOARD: error });
      throw CustomError.internalServer(
        `Error while checking relation between board no. ${boardId} and user ${userId}- at PostgresBoardDatasource.ts -> checkRelationship`,
      );
    }
  };

  public create = async (
    userId: number,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> => {
    try {
      const createdBoard = await prisma.board.create({
        data: {
          ...createBoardDto,
          user_id: userId,
        },
      });
      return BoardEntity.fromObject(createdBoard);
    } catch (error) {
      console.log({ ERROR_CREATING_BOARD: error });
      throw CustomError.internalServer(
        "Error while loading boards from DB - at PostgresBoardDatasource.ts",
      );
    }
  };
  public update = async (
    boardId: number,
    data: Record<string, any>,
  ): Promise<BoardEntity> => {
    try {
      const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data,
      });
      return BoardEntity.fromObject(updatedBoard);
    } catch (error) {
      console.log({ ERROR_UPDATE_BOARD: error });
      throw CustomError.internalServer(
        "Error while updating board -  at PostgresBoardDatasource.ts",
      );
    }
  };

  public delete = async (boardId: number): Promise<BoardEntity> => {
    try {
      const deletedBoard = await prisma.board.delete({
        where: { id: boardId },
      });
      return BoardEntity.fromObject(deletedBoard);
    } catch (error) {
      console.log({ ERROR_DELETE_BOARD: error });
      throw CustomError.internalServer(
        "Error while DELETING board -  at PostgresBoardDatasource.ts",
      );
    }
  };
}
