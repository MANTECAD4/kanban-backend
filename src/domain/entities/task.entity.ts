import { TaskTag } from "../../application/dtos";
import { CategoryEntity } from "./category.entity";
import { SubtaskEntity } from "./subtask.entity";

export enum Priority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

interface TaskProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  statusColumnId: number;
  tags: TaskTag[];
}

export class TaskEntity {
  public id: number;
  public title: string;
  public slug: string;
  public description: string;
  public dueDate: Date;
  public priority: Priority;
  public statusColumnId: number;
  public tags: TaskTag[];

  constructor(props: TaskProps) {
    const {
      id,
      title,
      slug,
      description,
      dueDate,
      priority,
      statusColumnId,
      tags,
    } = props;
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.statusColumnId = statusColumnId;
    this.tags = tags;
  }

  static fromObject = (object: Record<string, any>): TaskEntity => {
    const {
      id,
      _id,
      title,
      slug,
      description,
      due_date,
      priority,
      tags,
      status_column_id,
    } = object;
    return new TaskEntity({
      id: id ?? _id,
      title,
      slug,
      description,
      dueDate: due_date,
      tags,
      priority,
      statusColumnId: status_column_id,
    });
  };
}
