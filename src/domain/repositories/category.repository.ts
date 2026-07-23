import { SubmitCategoryDto } from "../../application/dtos";
import { CategoryEntity } from "../entities/category.entity";

export abstract class CategoryRepository {
  public abstract checkRelation: (
    userId: number,
    columnId: number,
  ) => Promise<CategoryEntity | null>;
  public abstract getAll: (
    boardId: number, // DTO
  ) => Promise<CategoryEntity[]>;
  public abstract getCount: (boardId: number) => Promise<number>;

  public abstract getByBoardAndName: (
    boardId: number,
    name: string,
  ) => Promise<CategoryEntity | null>;

  public abstract getById: (columnId: number) => Promise<CategoryEntity | null>;

  public abstract create: (
    boardId: number,
    data: SubmitCategoryDto & { order: number }, // DTO
  ) => Promise<CategoryEntity>;

  public abstract update: (
    columnId: number,
    data: SubmitCategoryDto, // DTO
  ) => Promise<CategoryEntity>;
  public abstract updateOrder: (
    columnId: number,
    order: number,
  ) => Promise<CategoryEntity>;

  public abstract delete: (
    columnId: number, // DTO
  ) => Promise<CategoryEntity>;
}
