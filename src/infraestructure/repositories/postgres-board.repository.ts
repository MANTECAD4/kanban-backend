import { CreateBoardDto, UpdateBoardDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { BoardEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";
import { BoardRepository } from "../../domain/repositories";

export class PostgresBoardRepository implements BoardRepository {
  public findAll = async (userId: number): Promise<BoardEntity[]> => {
    try {
      const rawBoards = await prisma.board.findMany({ where: { userId } });
      return rawBoards.map((board) => new BoardEntity(board));
    } catch (error) {
      console.log({ ERROR_READING_BOARDS: error });
      throw CustomError.internalServer(
        "Error while loading boards from DB - at PostgresBoardDatasource.ts",
      );
    }
  };

  public findByName = async (name: string): Promise<BoardEntity | null> => {
    try {
      const board = await prisma.board.findFirst({ where: { name } });
      return board === null ? null : new BoardEntity(board);
    } catch (error) {
      console.log({ ERROR_READING_BOARD_BY_ID: error });
      throw CustomError.internalServer(
        "Error while loading board from DB - at PostgresBoardDatasource.ts -> findById",
      );
    }
  };

  public create = async (
    createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> => {
    try {
      const createdBoard = await prisma.board.create({
        data: createBoardDto,
      });
      return new BoardEntity(createdBoard);
    } catch (error) {
      console.log({ ERROR_CREATING_BOARD: error });
      throw CustomError.internalServer(
        "Error while loading boards from DB - at PostgresBoardDatasource.ts",
      );
    }
  };
  public update = async (
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<BoardEntity> => {
    try {
      const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data: updateBoardDto,
      });
      return new BoardEntity(updatedBoard);
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
      return new BoardEntity(deletedBoard);
    } catch (error) {
      console.log({ ERROR_DELETE_BOARD: error });
      throw CustomError.internalServer(
        "Error while DELETING board -  at PostgresBoardDatasource.ts",
      );
    }
  };
}
