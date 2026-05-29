import { beforeAll, describe, afterEach, afterAll, test, expect } from "vitest";
import { prisma } from "../../../src/data/init-postgres";
import { mockUserData1 } from "../../fixtures";
import { PostgresRefreshTokenRepository } from "../../../src/infraestructure/repositories/postgres-refresh-token.repository";
import { RefreshTokenEntity } from "../../../src/domain/entities/refresh-token.entity";
import { RefreshTokenEntityDto } from "../../../src/application/dtos";

describe("Refresh Token Repository", () => {
  let userId: number;
  const tokenData = {
    hash: "token-after-digest",
    expiresAt: new Date("2026-01-01"),
  };
  const postgresRefreshTokenRepository = new PostgresRefreshTokenRepository();

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.refreshToken.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({});
    const { id: userIdOriginal } = await prisma.user.create({
      data: mockUserData1,
    });
    userId = userIdOriginal;
  });

  afterEach(async () => {
    await prisma.refreshToken.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Success cases", () => {
    test(`'save' returns a refresh token entity`, async () => {
      const jti = crypto.randomUUID();
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };
      const createdToken =
        await postgresRefreshTokenRepository.save(refreshTokenData);
      expect(createdToken).toBeInstanceOf(RefreshTokenEntity);
    });
  });
});
