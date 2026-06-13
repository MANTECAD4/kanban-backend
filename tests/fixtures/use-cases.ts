import { LoginUserDto } from "../../src/application/dtos";
import { UserEntity } from "../../src/domain/entities/user.entity";

const email = "test-email@gmail.com";
const password = "abc1234+";

export const loginData: LoginUserDto = {
  email,
  password,
};
export const mockUserEntity: UserEntity = {
  id: 10,
  name: "test user entity 1",
  email,
  password,
};
