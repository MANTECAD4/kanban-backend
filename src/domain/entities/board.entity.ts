import { StatusColumnEntity } from "./status-column.entity";
import { UserEntity } from "./user.entity";

interface BoardProps {
  id: number;
  name: string;
  userId: number;
}

export class BoardEntity {
  public id: number;
  public name: string;
  public userId: number;

  constructor(options: BoardProps) {
    const { id, name, userId } = options;

    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  public static fromObject = (object: Record<string, any>): BoardEntity => {
    const { id, _id, name, userId, user_id } = object;
    return new BoardEntity({
      id: id ?? _id,
      name,
      userId: user_id ?? userId,
    });
  };
}
