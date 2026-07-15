import { SubmitCategoryDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { CategoryEntity, TaskEntity } from "../../domain/entities";
import { CategoryRepository } from "../../domain/repositories";

export class PostgresCategoryRepository implements CategoryRepository {
  public checkRelation = async (
    userId: number,
    categoryId: number,
  ): Promise<CategoryEntity | null> => {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, board: { project: { user: { id: userId } } } },
    });

    return category ? CategoryEntity.fromObject(category) : null;
  };

  public getAll = async (boardId: number): Promise<CategoryEntity[]> => {
    const rawcategories = await prisma.category.findMany({
      where: {
        board_id: boardId,
      },
      include: { tasks: true },
    });

    return rawcategories.map(({ tasks, ...category }) => {
      const taskEntities = tasks.map((task) => TaskEntity.fromObject(task));
      return CategoryEntity.fromObject({ ...category, tasks: taskEntities });
    });
  };

  /**
   * Checks if the board already has a status category using specified name
   * @param boardId
   * @param name
   * @returns
   */
  public getByBoardAndName = async (
    boardId: number,
    name: string,
  ): Promise<CategoryEntity | null> => {
    const category = await prisma.category.findFirst({
      where: { board_id: boardId, name },
    });
    return !category ? null : CategoryEntity.fromObject(category);
  };
  public getById = async (
    categoryId: number,
  ): Promise<CategoryEntity | null> => {
    const category = await prisma.category.findFirst({
      where: { id: categoryId },
    });
    return !category ? null : CategoryEntity.fromObject(category);
  };

  public create = async (
    boardId: number,
    data: SubmitCategoryDto,
  ): Promise<CategoryEntity> => {
    const createdcategory = await prisma.category.create({
      data: { ...data, board_id: boardId },
    });
    return CategoryEntity.fromObject(createdcategory);
  };

  public update = async (
    categoryId: number,
    data: Record<string, any>,
  ): Promise<CategoryEntity> => {
    const updatedcategory = await prisma.category.update({
      where: { id: categoryId },
      data,
    });
    return CategoryEntity.fromObject(updatedcategory);
  };
  public delete = async (categoryId: number): Promise<CategoryEntity> => {
    const deletedcategory = await prisma.category.delete({
      where: { id: categoryId },
    });
    return CategoryEntity.fromObject(deletedcategory);
  };
}
