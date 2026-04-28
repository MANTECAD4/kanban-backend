import { CreateKanbanTaskDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { KanbanTaskEntity } from "../../domain/entities";
import { KanbanTaskRepository } from "../../domain/repositories";

export class PostgresKanbanTaskRepository implements KanbanTaskRepository {
  public checkRelationship = async (
    userId: number,
    taskId: number,
  ): Promise<KanbanTaskEntity | null> => {
    try {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          status_column: {
            board: { user: { id: userId } },
          },
        },
      });
      return task ? KanbanTaskEntity.fromObject(task) : null;
    } catch (error) {
      throw error;
    }
  };

  public getAll = async (columnId: number): Promise<KanbanTaskEntity[]> => {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          status_column_id: columnId,
        },
      });
      return tasks.map((rawTask) => KanbanTaskEntity.fromObject(rawTask));
    } catch (error) {
      throw error;
    }
  };

  public getById = async (taskId: number): Promise<KanbanTaskEntity | null> => {
    try {
      const task = await prisma.task.findFirst({ where: { id: taskId } });
      return task ? KanbanTaskEntity.fromObject(task) : null;
    } catch (error) {
      throw error;
    }
  };

  public getByTitle = async (
    title: string,
  ): Promise<KanbanTaskEntity | null> => {
    try {
      const task = await prisma.task.findFirst({ where: { title } });
      return task ? KanbanTaskEntity.fromObject(task) : null;
    } catch (error) {
      throw error;
    }
  };

  public create = async (
    columnId: number,
    data: CreateKanbanTaskDto,
  ): Promise<KanbanTaskEntity> => {
    try {
      const createdTask = await prisma.task.create({
        data: { ...data, status_column_id: columnId },
      });
      return KanbanTaskEntity.fromObject(createdTask);
    } catch (error) {
      throw error;
    }
  };

  public update = async (
    taskId: number,
    data: Record<string, any>,
  ): Promise<KanbanTaskEntity> => {
    try {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data,
      });
      return KanbanTaskEntity.fromObject(updatedTask);
    } catch (error) {
      throw error;
    }
  };

  public delete = async (taskId: number): Promise<KanbanTaskEntity> => {
    try {
      const deletedTask = await prisma.task.delete({ where: { id: taskId } });
      return KanbanTaskEntity.fromObject(deletedTask);
    } catch (error) {
      throw error;
    }
  };
}
