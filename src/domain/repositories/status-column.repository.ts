import { CreateStatusColumnDto } from "../../application/dtos";
import { StatusColumnEntity } from "../entities/status-column.entity";

export abstract class StatusColumnRepository {
  public abstract findAll: (
    boardId: number, // DTO
  ) => Promise<StatusColumnEntity[]>;
  public abstract findByBoardAndName: (
    boardId: number,
    name: string,
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
