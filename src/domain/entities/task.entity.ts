import { StatusColumnEntity } from "./status-column.entity";
import { SubtaskEntity } from "./subtask.entity";
import { TagEntity } from "./tag.entity";

export enum Priority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

interface TaskProps {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  order: number;
  statusColumnId: number;
  statusColumn: StatusColumnEntity | null;
  subtasks: SubtaskEntity[] | null;
  tags: TagEntity[] | null;
}

export class TaskEntity {
  public id: number;
  public title: string;
  public description: string;
  public dueDate: Date;
  public priority: Priority;
  public order: number;
  public statusColumnId: number;
  public statusColumn: StatusColumnEntity | null;
  public subtasks: SubtaskEntity[] | null;
  public tags: TagEntity[] | null;

  constructor(props: TaskProps) {
    const {
      id,
      title,
      description,
      dueDate,
      priority,
      order,
      statusColumnId,
      statusColumn = null,
      subtasks = null,
      tags = null,
    } = props;
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.order = order;
    this.statusColumnId = statusColumnId;
    this.statusColumn = statusColumn;
    this.subtasks = subtasks;
    this.tags = tags;
  }

  static fromObject = (object: Record<string, any>): TaskEntity => {
    const {
      id,
      _id,
      title,
      description,
      order,
      due_date,
      priority,
      tags,
      status_column_id,
      status_column,
      subtasks,
    } = object;
    return new TaskEntity({
      id: id ?? _id,
      title,
      description,
      dueDate: due_date,
      tags,
      priority,
      order,
      statusColumnId: status_column_id,
      statusColumn: status_column,
      subtasks,
    });
  };
}
