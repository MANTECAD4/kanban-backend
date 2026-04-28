import { CreateStatusColumnDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { StatusColumnEntity } from "../../domain/entities";
import { StatusColumnRepository } from "../../domain/repositories";

export class PostgresStatusColumnRepository implements StatusColumnRepository {
  public checkRelationship = async (
    userId: number,
    columnId: number,
  ): Promise<boolean> => {
    try {
      const column = await prisma.statusColumn.findFirst({
        where: { id: columnId, board: { user: { id: userId } } },
      });

      return column ? true : false;
    } catch (error) {
      throw error;
    }
  };

  public getAll = async (boardId: number): Promise<StatusColumnEntity[]> => {
    try {
      const rawColumns = await prisma.statusColumn.findMany({
        where: {
          board_id: boardId,
        },
      });

      return rawColumns.map((column) => StatusColumnEntity.fromObject(column));
    } catch (error) {
      throw error;
    }
  };

  public getByBoardAndName = async (
    boardId: number,
    name: string,
  ): Promise<StatusColumnEntity | null> => {
    try {
      const column = await prisma.statusColumn.findFirst({
        where: { board_id: boardId, name },
      });
      return !column ? null : StatusColumnEntity.fromObject(column);
    } catch (error) {
      throw error;
    }
  };
  public getById = async (
    columnId: number,
  ): Promise<StatusColumnEntity | null> => {
    try {
      const column = await prisma.statusColumn.findFirst({
        where: { id: columnId },
      });
      return !column ? null : StatusColumnEntity.fromObject(column);
    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
    }
  };
  public delete = async (columnId: number): Promise<StatusColumnEntity> => {
    try {
      const deletedColumn = await prisma.statusColumn.delete({
        where: { id: columnId },
      });
      return StatusColumnEntity.fromObject(deletedColumn);
    } catch (error) {
      throw error;
    }
  };
}
