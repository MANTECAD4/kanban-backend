import { CreateTaskDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { TaskEntity } from "../../domain/entities";
import { KanbanTaskRepository } from "../../domain/repositories";

export class PostgresTaskRepository implements KanbanTaskRepository {
  public checkRelationship = async (
    userId: number,
    taskId: number,
  ): Promise<boolean> => {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          status: {
            board: { user: { id: userId } },
          },
        },
      });
      return task ? true : false;
    } catch (error) {
      throw error;
    }
  };

  public getAll = async (columnId: number): Promise<TaskEntity[]> => {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          status_id: columnId,
        },
      });
      return tasks.map((rawTask) => TaskEntity.fromObject(rawTask));
    } catch (error) {
      throw error;
    }
  };

  public getById = async (taskId: number): Promise<TaskEntity | null> => {
    try {
      const task = await prisma.task.findFirst({ where: { id: taskId } });
      return task ? TaskEntity.fromObject(task) : null;
    } catch (error) {
      throw error;
    }
  };

  public getByTitle = async (title: string): Promise<TaskEntity | null> => {
    try {
      const task = await prisma.task.findFirst({ where: { title } });
      return task ? TaskEntity.fromObject(task) : null;
    } catch (error) {
      throw error;
    }
  };

  public create = async (
    columnId: number,
    data: CreateTaskDto,
  ): Promise<TaskEntity> => {
    try {
      const createdTask = await prisma.task.create({
        data: { ...data, status_id: columnId },
      });
      return TaskEntity.fromObject(createdTask);
    } catch (error) {
      throw error;
    }
  };

  public update = async (
    taskId: number,
    data: Record<string, any>,
  ): Promise<TaskEntity> => {
    try {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data,
      });
      return TaskEntity.fromObject(updatedTask);
    } catch (error) {
      throw error;
    }
  };

  public delete = async (taskId: number): Promise<TaskEntity> => {
    try {
      const deletedTask = await prisma.task.delete({ where: { id: taskId } });
      return TaskEntity.fromObject(deletedTask);
    } catch (error) {
      throw error;
    }
  };
}
