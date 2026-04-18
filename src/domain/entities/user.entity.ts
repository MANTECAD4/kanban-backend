interface UserOptions {
  id: number;
  email: string;
  name: string;
  password: string;
}

export class UserEntity {
  public id: number;
  public email: string;
  public name: string;
  public password: string;

  constructor(options: UserOptions) {
    const { id, email, name, password } = options;
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
