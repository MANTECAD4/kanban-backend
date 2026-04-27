import { BoardEntity } from "./board.entity";

interface ColumnProps {
  id: number;
  name: string;
  description: string;
  boardId: number;
  // board: BoardEntity;
  // tasks: any[];
}

export class StatusColumnEntity {
  public id: number;
  public name: string;
  public description: string;
  public boardId: number;
  // public board: BoardEntity;
  // public tasks: any[];

  constructor(options: ColumnProps) {
    const { id, name, description, boardId } = options;
    this.id = id;
    this.name = name;
    this.description = description;
    this.boardId = boardId;
    // this.tasks = tasks;
  }

  static fromObject = (object: Record<string, any>) => {
    const { id, _id, name, description, boardId, board_id } = object;
    return new StatusColumnEntity({
      id: id ?? _id,
      name,
      description,
      boardId: board_id ?? boardId,
    });
  };
}
