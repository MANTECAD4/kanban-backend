interface ColumnProps {
  id: number;
  name: string;
  icon: string;
  boardId: number;
}

export class StatusColumnEntity {
  public id: number;
  public name: string;
  public icon: string;
  public boardId: number;

  constructor(options: ColumnProps) {
    const { id, name, icon, boardId } = options;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.boardId = boardId;
  }

  static fromObject = (object: Record<string, any>) => {
    const { id, _id, name, icon, board_id } = object;
    return new StatusColumnEntity({
      id: id ?? _id,
      name,
      icon,
      boardId: board_id,
    });
  };
}
