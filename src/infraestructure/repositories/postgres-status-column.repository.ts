import { CreateStatusColumnDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { StatusColumnEntity } from "../../domain/entities";
import { StatusColumnRepository } from "../../domain/repositories";

export class PostgresStatusColumnRepository implements StatusColumnRepository {
  public checkRelationship = async (
    userId: number,
    columnId: number,
  ): Promise<boolean> => {
    const column = await prisma.statusColumn.findFirst({
      where: { id: columnId, board: { user: { id: userId } } },
    });

    return column ? true : false;
  };

  public getAll = async (boardId: number): Promise<StatusColumnEntity[]> => {
    const rawColumns = await prisma.statusColumn.findMany({
      where: {
        board_id: boardId,
      },
    });

    return rawColumns.map((column) => StatusColumnEntity.fromObject(column));
  };

  public getByBoardAndName = async (
    boardId: number,
    name: string,
  ): Promise<StatusColumnEntity | null> => {
    const column = await prisma.statusColumn.findFirst({
      where: { board_id: boardId, name },
    });
    return !column ? null : StatusColumnEntity.fromObject(column);
  };
  public getById = async (
    columnId: number,
  ): Promise<StatusColumnEntity | null> => {
    const column = await prisma.statusColumn.findFirst({
      where: { id: columnId },
    });
    return !column ? null : StatusColumnEntity.fromObject(column);
  };

  public create = async (
    boardId: number,
    data: CreateStatusColumnDto,
  ): Promise<StatusColumnEntity> => {
    const createdColumn = await prisma.statusColumn.create({
      data: { ...data, board_id: boardId },
    });
    return StatusColumnEntity.fromObject(createdColumn);
  };
  public update = async (
    columnId: number,
    data: Record<string, any>,
  ): Promise<StatusColumnEntity> => {
    const updatedColumn = await prisma.statusColumn.update({
      where: { id: columnId },
      data,
    });
    return StatusColumnEntity.fromObject(updatedColumn);
  };
  public delete = async (columnId: number): Promise<StatusColumnEntity> => {
    const deletedColumn = await prisma.statusColumn.delete({
      where: { id: columnId },
    });
    return StatusColumnEntity.fromObject(deletedColumn);
  };
}
