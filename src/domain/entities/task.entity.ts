import { StatusColumnEntity } from "./status-column.entity";

interface TaskProps {
  id: number;
  title: string;
  description: string;
  order: number;
  subtasks: string[];
  statusId: number;
  // status: StatusColumnEntity;
}

export class TaskEntity {
  public id: number;
  public title: string;
  public description: string;
  public order: number;
  public subtasks: string[];
  public statusId: number;
  // public status: StatusColumnEntity;

  constructor(props: TaskProps) {
    const { description, id, order, statusId, subtasks, title } = props;

    this.id = id;
    this.title = title;
    this.description = description;
    this.order = order;
    this.subtasks = subtasks;
    this.statusId = statusId;
    // this.status = status;
  }
}
