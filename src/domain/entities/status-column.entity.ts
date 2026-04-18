import { BoardEntity } from "./board.entity";

interface ColumnProps {
  id: number;
  name: string;
  boardId: number;
  // board: BoardEntity;
  // tasks: any[];
}

export class StatusColumnEntity {
  public id: number;
  public name: string;
  public boardId: number;
  // public board: BoardEntity;
  // public tasks: any[];

  constructor(options: ColumnProps) {
    const { id, name, boardId } = options;
    this.id = id;
    this.name = name;
    this.boardId = boardId;
    // this.board = board;
    // this.tasks = tasks;
  }
}
