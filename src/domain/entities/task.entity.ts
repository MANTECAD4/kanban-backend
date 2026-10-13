import { TaskTag } from "../../application/dtos";
import { SubtaskEntity } from "./subtask.entity";

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export interface TaskMeta {
  totalSubtasks: number;
  completedSubtasks: number;
  numAttatchments: number;
}

interface TaskProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  dueDate: Date;
  createdAt: Date;
  order: number;
  priority: TaskPriority;
  categoryId: number;
  tags: TaskTag[];
  subtasks: SubtaskEntity[] | null;
  meta: TaskMeta | null;
}

export class TaskEntity {
  public id: number;
  public title: string;
  public slug: string;
  public description: string;
  public dueDate: Date;
  public createdAt: Date;
  public readonly order: number;
  public priority: TaskPriority;
  public categoryId: number;
  public tags: TaskTag[];
  subtasks: SubtaskEntity[] | null;
  public readonly meta: TaskMeta | null;

  constructor(props: TaskProps) {
    const {
      id,
      title,
      slug,
      description,
      dueDate,
      createdAt,
      order,
      priority,
      categoryId,
      tags,
      subtasks = null,
      meta = null,
    } = props;
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.order = order;
    this.priority = priority;
    this.categoryId = categoryId;
    this.tags = tags;
    this.subtasks = subtasks;
    this.meta = meta;
  }

  static fromObject = (object: Record<string, any>): TaskEntity => {
    const {
      id,
      _id,
      title,
      slug,
      description,
      due_date,
      created_at,
      order,
      priority,
      tags,
      category_id,
      subtasks,
      meta,
    } = object;
    return new TaskEntity({
      id: id ?? _id,
      title,
      slug,
      description,
      dueDate: due_date,
      createdAt: created_at,
      order,
      tags,
      priority,
      categoryId: category_id,
      subtasks,
      meta,
    });
  };
}
