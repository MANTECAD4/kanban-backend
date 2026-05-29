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
      expect(createdToken.revokedAt).toBeNull();
    });

    test(`'checkRelation' returns a refresh token entity`, async () => {
      const jti = crypto.randomUUID();
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };

      await postgresRefreshTokenRepository.save(refreshTokenData);

      const relatedRefreshToken =
        await postgresRefreshTokenRepository.checkRelation(userId, jti);
      expect(relatedRefreshToken).toBeInstanceOf(RefreshTokenEntity);
    });

    test(`'getByJti' returns a refresh token entity`, async () => {
      const jti = crypto.randomUUID();
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };

      await postgresRefreshTokenRepository.save(refreshTokenData);

      const refreshTokenFound =
        await postgresRefreshTokenRepository.getByJti(jti);
      expect(refreshTokenFound).toBeInstanceOf(RefreshTokenEntity);
    });

    test(`'revoke' sets a new date in revokedAt property`, async () => {
      const jti = crypto.randomUUID();
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };

      await postgresRefreshTokenRepository.save(refreshTokenData);

      const updatedRefreshToken =
        await postgresRefreshTokenRepository.revoke(jti);

      expect(updatedRefreshToken).toBeInstanceOf(RefreshTokenEntity);
      expect(updatedRefreshToken.revokedAt).toBeInstanceOf(Date);
    });

    test("revokeAllByUser sets all tokens as revoked :p", async () => {
      const jti1 = crypto.randomUUID();
      const refreshTokenData1: RefreshTokenEntityDto = {
        jti: jti1,
        userId,
        ...tokenData,
      };
      const jti2 = crypto.randomUUID();
      const refreshTokenData2: RefreshTokenEntityDto = {
        jti: jti2,
        userId,
        ...tokenData,
      };
      const jti3 = crypto.randomUUID();
      const refreshTokenData3: RefreshTokenEntityDto = {
        jti: jti3,
        userId,
        ...tokenData,
      };

      await postgresRefreshTokenRepository.save(refreshTokenData1);
      await postgresRefreshTokenRepository.save(refreshTokenData2);
      await postgresRefreshTokenRepository.save(refreshTokenData3);

      await postgresRefreshTokenRepository.revokeAllByUser(userId);

      const token1 = await postgresRefreshTokenRepository.getByJti(jti1);
      const token2 = await postgresRefreshTokenRepository.getByJti(jti2);
      const token3 = await postgresRefreshTokenRepository.getByJti(jti3);

      expect(token1?.revokedAt).toBeInstanceOf(Date);
      expect(token2?.revokedAt).toBeInstanceOf(Date);
      expect(token3?.revokedAt).toBeInstanceOf(Date);
    });
  });

  describe("Failure cases", () => {
    test(`'save' should throw an error if provided jti is not an uuid`, async () => {
      const jti = "not-an-uuid";
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };

      await expect(
        postgresRefreshTokenRepository.save(refreshTokenData),
      ).rejects.toThrow();
    });

    test(`'checkRelation' returns null`, async () => {
      const jti = crypto.randomUUID();
      const refreshTokenData: RefreshTokenEntityDto = {
        jti,
        userId,
        ...tokenData,
      };

      await postgresRefreshTokenRepository.save(refreshTokenData);

      const relatedRefreshToken =
        await postgresRefreshTokenRepository.checkRelation(-1, jti);
      expect(relatedRefreshToken).toBeNull();
    });

    test(`'getByJti' returns null`, async () => {
      const jti = crypto.randomUUID();

      const refreshTokenFound =
        await postgresRefreshTokenRepository.getByJti(jti);
      expect(refreshTokenFound).toBeNull();
    });
  });
});
