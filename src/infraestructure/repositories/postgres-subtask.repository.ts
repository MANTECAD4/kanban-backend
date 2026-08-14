import {
  ChangeSubtaskStatusDto,
  SubmitSubtaskDto,
} from "../../application/dtos/subtask.dto";
import { prisma } from "../../data/init-postgres";
import { SubtaskEntity } from "../../domain/entities/subtask.entity";
import { SubtaskRepository } from "../../domain/repositories/subtask.repository";

export class PostgresSubtaskRepository implements SubtaskRepository {
  public checkRelation = async (
    userId: number,
    subtaskId: number,
  ): Promise<SubtaskEntity | null> => {
    const subtask = await prisma.subtask.findFirst({
      where: {
        id: subtaskId,
        task: { category: { board: { user: { id: userId } } } },
      },
    });
    return subtask ? SubtaskEntity.fromObject(subtask) : null;
  };

  public getAllByTask = async (taskId: number): Promise<SubtaskEntity[]> => {
    const subtasks = await prisma.subtask.findMany({
      where: { task_id: taskId },
    });
    return subtasks.map((subtask) => SubtaskEntity.fromObject(subtask));
  };

  public getById = async (subtaskId: number): Promise<SubtaskEntity | null> => {
    const subtask = await prisma.subtask.findUnique({
      where: { id: subtaskId },
    });
    return subtask ? SubtaskEntity.fromObject(subtask) : null;
  };

  public create = async (
    taskId: number,
    data: SubmitSubtaskDto,
  ): Promise<SubtaskEntity> => {
    const createdSubtask = await prisma.subtask.create({
      data: { ...data, task_id: taskId, is_completed: false },
    });
    return SubtaskEntity.fromObject(createdSubtask);
  };

  public updateDescription = async (
    subtaskId: number,
    data: SubmitSubtaskDto,
  ): Promise<SubtaskEntity> => {
    const updatedSubtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data,
    });
    return SubtaskEntity.fromObject(updatedSubtask);
  };
  public updateCompletionStatus = async (
    subtaskId: number,
    { isCompleted }: ChangeSubtaskStatusDto,
  ): Promise<SubtaskEntity> => {
    const updatedSubtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { is_completed: isCompleted },
    });
    return SubtaskEntity.fromObject(updatedSubtask);
  };

  public delete = async (subtaskId: number): Promise<SubtaskEntity> => {
    const deletedSubtask = await prisma.subtask.delete({
      where: { id: subtaskId },
    });
    return SubtaskEntity.fromObject(deletedSubtask);
  };
}
