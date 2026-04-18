import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  public abstract login: () // loginUserDto:LoginUserDto
  => Promise<UserEntity>;
  public abstract register: () // RegisterUserDto:RegisterUserDto
  => Promise<UserEntity>;
}
