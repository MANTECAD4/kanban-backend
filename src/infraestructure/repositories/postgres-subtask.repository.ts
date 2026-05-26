import { CreateSubtaskDto } from "../../application/dtos/subtask.dto";
import { prisma } from "../../data/init-postgres";
import { SubtaskEntity } from "../../domain/entities/subtask.entity";
import { SubtaskRepository } from "../../domain/repositories/subtask.repository";

export class PostgresSubtaskRepository implements SubtaskRepository {
  public checkRelation = async (
    userId: number,
    subtaskId: number,
  ): Promise<SubtaskEntity | null> => {
    const subtask = await prisma.subtasks.findFirst({
      where: {
        id: subtaskId,
        task: { status_column: { board: { user: { id: userId } } } },
      },
    });
    return subtask ? SubtaskEntity.fromObject(subtask) : null;
  };

  public getAllByTask = async (taskId: number): Promise<SubtaskEntity[]> => {
    const subtasks = await prisma.subtasks.findMany({
      where: { task_id: taskId },
    });
    return subtasks.map((subtask) => SubtaskEntity.fromObject(subtask));
  };

  public getById = async (subtaskId: number): Promise<SubtaskEntity | null> => {
    const subtask = await prisma.subtasks.findUnique({
      where: { id: subtaskId },
    });
    return subtask ? SubtaskEntity.fromObject(subtask) : null;
  };

  public create = async (
    taskId: number,
    data: CreateSubtaskDto,
  ): Promise<SubtaskEntity> => {
    const createdSubtask = await prisma.subtasks.create({
      data: { ...data, task_id: taskId, is_completed: false },
    });
    return SubtaskEntity.fromObject(createdSubtask);
  };

  public update = async (
    subtaskId: number,
    data: Record<string, any>,
  ): Promise<SubtaskEntity> => {
    const { isCompleted, ...rest } = data;
    console.log({ data });
    const updatedSubtask = await prisma.subtasks.update({
      where: { id: subtaskId },
      data: { ...rest, is_completed: isCompleted },
    });
    return SubtaskEntity.fromObject(updatedSubtask);
  };

  public delete = async (subtaskId: number): Promise<SubtaskEntity> => {
    const deletedSubtask = await prisma.subtasks.delete({
      where: { id: subtaskId },
    });
    return SubtaskEntity.fromObject(deletedSubtask);
  };
}
