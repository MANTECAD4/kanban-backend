import { CreateBoardDto, RegisterUserDto } from "../src/application/dtos";

export const mockUserData1: RegisterUserDto = {
  name: "test user 1",
  email: "test1@gmail.com",
  password: "abc123",
};
export const mockUserData2: RegisterUserDto = {
  name: "test user 2",
  email: "test2@gmail.com",
  password: "abc123",
};
export const mockUserData3: RegisterUserDto = {
  name: "test user 3",
  email: "test3@gmail.com",
  password: "abc123",
};

export const mockBoardData1: CreateBoardDto = {
  name: "test board 1",
  description: "test board description",
};
export const mockBoardData2: CreateBoardDto = {
  name: "test board 2",
  description: "test board description",
};
export const mockBoardData3: CreateBoardDto = {
  name: "test board 3",
  description: "test board description",
};
