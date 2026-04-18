import { StatusColumnEntity } from "../entities/status-column.entity";

export abstract class StatusColumnRepository {
  public abstract findAll: () // DTO
  => Promise<StatusColumnEntity[]>;
  public abstract create: () // DTO
  => Promise<StatusColumnEntity[]>;
  public abstract update: () // DTO
  => Promise<StatusColumnEntity[]>;
  public abstract delete: () // DTO
  => Promise<StatusColumnEntity[]>;
}
