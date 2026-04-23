import { CreateStatusColumnDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { StatusColumnEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";
import { StatusColumnRepository } from "../../domain/repositories";

export class PostgresStatusColumnRepository implements StatusColumnRepository {
  public findAll = async (boardId: number): Promise<StatusColumnEntity[]> => {
    try {
      const rawColumns = await prisma.statusColumn.findMany({
        where: {
          board_id: boardId,
        },
      });

      return rawColumns.map((column) => StatusColumnEntity.fromObject(column));
    } catch (error) {
      console.log({ ERROR_LOADING_ALL_COLUMNS: error });
      throw CustomError.internalServer(
        `Error while loading columns for board with id ${boardId}`,
      );
    }
  };

  public findByName = async (
    boardId: number,
    name: string,
  ): Promise<StatusColumnEntity | null> => {
    try {
      const column = await prisma.statusColumn.findFirst({
        where: { board_id: boardId, name },
      });
      return !column ? null : StatusColumnEntity.fromObject(column);
    } catch (error) {
      console.log({ ERROR_FIND_BY_NAME_COLUMN: error });
      throw CustomError.internalServer(
        `Error while loading column ${name} from board with id ${boardId}`,
      );
    }
  };
  public create = async (
    boardId: number,
    data: CreateStatusColumnDto,
  ): Promise<StatusColumnEntity> => {
    try {
      const createdColumn = await prisma.statusColumn.create({
        data: { ...data, board_id: boardId },
      });
      return StatusColumnEntity.fromObject(createdColumn);
    } catch (error) {
      console.log({ ERROR_CREATING_COLUMN: error });
      throw CustomError.internalServer(`Error while creating columns`);
    }
  };
  public update = async (
    columnId: number,
    data: Record<string, any>,
  ): Promise<StatusColumnEntity> => {
    try {
      const updatedColumn = await prisma.statusColumn.update({
        where: { id: columnId },
        data,
      });
      return StatusColumnEntity.fromObject(updatedColumn);
    } catch (error) {
      console.log({ ERROR_UPDATING_COLUMN: error });
      throw CustomError.internalServer(
        `Error while updating column with id ${columnId}`,
      );
    }
  };
  public delete = async (columnId: number): Promise<StatusColumnEntity> => {
    try {
      const deletedColumn = await prisma.statusColumn.delete({
        where: { id: columnId },
      });
      return StatusColumnEntity.fromObject(deletedColumn);
    } catch (error) {
      console.log({ ERROR_DELETING_COLUMN: error });
      throw CustomError.internalServer(
        `Error while deleting column with id ${columnId}`,
      );
    }
  };
}
