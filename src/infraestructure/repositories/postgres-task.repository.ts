import { SubmitTaskDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { TaskEntity } from "../../domain/entities";
import { TaskRepository } from "../../domain/repositories";

export class PostgresTaskRepository implements TaskRepository {
  public checkRelation = async (
    userId: number,
    searchKey: number | string,
  ): Promise<TaskEntity | null> => {
    let task;

    if (typeof searchKey === "number") {
      task = await prisma.task.findFirst({
        where: {
          id: searchKey,
          category: {
            board: { project: { user: { id: userId } } },
          },
        },
      });
    } else {
      task = await prisma.task.findFirst({ where: { slug: searchKey } });
    }

    return task ? TaskEntity.fromObject(task) : null;
  };

  public getAllByStatusColumn = async (
    categoryId: number,
  ): Promise<TaskEntity[]> => {
    const tasks = await prisma.task.findMany({
      where: {
        category_id: categoryId,
      },
    });
    return tasks.map((rawTask) => TaskEntity.fromObject(rawTask));
  };

  public getById = async (taskId: number): Promise<TaskEntity | null> => {
    const task = await prisma.task.findFirst({ where: { id: taskId } });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public create = async (
    categoryId: number,
    { dueDate, ...rest }: SubmitTaskDto,
  ): Promise<TaskEntity> => {
    const createdTask = await prisma.task.create({
      data: { ...rest, due_date: dueDate, category_id: categoryId },
    });
    return TaskEntity.fromObject(createdTask);
  };

  public update = async (
    taskId: number,
    data: Record<string, any>,
  ): Promise<TaskEntity> => {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    });
    return TaskEntity.fromObject(updatedTask);
  };
  public updateTaskCategory = async (
    taskId: number,
    categoryId: number,
  ): Promise<TaskEntity> => {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { category_id: categoryId },
    });
    return TaskEntity.fromObject(updatedTask);
  };

  public delete = async (taskId: number): Promise<TaskEntity> => {
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    return TaskEntity.fromObject(deletedTask);
  };
}
