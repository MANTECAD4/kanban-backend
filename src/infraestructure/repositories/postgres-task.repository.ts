import { CreateTaskDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { TaskEntity } from "../../domain/entities";
import { TaskRepository } from "../../domain/repositories";

export class PostgresTaskRepository implements TaskRepository {
  public checkRelationship = async (
    userId: number,
    taskId: number,
  ): Promise<TaskEntity | null> => {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        status_column: {
          board: { user: { id: userId } },
        },
      },
    });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public getAllByStatusColumn = async (
    columnId: number,
  ): Promise<TaskEntity[]> => {
    const tasks = await prisma.task.findMany({
      where: {
        status_column_id: columnId,
      },
    });
    return tasks.map((rawTask) => TaskEntity.fromObject(rawTask));
  };

  public getById = async (taskId: number): Promise<TaskEntity | null> => {
    const task = await prisma.task.findFirst({ where: { id: taskId } });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public getByTitle = async (title: string): Promise<TaskEntity | null> => {
    const task = await prisma.task.findFirst({ where: { title } });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public create = async (
    columnId: number,
    data: CreateTaskDto,
  ): Promise<TaskEntity> => {
    const createdTask = await prisma.task.create({
      data: { ...data, status_column_id: columnId },
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

  public delete = async (taskId: number): Promise<TaskEntity> => {
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    return TaskEntity.fromObject(deletedTask);
  };
}
