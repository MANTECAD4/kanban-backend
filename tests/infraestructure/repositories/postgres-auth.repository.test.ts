import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import { PostgresAuthRepository } from "../../../src/infraestructure/repositories/postgres-auth.repository";
import { RegisterUserDto } from "../../../src/application/dtos";
import { UserEntity } from "../../../src/domain/entities";

describe("Postgres Auth Repository", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });
  afterAll(async () => await prisma.$disconnect());

  const postgresAuthRepository = new PostgresAuthRepository();
  const mockUserData: RegisterUserDto = {
    name: "test user",
    email: "test@gmail.com",
    password: "abc123",
  };
  describe("Success cases", () => {
    test("'register' should create a new instace of user Model & return an instace of User Entity", async () => {
      const registeredUser =
        await postgresAuthRepository.register(mockUserData);
      expect(registeredUser).toBeInstanceOf(UserEntity);
    });

    test(`'getByEmail' should return an User Entity instace if user with given email exists`, async () => {
      await postgresAuthRepository.register(mockUserData);
      const userFound = await postgresAuthRepository.getByEmail(
        mockUserData.email,
      );
      expect(userFound).toBeInstanceOf(UserEntity);
    });

    test(`'getById' returns an user entity if user with given id exists`, async () => {
      const registeredUser =
        await postgresAuthRepository.register(mockUserData);
      const userFound = await postgresAuthRepository.getById(registeredUser.id);
      expect(userFound).toBeInstanceOf(UserEntity);
    });
  });

  describe("Failure cases", () => {
    test("'register' should throw an error if an 'already registered' email is recieved", async () => {
      await postgresAuthRepository.register(mockUserData);
      await expect(
        postgresAuthRepository.register(mockUserData),
      ).rejects.toThrow(/Unique constraint failed/i);
    });

    test(`'getByEmail' returns null if user was not found`, async () => {
      const userFound = await postgresAuthRepository.getByEmail(
        "emailNotexists@gmail.com",
      );
      expect(userFound).toBeNull();
    });

    test(`'getById' returns null if user was not found`, async () => {
      const userFound = await postgresAuthRepository.getById(31231231);
      expect(userFound).toBeNull();
    });
  });
});
