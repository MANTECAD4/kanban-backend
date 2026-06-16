import { BoardEntity } from "./board.entity";

interface UserOptions {
  id: number;
  email: string;
  name: string;
  password: string;
  boards: BoardEntity[] | null;
}

export class UserEntity {
  public id: number;
  public email: string;
  public name: string;
  public password: string;
  public boards: BoardEntity[] | null;

  constructor(options: UserOptions) {
    const { id, email, name, password, boards } = options;
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.boards = boards;
  }
}
