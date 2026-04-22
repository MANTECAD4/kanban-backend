import { StatusColumnEntity } from "./status-column.entity";
import { UserEntity } from "./user.entity";

interface BoardProps {
  id: number;
  name: string;
  description?: string;
  userId: number;
}

export class BoardEntity {
  public id: number;
  public name: string;
  public description?: string;
  public userId: number;

  constructor(options: BoardProps) {
    const { id, name, userId, description } = options;

    this.id = id;
    this.name = name;
    this.userId = userId;
    if (description) this.description = description;
  }

  public static fromObject = (object: Record<string, any>): BoardEntity => {
    const { id, _id, name, userId, user_id, description } = object;
    return new BoardEntity({
      id: id ?? _id,
      name,
      userId: user_id ?? userId,
      description,
    });
  };
}
