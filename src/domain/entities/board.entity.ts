import { StatusColumnEntity } from "./status-column.entity";
import { TagEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";

interface BoardProps {
  id: number;
  name: string;
  userId: number;
  description: string | null;
  user: UserEntity | null;
  statusColumns: StatusColumnEntity[] | null;
  tags: TagEntity[] | null;
}

export class BoardEntity {
  public id: number;
  public name: string;
  public userId: number;
  public description: string | null;
  public user: UserEntity | null;
  public statusColumns: StatusColumnEntity[] | null;
  public tags: TagEntity[] | null;

  constructor(options: BoardProps) {
    const {
      id,
      name,
      userId,
      description = null,
      user = null,
      statusColumns = null,
      tags = null,
    } = options;

    this.id = id;
    this.name = name;
    this.userId = userId;
    this.description = description;
    this.user = user;
    this.statusColumns = statusColumns;
    this.tags = tags;
  }

  public static fromObject = (object: Record<string, any>): BoardEntity => {
    const { id, _id, name, user_id, description, user, status_columns, tags } =
      object;

    const boardInstace = new BoardEntity({
      id: id ?? _id,
      name,
      userId: user_id,
      description,
      user,
      statusColumns: status_columns,
      tags,
    });

    return boardInstace;
  };
}
