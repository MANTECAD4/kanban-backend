import { beforeEach, describe, expect, test, vi } from "vitest";
import { LoginUseCase } from "../../../../src/application/use-cases/auth/login-user.use-case";

import { RefreshTokenPersistencyService } from "../../../../src/domain/services/refresh-token-persistency.service";

import { mockLoginData, mockUserEntity } from "../../../fixtures/use-cases";
import {
  CustomError,
  ErrorCodes,
} from "../../../../src/domain/errors/custom-error";
describe("Login use case execution", () => {
  const userRepository = {
    register: vi.fn(),
    getByEmail: vi.fn(),
    getById: vi.fn(),
  };
  const tokenProvider = {
    generate: vi.fn(),
    validate: vi.fn(),
  };
  const strongHasher = {
    hash: vi.fn(),
    compare: vi.fn(),
  };
  const refreshTokenPersistencyService = {
    createAndSave: vi.fn(),
  } as unknown as RefreshTokenPersistencyService;
  const accessTokenDuration = 15;
  const refreshTokenDuration = 30;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Positive cases", () => {
    test(`should return an access token, a refresh token and user's data`, async () => {
      const mockAccessToken = "this-should-be-an-acccess-token";
      const mockRefreshToken = "this-should-be-a-refresh-token";
      userRepository.getByEmail.mockResolvedValue(mockUserEntity);
      strongHasher.compare.mockResolvedValue(true);
      tokenProvider.generate.mockReturnValue(mockAccessToken);
      // @ts-expect-error
      refreshTokenPersistencyService.createAndSave.mockResolvedValue(
        mockRefreshToken,
      );

      const getByEmailSPy = vi.spyOn(userRepository, "getByEmail");
      const compareHashSpy = vi.spyOn(strongHasher, "compare");
      const generateTokenSpy = vi.spyOn(tokenProvider, "generate");
      const createAndSaveRefreshTokenSpy = vi.spyOn(
        refreshTokenPersistencyService,
        "createAndSave",
      );

      const loginUseCase = new LoginUseCase({
        refreshTokenDuration,
        accessTokenDuration,
        userRepository,
        refreshTokenPersistencyService,
        tokenProvider,
        strongHasher,
      });

      const result = await loginUseCase.execute(mockLoginData);

      expect(getByEmailSPy).toHaveBeenCalledWith(mockLoginData.email);
      expect(compareHashSpy).toHaveBeenCalledWith(
        mockLoginData.password,
        mockUserEntity.password,
      );

      expect(generateTokenSpy).toHaveBeenCalledWith(
        { sub: { id: mockUserEntity.id }, type: "access" },
        accessTokenDuration,
      );

      expect(createAndSaveRefreshTokenSpy).toHaveBeenCalledWith({
        userId: mockUserEntity.id,
        refreshTokenDuration,
      });

      expect(result).toMatchObject({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        data: { user: expect.any(Object) },
      });
    });
  });

  describe("Negative cases", () => {
    test(`should throw an error if there isn't an user registered with given email`, async () => {
      userRepository.getByEmail.mockResolvedValue(null);
      const notFoundSpy = vi.spyOn(CustomError, "notFound");

      const loginUseCase = new LoginUseCase({
        refreshTokenDuration,
        accessTokenDuration,
        userRepository,
        refreshTokenPersistencyService,
        tokenProvider,
        strongHasher,
      });

      await expect(
        async () => await loginUseCase.execute(mockLoginData),
      ).rejects.toThrow(expect.any(CustomError));

      expect(notFoundSpy).toHaveBeenCalled();
    });

    test(`should throw an error if given password doesn't match with the hashed one`, async () => {
      const unauthorizedSpy = vi.spyOn(CustomError, "unauthorized");
      userRepository.getByEmail.mockResolvedValue({
        password: "this-should-be-a-hash",
      });
      strongHasher.compare.mockResolvedValue(false);

      const loginUseCase = new LoginUseCase({
        refreshTokenDuration,
        accessTokenDuration,
        userRepository,
        refreshTokenPersistencyService,
        tokenProvider,
        strongHasher,
      });

      await expect(
        async () => await loginUseCase.execute(mockLoginData),
      ).rejects.toThrow(expect.any(CustomError));

      expect(unauthorizedSpy).toHaveBeenCalledWith(
        expect.objectContaining({ code: ErrorCodes.UNAUTHORIZED }),
      );
    });
  });
});
