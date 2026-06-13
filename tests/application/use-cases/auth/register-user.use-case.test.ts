import { beforeEach, describe, expect, test, vi } from "vitest";
import { RefreshTokenPersistencyService } from "../../../../src/domain/services/refresh-token-persistency.service";
import { mockRegisterData, mockUserEntity } from "../../../fixtures/use-cases";
import { RegisterUserUseCase } from "../../../../src/application/use-cases/auth/register-user.use-case";
import {
  CustomError,
  ErrorCodes,
} from "../../../../src/domain/errors/custom-error";

describe("Register use case", () => {
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

  beforeEach(() => vi.resetAllMocks());

  describe("Positive cases", () => {
    test(`should return an access token, a refresh token and user's non-sensitive data`, async () => {
      const mockHashedPassword = "this-should-be-a-hash";
      const mockAccessToken = "this-should-be-an-access-token";
      const mockRefreshToken = "this-should-be-an-refresh-token";

      userRepository.getByEmail.mockResolvedValue(null);
      strongHasher.hash.mockResolvedValue(mockHashedPassword);
      userRepository.register.mockResolvedValue(mockUserEntity);
      tokenProvider.generate.mockReturnValue(mockAccessToken);
      refreshTokenPersistencyService.createAndSave.mockResolvedValue(
        mockRefreshToken,
      );

      const getByEmailSpy = vi.spyOn(userRepository, "getByEmail");
      const hashSpy = vi.spyOn(strongHasher, "hash");
      const registerSpy = vi.spyOn(userRepository, "register");
      const generateSpy = vi.spyOn(tokenProvider, "generate");
      const createAndSaveSpy = vi.spyOn(
        refreshTokenPersistencyService,
        "createAndSave",
      );

      const registerUseCase = new RegisterUserUseCase({
        accessTokenDuration,
        refreshTokenDuration,
        refreshTokenPersistencyService,
        strongHasher,
        tokenProvider,
        userRepository,
      });

      const result = await registerUseCase.execute(mockRegisterData);

      expect(getByEmailSpy).toHaveBeenCalledWith(mockRegisterData.email);
      expect(hashSpy).toHaveBeenCalledWith(mockRegisterData.password);
      expect(registerSpy).toHaveBeenCalledWith({
        email: mockRegisterData.email,
        password: mockHashedPassword,
        name: mockRegisterData.name,
      });
      expect(generateSpy).toHaveBeenCalledWith(
        { sub: { id: expect.any(Number) }, type: "access" },
        accessTokenDuration,
      );
      expect(createAndSaveSpy).toHaveBeenCalledWith({
        userId: mockUserEntity.id,
        refreshTokenDuration,
      });

      expect(result).toMatchObject({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        data: { user: expect.any(Object) },
      });

      expect(result.data.user).not.toHaveProperty("password");
    });
  });

  describe("Negative cases", () => {
    test(`should throw an error if there's already an user registered with given email`, async () => {
      userRepository.getByEmail.mockResolvedValue(mockUserEntity);

      const badRequestSpy = vi.spyOn(CustomError, "badRequest");
      const registerUseCase = new RegisterUserUseCase({
        accessTokenDuration,
        refreshTokenDuration,
        refreshTokenPersistencyService,
        strongHasher,
        tokenProvider,
        userRepository,
      });

      await expect(async () =>
        registerUseCase.execute(mockRegisterData),
      ).rejects.toThrow(expect.any(CustomError));

      expect(badRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({ code: ErrorCodes.ALREADY_REGISTERED }),
      );
    });
  });
});
