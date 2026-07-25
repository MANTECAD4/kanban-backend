import { SubmitSubtaskDto } from "../../application/dtos/subtask.dto";
import { SubtaskEntity } from "../entities/subtask.entity";

export abstract class SubtaskRepository {
  abstract checkRelation: (
    userId: number,
    subtaskId: number,
  ) => Promise<SubtaskEntity | null>;

  abstract getAllByTask: (taskId: number) => Promise<SubtaskEntity[]>;

  abstract getById: (subtaskId: number) => Promise<SubtaskEntity | null>;

  abstract create: (
    taskId: number,
    data: SubmitSubtaskDto,
  ) => Promise<SubtaskEntity>;

  abstract updateDescription: (
    subtaskId: number,
    description: string,
  ) => Promise<SubtaskEntity>;

  abstract updateCompletionStatus: (
    subtaskId: number,
    status: boolean,
  ) => Promise<SubtaskEntity>;

  abstract delete: (subtaskId: number) => Promise<SubtaskEntity>;
}
