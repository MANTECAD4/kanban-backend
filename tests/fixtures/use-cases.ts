import { LoginUserDto, RegisterUserDto } from "../../src/application/dtos";
import { UserEntity } from "../../src/domain/entities/user.entity";

const name = "test user uwu";
const email = "test-email@gmail.com";
const password = "abc1234+";

export const mockLoginData: LoginUserDto = {
  email,
  password,
};

export const mockRegisterData: RegisterUserDto = {
  name,
  email,
  password,
};
export const mockUserEntity: UserEntity = {
  id: 10,
  name,
  email,
  password,
};
