import {
  CreateBoardDto,
  CreateStatusColumnDto,
  CreateSubtaskDto,
  CreateTaskDto,
  RegisterUserDto,
} from "../../src/application/dtos";

// Auth
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

// Boards

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

// Status Columns

export const mockStatusColumnData1: CreateStatusColumnDto = {
  name: "test status column 1",
  description: "some description uwu",
};
export const mockStatusColumnData2: CreateStatusColumnDto = {
  name: "test status column 2",
  description: "some description uwu",
};
export const mockStatusColumnData3: CreateStatusColumnDto = {
  name: "test status column 3",
  description: "some description uwu",
};

// Tasks
export const mockTask1: CreateTaskDto = {
  title: "test task 1",
  description: "some description for task 1",
  order: 1,
};
export const mockTask2: CreateTaskDto = {
  title: "test task 2",
  description: "some description for task 2",
  order: 1,
};
export const mockTask3: CreateTaskDto = {
  title: "test task 3",
  description: "some description for task 3",
  order: 1,
};

// Subtasks
export const mockSubtask1: CreateSubtaskDto = {
  description: "Some description for subastk 1",
};
export const mockSubtask2: CreateSubtaskDto = {
  description: "Some description for subastk 2",
};
export const mockSubtask3: CreateSubtaskDto = {
  description: "Some description for subastk 3",
};
