import { CreateStatusColumnDto } from "../../application/dtos";
import { StatusColumnEntity } from "../entities/status-column.entity";

export abstract class StatusColumnRepository {
  public abstract checkRelation: (
    userId: number,
    columnId: number,
  ) => Promise<StatusColumnEntity | null>;
  public abstract getAll: (
    boardId: number, // DTO
  ) => Promise<StatusColumnEntity[]>;

  public abstract getByBoardAndName: (
    boardId: number,
    name: string,
  ) => Promise<StatusColumnEntity | null>;

  public abstract getById: (
    columnId: number,
  ) => Promise<StatusColumnEntity | null>;

  public abstract create: (
    boardId: number,
    data: CreateStatusColumnDto, // DTO
  ) => Promise<StatusColumnEntity>;

  public abstract update: (
    columnId: number,
    data: Record<string, any>, // DTO
  ) => Promise<StatusColumnEntity>;

  public abstract delete: (
    columnId: number, // DTO
  ) => Promise<StatusColumnEntity>;
}
