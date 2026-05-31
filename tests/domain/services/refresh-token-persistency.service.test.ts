import { describe, expect, test, vi } from "vitest";
import { RefreshTokenPersistencyService } from "../../../src/domain/services/refresh-token-persistency.service";
import { RefreshTokenRepository } from "../../../src/domain/repositories";
import { HasherService, TokenProvider } from "../../../src/domain/services";

describe("Refresh token persistency service", () => {
  const tokenReturnValue = "this-should-be-a-refresh-token";
  const hashReturnValue = "this-should-be-a-hashed-refresh-token";
  const refreshTokenRepository: RefreshTokenRepository = {
    checkRelation: vi.fn(),
    save: vi.fn(),
    getByJti: vi.fn(),
    revoke: vi.fn(),
    revokeAllByUser: vi.fn(),
  };
  const tokenProvider: TokenProvider = {
    generate: vi.fn().mockReturnValue(tokenReturnValue),
    validate: vi.fn(),
  };
  const hasherService: HasherService = {
    hash: vi.fn().mockReturnValue(hashReturnValue),
    compare: vi.fn(),
  };
  const refreshTokenPersistencyService = new RefreshTokenPersistencyService({
    refreshTokenRepository,
    hasherService,
    tokenProvider,
  });

  const userId = 10;
  const refreshTokenDuration = 60;
  test(`'createAndSave' calls 'generate' from token provider`, async () => {
    const returnedRefreshToken =
      await refreshTokenPersistencyService.createAndSave({
        refreshTokenDuration,
        userId,
      });

    expect(tokenProvider.generate).toHaveBeenCalledWith(
      {
        sub: { id: userId },
        type: "refresh",
        jti: expect.any(String),
      },
      refreshTokenDuration,
    );
    expect(returnedRefreshToken).toBe(tokenReturnValue);
  });

  test(`'createAndSave' calls 'hash' from hasher service`, async () => {
    await refreshTokenPersistencyService.createAndSave({
      userId,
      refreshTokenDuration,
    });

    expect(hasherService.hash).toHaveBeenCalledWith(tokenReturnValue);
  });

  test(`'createAndSave' calls 'save' from refreshTokenRepository`, async () => {
    await refreshTokenPersistencyService.createAndSave({
      userId,
      refreshTokenDuration,
    });

    expect(
      refreshTokenRepository.save({
        jti: expect.any(String),
        hash: hashReturnValue,
        userId,
        expiresAt: expect.any(Date),
      }),
    );
  });
});
