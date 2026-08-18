import {
  SubmitTaskDto,
  TasksMetaByPriorityDto,
  UpcomingTaskDto,
} from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { TaskEntity, TaskPriority } from "../../domain/entities";
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
            board: { user: { id: userId } },
          },
        },
      });
    } else {
      task = await prisma.task.findFirst({ where: { slug: searchKey } });
    }

    return task ? TaskEntity.fromObject(task) : null;
  };

  public getCount = async (categoryId: number): Promise<number> => {
    return await prisma.task.count({ where: { category_id: categoryId } });
  };

  public getAllByCategory = async (
    categoryId: number,
  ): Promise<TaskEntity[]> => {
    const tasks = await prisma.task.findMany({
      where: {
        category_id: categoryId,
      },
      orderBy: { order: "asc" },
    });
    return tasks.map((rawTask) => TaskEntity.fromObject(rawTask));
  };

  public getAllByBoard = async (boardId: number): Promise<TaskEntity[]> => {
    const tasks = await prisma.task.findMany({
      where: { category: { board_id: boardId } },
    });

    return tasks.map((task) => TaskEntity.fromObject(task));
  };

  public getById = async (taskId: number): Promise<TaskEntity | null> => {
    const task = await prisma.task.findFirst({ where: { id: taskId } });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public getBySlug = async (
    boardId: number,
    taskSlug: string,
  ): Promise<TaskEntity | null> => {
    console.log({ taskSlug });
    const task = await prisma.task.findFirst({
      where: { slug: taskSlug, category: { board_id: boardId } },
    });
    return task ? TaskEntity.fromObject(task) : null;
  };

  public create = async (
    categoryId: number,
    { dueDate, ...rest }: SubmitTaskDto & { order: number },
  ): Promise<TaskEntity> => {
    const createdTask = await prisma.task.create({
      data: { ...rest, due_date: dueDate, category_id: categoryId },
    });
    return TaskEntity.fromObject(createdTask);
  };

  public update = async (
    taskId: number,
    { dueDate, ...rest }: SubmitTaskDto,
  ): Promise<TaskEntity> => {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { due_date: dueDate, ...rest },
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

  public updateOrder = async (
    taskId: number,
    order: number,
  ): Promise<TaskEntity> => {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { order },
    });
    return TaskEntity.fromObject(updatedTask);
  };

  public delete = async (taskId: number): Promise<TaskEntity> => {
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    return TaskEntity.fromObject(deletedTask);
  };

  public getUpcomingTasks = async (
    userId: number,
  ): Promise<UpcomingTaskDto[]> => {
    const rawTasks = await prisma.task.findMany({
      where: { category: { board: { user_id: userId } } },
      orderBy: { due_date: "asc" },
      include: {
        category: {
          include: { board: true },
          omit: {
            board_id: true,
            icon: true,
            name: true,
            id: true,
            order: true,
          },
        },
      },
      omit: {
        category_id: true,
        created_at: true,
        description: true,
        order: true,
        priority: true,
        tags: true,
      },
    });

    const upcomingTasks: UpcomingTaskDto[] = rawTasks.map(
      ({ category: { board }, due_date, ...rawTask }) => ({
        task: { ...rawTask, dueDate: due_date },
        board: { id: board.id, name: board.name, slug: board.slug },
      }),
    );

    return upcomingTasks;
  };

  public getMetaByPriority = async (
    userId: number,
  ): Promise<TasksMetaByPriorityDto> => {
    const tasks = await prisma.task.findMany({
      where: { category: { board: { user_id: userId } } },
    });

    const total = tasks.length;
    const low = tasks.filter(
      (task) => task.priority === TaskPriority.Low,
    ).length;
    const medium = tasks.filter(
      (task) => task.priority === TaskPriority.Medium,
    ).length;
    const high = tasks.filter(
      (task) => task.priority === TaskPriority.High,
    ).length;
    const urgent = tasks.filter(
      (task) => task.priority === TaskPriority.Urgent,
    ).length;

    return { total, low, medium, high, urgent };
  };
}
