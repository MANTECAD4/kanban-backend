import { StatusColumnEntity } from "./status-column.entity";
import { UserEntity } from "./user.entity";

interface BoardProps {
  id: number;
  name: string;
  user: UserEntity;
  userId: number;
  // columns: StatusColumnEntity[];
}

export class BoardEntity {
  public id: number;
  public name: string;
  public user: UserEntity;
  public userId: number;
  // public columns: StatusColumnEntity[];

  constructor(options: BoardProps) {
    const { id, name, user, userId } = options;

    this.id = id;
    this.name = name;
    this.user = user;
    this.userId = userId;
    // this.columns = columns;
  }
}
