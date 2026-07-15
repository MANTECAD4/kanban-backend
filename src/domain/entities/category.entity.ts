import { TaskEntity } from "./task.entity";

interface ColumnProps {
  id: number;
  name: string;
  icon: string;
  boardId: number;
  tasks: TaskEntity[];
}

export class CategoryEntity {
  public id: number;
  public name: string;
  public icon: string;
  public boardId: number;
  public readonly tasks: TaskEntity[];

  constructor(options: ColumnProps) {
    const { id, name, icon, boardId, tasks = [] } = options;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.boardId = boardId;
    this.tasks = tasks;
  }

  static fromObject = (object: Record<string, any>) => {
    const { id, _id, name, icon, board_id, tasks } = object;
    return new CategoryEntity({
      id: id ?? _id,
      name,
      icon,
      boardId: board_id,
      tasks,
    });
  };
}
