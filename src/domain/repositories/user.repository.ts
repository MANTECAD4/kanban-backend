import { RegisterUserDto } from "../../application/dtos";
import { UserEntity } from "../entities/user.entity";

export abstract class UserRepository {
  public abstract register: (
    registerUserDto: RegisterUserDto, // RegisterUserDto:RegisterUserDto
  ) => Promise<UserEntity>;
  public abstract getByEmail: (email: string) => Promise<UserEntity | null>;
  public abstract getById: (userId: number) => Promise<UserEntity | null>;
}
