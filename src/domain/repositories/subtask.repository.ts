import { CreateSubtaskDto } from "../../application/dtos/subtask.dto";
import { SubtaskEntity } from "../entities/subtask.entity";

export abstract class SubtaskRepository {
  abstract checkRelationship: (
    userId: number,
    subtaskId: number,
  ) => Promise<SubtaskEntity | null>;
  abstract getAllByTask: (taskId: number) => Promise<SubtaskEntity[]>;
  abstract getById: (subtaskId: number) => Promise<SubtaskEntity | null>;
  abstract create: (
    taskId: number,
    data: CreateSubtaskDto,
  ) => Promise<SubtaskEntity>;
  abstract update: (
    subtaskId: number,
    data: Record<string, any>,
  ) => Promise<SubtaskEntity>;
  abstract delete: (subtaskId: number) => Promise<SubtaskEntity>;
}
