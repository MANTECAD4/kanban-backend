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
}
