import { beforeEach, describe, test, vi } from "vitest";
import { LoginUseCase } from "../../../../src/application/use-cases/auth/login-user.use-case";
import { AuthRepository } from "../../../../src/domain/repositories";
import {
  RegisterUserDto,
  TokenPayload,
} from "../../../../src/application/dtos";
import { UserEntity } from "../../../../src/domain/entities/user.entity";
import { TokenProvider } from "../../../../src/domain/services/token-generator.service";
import { HasherService } from "../../../../src/domain/services/hasher.service";
import { RefreshTokenPersistencyService } from "../../../../src/domain/services/refresh-token-persistency.service";
describe("Login use case", () => {
  describe("Negative cases", () => {
    const authRepository: AuthRepository = {
      register: function (
        registerUserDto: RegisterUserDto,
      ): Promise<UserEntity> {
        throw new Error("Function not implemented.");
      },
      getByEmail: function (email: string): Promise<UserEntity | null> {
        throw new Error("Function not implemented.");
      },
      getById: function (userId: number): Promise<UserEntity | null> {
        throw new Error("Function not implemented.");
      },
    };
    const tokenProvider: TokenProvider = {
      generate: function (payload: TokenPayload, duration: number): string {
        throw new Error("Function not implemented.");
      },
      validate: function (token: string): TokenPayload | null {
        throw new Error("Function not implemented.");
      },
    };
    const strongHasher: HasherService = {
      hash: function (inputText: string): Promise<string> {
        throw new Error("Function not implemented.");
      },
      compare: function (inputText: string, hashed: string): Promise<boolean> {
        throw new Error("Function not implemented.");
      },
    };
    const refreshTokenPersistencyService = {
      createAndSave: vi.fn(),
    } as unknown as RefreshTokenPersistencyService;
    const accessTokenDuration = 15;
    const refreshTokenDuration = 30;
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("should first", () => {
      const loginUseCase = new LoginUseCase({
        refreshTokenDuration,
        accessTokenDuration,
        authRepository,
        refreshTokenPersistencyService,
        tokenProvider,
        strongHasher,
      });
    });
  });
});
