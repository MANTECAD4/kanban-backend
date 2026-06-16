import { BoardEntity } from "./board.entity";
import { TaskEntity } from "./task.entity";

interface Props {
  id: number;
  name: string;
  color: string;
  boardId: number;
  board: BoardEntity | null;
  tasks: TaskEntity[] | null;
}

export class TagEntity {
  public id: number;
  public name: string;
  public color: string;
  public boardId: number;
  public board: BoardEntity | null;
  public tasks: TaskEntity[] | null;

  constructor(props: Props) {
    const { id, name, color, boardId, board = null, tasks = null } = props;
    this.id = id;
    this.name = name;
    this.color = color;
    this.boardId = boardId;
    this.board = board;
    this.tasks = tasks;
  }

  public static fromObject = (object: Record<string, any>): TagEntity => {
    const { id, _id, name, color, board_id, board, tasks } = object;

    return new TagEntity({
      id: id ?? _id,
      name,
      color,
      boardId: board_id,
      board,
      tasks,
    });
  };
}
