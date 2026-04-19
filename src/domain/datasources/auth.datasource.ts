import { LoginUserDto, RegisterUserDto } from "../../application/dtos";
import { UserEntity } from "../entities/user.entity";

export abstract class AuthDatasource {
  public abstract login: (
    loginUserDto: LoginUserDto, // loginUserDto:LoginUserDto
  ) => Promise<UserEntity>;
  public abstract register: (
    registerUserDto: RegisterUserDto, // RegisterUserDto:RegisterUserDto
  ) => Promise<UserEntity>;

  public abstract getByEmail: (email: string) => Promise<UserEntity | null>;
}
