import { StatusColumnEntity } from "./status-column.entity";

interface TaskProps {
  id: number;
  title: string;
  description: string;
  order: number;
  statusColumnId: number;
}

export class KanbanTaskEntity {
  public id: number;
  public title: string;
  public description: string;
  public order: number;
  public statusColumnId: number;

  constructor(props: TaskProps) {
    const { description, id, order, statusColumnId, title } = props;

    this.id = id;
    this.title = title;
    this.description = description;
    this.order = order;
    this.statusColumnId = statusColumnId;
  }

  static fromObject = (object: Record<string, any>): KanbanTaskEntity => {
    const {
      id,
      _id,
      title,
      description,
      order,

      statusColumnId,
      status_column_id,
    } = object;
    return new KanbanTaskEntity({
      id: id ?? _id,
      title,
      description,
      order,
      statusColumnId: statusColumnId ?? status_column_id,
    });
  };
}
