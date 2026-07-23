import { TaskTag } from "../../application/dtos";

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
  order: number;
  priority: Priority;
  categoryId: number;
  tags: TaskTag[];
}

export class TaskEntity {
  public id: number;
  public title: string;
  public slug: string;
  public description: string;
  public dueDate: Date;
  public readonly order: number;
  public priority: Priority;
  public categoryId: number;
  public tags: TaskTag[];

  constructor(props: TaskProps) {
    const {
      id,
      title,
      slug,
      description,
      dueDate,
      order,
      priority,
      categoryId,
      tags,
    } = props;
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.dueDate = dueDate;
    this.order = order;
    this.priority = priority;
    this.categoryId = categoryId;
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
      order,
      priority,
      tags,
      category_id,
    } = object;
    return new TaskEntity({
      id: id ?? _id,
      title,
      slug,
      description,
      dueDate: due_date,
      order,
      tags,
      priority,
      categoryId: category_id,
    });
  };
}
