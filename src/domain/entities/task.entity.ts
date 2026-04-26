import { StatusColumnEntity } from "./status-column.entity";

interface TaskProps {
  id: number;
  title: string;
  description: string;
  order: number;
  subtasks: string[];
  statusId: number;
}

export class TaskEntity {
  public id: number;
  public title: string;
  public description: string;
  public order: number;
  public subtasks: string[];
  public statusId: number;

  constructor(props: TaskProps) {
    const { description, id, order, statusId, subtasks, title } = props;

    this.id = id;
    this.title = title;
    this.description = description;
    this.order = order;
    this.subtasks = subtasks;
    this.statusId = statusId;
  }

  static fromObject = (object: Record<string, any>): TaskEntity => {
    const {
      id,
      _id,
      title,
      description,
      order,
      subtasks,
      statusId,
      status_id,
    } = object;
    return new TaskEntity({
      id: id ?? _id,
      title,
      description,
      order,
      subtasks,
      statusId: statusId ?? status_id,
    });
  };
}
