import { afterAll, beforeAll, afterEach, describe, expect, test } from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import { PostgresUserRepository } from "../../../src/infraestructure/repositories/postgres-user.repository";
import { UserEntity } from "../../../src/domain/entities";
import { mockUserData1 } from "../../fixtures";

describe("Postgres Auth Repository", () => {
  let postgresUserRepository: PostgresUserRepository;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany({});
    postgresUserRepository = new PostgresUserRepository();
  });
  afterEach(async () => {
    await prisma.user.deleteMany({});
  });
  afterAll(async () => await prisma.$disconnect());

  describe("Success cases", () => {
    test("'register' should create a new instace of user Model & return an instace of User Entity", async () => {
      const registeredUser =
        await postgresUserRepository.register(mockUserData1);
      expect(registeredUser).toBeInstanceOf(UserEntity);
    });

    test(`'getByEmail' should return an User Entity instace if user with given email exists`, async () => {
      await postgresUserRepository.register(mockUserData1);
      const userFound = await postgresUserRepository.getByEmail(
        mockUserData1.email,
      );
      expect(userFound).toBeInstanceOf(UserEntity);
    });

    test(`'getById' returns an user entity if user with given id exists`, async () => {
      const registeredUser =
        await postgresUserRepository.register(mockUserData1);
      const userFound = await postgresUserRepository.getById(registeredUser.id);
      expect(userFound).toBeInstanceOf(UserEntity);
    });
  });

  describe("Failure cases", () => {
    test("'register' should throw an error if an 'already registered' email is recieved", async () => {
      await postgresUserRepository.register(mockUserData1);
      await expect(
        postgresUserRepository.register(mockUserData1),
      ).rejects.toThrow(/Unique constraint failed/i);
    });

    test(`'getByEmail' returns null if user was not found`, async () => {
      const userFound = await postgresUserRepository.getByEmail(
        "emailNotexists@gmail.com",
      );
      expect(userFound).toBeNull();
    });

    test(`'getById' returns null if user was not found`, async () => {
      const userFound = await postgresUserRepository.getById(31231231);
      expect(userFound).toBeNull();
    });
  });
});
