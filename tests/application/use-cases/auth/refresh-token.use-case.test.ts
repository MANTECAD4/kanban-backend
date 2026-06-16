import { beforeEach, describe, expect, test, vi } from "vitest";
import { TokenProvider } from "../../../../src/domain/services/token-generator.service";
import { RefreshTokenRepository } from "../../../../src/domain/repositories/refresh-token.repository";
import { RefreshTokenUseCase } from "../../../../src/application/use-cases/auth/refresh-token.use-case";
import { mockRefreshTokenPayload } from "../../../fixtures/use-cases";
describe("Get Refresh toke use case", () => {
  beforeEach(() => vi.resetAllMocks());

  const tokenProvider = {
    generate: vi.fn(),
    validate: vi.fn(),
  };
  const refreshTokenRepository = {
    checkRelation: vi.fn(),
    save: vi.fn(),
    getByJti: vi.fn(),
    revoke: vi.fn(),
    revokeAllByUser: vi.fn(),
  };
  const refreshTokenPersistencyService = {
    createAndSave: vi.fn(),
  };
  const refreshTokenDuration = 15;
  const accessTokenDuration = 30;

  test(`should return an access token and a refresh token`, async () => {
    const mockAccessToken = "this-shuld-be-an-access-token";
    const mockRefreshToken = "this-shuld-be-an-refresh-token";
    refreshTokenPersistencyService.createAndSave.mockResolvedValue(
      mockAccessToken,
    );
    tokenProvider.generate.mockReturnValue(mockRefreshToken);

    const refreshTokensUseCase = new RefreshTokenUseCase({
      accessTokenDuration,
      refreshTokenDuration,
      //@ts-expect-error
      refreshTokenPersistencyService,
      refreshTokenRepository,
      tokenProvider,
    });

    const result = await refreshTokensUseCase.execute(mockRefreshTokenPayload);

    expect(refreshTokenRepository.revoke).toHaveBeenCalledWith(
      mockRefreshTokenPayload.jti,
    );
    expect(refreshTokenPersistencyService.createAndSave).toHaveBeenCalledWith({
      userId: mockRefreshTokenPayload.sub.id,
      refreshTokenDuration,
    });
    expect(tokenProvider.generate).toHaveBeenCalledWith(
      { sub: { id: mockRefreshTokenPayload.sub.id }, type: "access" },
      accessTokenDuration,
    );
    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("newRefreshToken");
  });
});
