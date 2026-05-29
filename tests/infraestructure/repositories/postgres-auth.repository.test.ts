import { afterAll, beforeAll, afterEach, describe, expect, test } from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import { PostgresAuthRepository } from "../../../src/infraestructure/repositories/postgres-auth.repository";
import { UserEntity } from "../../../src/domain/entities";
import { mockUserData1 } from "../../fixtures";

describe("Postgres Auth Repository", () => {
  let postgresAuthRepository: PostgresAuthRepository;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany({});
    postgresAuthRepository = new PostgresAuthRepository();
  });
  afterEach(async () => {
    await prisma.user.deleteMany({});
  });
  afterAll(async () => await prisma.$disconnect());

  describe("Success cases", () => {
    test("'register' should create a new instace of user Model & return an instace of User Entity", async () => {
      const registeredUser =
        await postgresAuthRepository.register(mockUserData1);
      expect(registeredUser).toBeInstanceOf(UserEntity);
    });

    test(`'getByEmail' should return an User Entity instace if user with given email exists`, async () => {
      await postgresAuthRepository.register(mockUserData1);
      const userFound = await postgresAuthRepository.getByEmail(
        mockUserData1.email,
      );
      expect(userFound).toBeInstanceOf(UserEntity);
    });

    test(`'getById' returns an user entity if user with given id exists`, async () => {
      const registeredUser =
        await postgresAuthRepository.register(mockUserData1);
      const userFound = await postgresAuthRepository.getById(registeredUser.id);
      expect(userFound).toBeInstanceOf(UserEntity);
    });
  });

  describe("Failure cases", () => {
    test("'register' should throw an error if an 'already registered' email is recieved", async () => {
      await postgresAuthRepository.register(mockUserData1);
      await expect(
        postgresAuthRepository.register(mockUserData1),
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
